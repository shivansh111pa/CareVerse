-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  diagnosis TEXT,
  medicines JSONB NOT NULL DEFAULT '[]'::jsonb,
  general_notes TEXT,
  pdf_url TEXT,
  status TEXT CHECK (status IN ('Active', 'Completed')) DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on prescriptions
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Prescriptions RLS Policies
CREATE POLICY "Patients can view their own prescriptions"
  ON public.prescriptions
  FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view all prescriptions"
  ON public.prescriptions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

CREATE POLICY "Doctors can insert prescriptions"
  ON public.prescriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

CREATE POLICY "Doctors can update prescriptions"
  ON public.prescriptions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

-- Create prescriptions storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', true);

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Storage RLS Policies for prescriptions bucket
-- Note: we use (storage.foldername(name))[1] to get the patient_id folder
CREATE POLICY "Patients can view their own prescription PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'prescriptions' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Doctors can view all prescription PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'prescriptions' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

CREATE POLICY "Doctors can insert prescription PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'prescriptions' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );

CREATE POLICY "Doctors can update prescription PDFs"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'prescriptions' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'doctor'
    )
  );
