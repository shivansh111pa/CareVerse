import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

// We use the service role key to insert records safely from the server.
// If missing, fallback to anon key but relying on user session from cookies.
// The createClient() from server uses cookies to attach user session.

const RED_FLAGS = [
  "chest pain",
  "difficulty breathing",
  "can't breathe",
  "shortness of breath",
  "uncontrolled bleeding",
  "stroke",
  "slurred speech",
  "face drooping",
  "suicid",
  "kill myself",
  "heart attack"
];

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { symptoms } = await req.json();
    
    if (!symptoms || typeof symptoms !== "string") {
      return NextResponse.json({ error: "Invalid symptoms input" }, { status: 400 });
    }

    const patientId = session.user.id;

    // 1. Deterministic Red Flag Check
    const lowerInput = symptoms.toLowerCase();
    const hasRedFlag = RED_FLAGS.some(flag => lowerInput.includes(flag));

    if (hasRedFlag) {
      // Log as emergency without AI call
      const responsePayload = {
        message: "Your symptoms indicate a potential medical emergency. Please proceed to the SOS flow immediately.",
        causes: ["Medical Emergency"],
      };

      // @ts-ignore
      const { error: dbError } = await supabase.from("symptom_checks" as any).insert({
        patient_id: patientId,
        input_text: symptoms,
        ai_response: responsePayload,
        urgency_level: "emergency"
      } as any);

      if (dbError) {
        console.error("Failed to save emergency symptom check:", dbError);
      }

      return NextResponse.json({
        urgency_level: "emergency",
        ai_response: responsePayload
      });
    }

    // 2. Call Anthropic API
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is currently unavailable (Missing API Key)." }, { status: 503 });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are a medical triage AI assistant for CareVerse. 
Your goal is to evaluate the patient's symptoms and provide a preliminary triage assessment.
CRITICAL RULES:
1. Provide a list of general possible causes based on the symptoms.
2. Determine an urgency level from this exact list: 'low', 'medium', 'high'. Do not use 'emergency'.
3. EXPLICITLY AVOID naming specific drugs, dosages, or treatments. Do not recommend taking any medication by name.
4. Always end your response with the exact phrase: "This is not a diagnosis — please consult Dr. Pandey."

Respond ONLY with valid JSON in the following format:
{
  "causes": ["cause 1", "cause 2"],
  "urgency_level": "low|medium|high",
  "message": "Your sympathetic yet objective triage message here... This is not a diagnosis — please consult Dr. Pandey."
}`;

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      temperature: 0,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Patient symptoms: ${symptoms}`
        }
      ]
    });

    // Parse the JSON response
    let aiPayload;
    try {
      const responseText = (msg.content[0] as any).text;
      // Find JSON block if Claude wrapped it
      const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      aiPayload = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Anthropic response:", e);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Validate urgency level
    const validUrgencies = ["low", "medium", "high"];
    const urgency = validUrgencies.includes(aiPayload.urgency_level) ? aiPayload.urgency_level : "medium";

    // 3. Save to database
    // @ts-ignore
    const { error: dbError } = await supabase.from("symptom_checks" as any).insert({
      patient_id: patientId,
      input_text: symptoms,
      ai_response: aiPayload,
      urgency_level: urgency
    } as any);

    if (dbError) {
      console.error("Failed to save symptom check:", dbError);
    }

    return NextResponse.json({
      urgency_level: urgency,
      ai_response: aiPayload
    });

  } catch (error: any) {
    console.error("Symptom API Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
