-- Create emergencies table
CREATE TABLE public.emergencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symptom_check_id UUID REFERENCES public.symptom_checks(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('open', 'acknowledged', 'resolved')) DEFAULT 'open',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.emergencies ENABLE ROW LEVEL SECURITY;

-- Patients can view their own emergencies
CREATE POLICY "Patients can view their own emergencies"
  ON public.emergencies
  FOR SELECT
  USING (auth.uid() = patient_id);

-- Patients can insert their own emergencies
CREATE POLICY "Patients can insert their own emergencies"
  ON public.emergencies
  FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Doctors can view all emergencies
CREATE POLICY "Doctors can view all emergencies"
  ON public.emergencies
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Doctors can update all emergencies
CREATE POLICY "Doctors can update all emergencies"
  ON public.emergencies
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Add emergencies table to the supabase_realtime publication
-- This enables clients to listen for changes
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'emergencies'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.emergencies;
  END IF;
END $$;
