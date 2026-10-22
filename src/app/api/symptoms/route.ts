import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createAdminClient } from "@/lib/supabase/admin";

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
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const patientId = userId;
    const supabase = createAdminClient();

    const { symptoms } = await req.json();
    
    if (!symptoms || typeof symptoms !== "string") {
      return NextResponse.json({ error: "Invalid symptoms input" }, { status: 400 });
    }

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

    // 2. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI service is currently unavailable (Missing API Key)." }, { status: 503 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemPrompt = `You are a medical triage AI assistant for CareVerse. 
Your goal is to evaluate the patient's symptoms and provide a preliminary triage assessment.
CRITICAL RULES:
1. You MUST ONLY answer medical-related questions and symptom evaluations. If the input is not related to health, medicine, or symptoms, refuse to answer and state that you can only assist with medical questions in the message field (with empty causes and 'low' urgency).
2. Provide a list of general possible causes based on the symptoms.
3. Determine an urgency level from this exact list: 'low', 'medium', 'high'. Do not use 'emergency'.
4. EXPLICITLY AVOID naming specific drugs, dosages, or treatments. Do not recommend taking any medication by name.
5. Always end your response with the exact phrase: "This is not a diagnosis — please consult Dr. Pandey."

Respond ONLY with valid JSON in the following format (do not include markdown codeblocks, just the raw JSON object):
{
  "causes": ["cause 1", "cause 2"],
  "urgency_level": "low|medium|high",
  "message": "Your sympathetic yet objective triage message here... This is not a diagnosis — please consult Dr. Pandey."
}`;

    const prompt = `${systemPrompt}\n\nPatient symptoms: ${symptoms}`;

    let aiPayload;
    let lastError: any = null;
    const modelNames = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash"];

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        try {
          const jsonStr = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
          aiPayload = JSON.parse(jsonStr);
          lastError = null;
          break; // Success!
        } catch (parseError) {
          console.error(`Gemini (${modelName}) returned invalid JSON:`, responseText);
        }
      } catch (e: any) {
        console.error(`Gemini SDK Error with model ${modelName}:`, e);
        lastError = e;
      }
    }

    if (!aiPayload) {
      console.warn("Gemini fallback triage engaged:", lastError?.message);
      aiPayload = {
        causes: ["Symptom assessment logged for clinical review"],
        urgency_level: "medium",
        message: "Your symptoms have been safely recorded. Please consult Dr. Pandey for a comprehensive clinical assessment. This is not a diagnosis — please consult Dr. Pandey."
      };
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
