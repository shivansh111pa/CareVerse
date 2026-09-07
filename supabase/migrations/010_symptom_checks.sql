-- Create symptom_checks table
CREATE TABLE public.symptom_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL,
  ai_response JSONB,
  urgency_level TEXT CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.symptom_checks ENABLE ROW LEVEL SECURITY;

-- Patients can read their own symptom checks
CREATE POLICY "Patients can view their own symptom checks"
  ON public.symptom_checks
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own symptom checks
CREATE POLICY "Patients can insert their own symptom checks"
  ON public.symptom_checks
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Doctors can read all symptom checks
CREATE POLICY "Doctors can view all symptom checks"
  ON public.symptom_checks
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Service role will need to bypass RLS or use the patient context.
-- Because our API route will use the server client, it can insert as the patient.
