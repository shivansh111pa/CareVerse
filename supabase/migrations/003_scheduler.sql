-- Create availability_rules table
CREATE TABLE public.availability_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create availability_exceptions table
CREATE TABLE public.availability_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false,
    custom_start TIME,
    custom_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'checked_in', 'completed', 'cancelled')),
    reason TEXT,
    mode TEXT NOT NULL CHECK (mode IN ('in_person', 'telehealth')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE (doctor_id, start_time)
);

-- Enable RLS
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Policies for availability_rules
CREATE POLICY "Doctors can manage their own availability rules"
ON public.availability_rules
FOR ALL
USING (auth.uid() = doctor_id)
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Anyone can view availability rules"
ON public.availability_rules
FOR SELECT
USING (true);

-- Policies for availability_exceptions
CREATE POLICY "Doctors can manage their own availability exceptions"
ON public.availability_exceptions
FOR ALL
USING (auth.uid() = doctor_id)
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Anyone can view availability exceptions"
ON public.availability_exceptions
FOR SELECT
USING (true);

-- Policies for appointments
CREATE POLICY "Patients can insert their own appointments"
ON public.appointments
FOR INSERT
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can view their own appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can manage their own appointments"
ON public.appointments
FOR ALL
USING (auth.uid() = doctor_id)
WITH CHECK (auth.uid() = doctor_id);

-- Enable realtime for appointments
alter publication supabase_realtime add table public.appointments;
