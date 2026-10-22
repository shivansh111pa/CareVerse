-- ============================================================================
-- Migration 012: Clerk Compatibility, Profile Constraints (10-Digit Phone, Age <= 100)
-- Run this in the Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Ensure all profile medical & contact columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age integer;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight text;

-- 2. Drop ALL policies across public and storage schemas dynamically
-- This prevents "cannot alter type of a column used in a policy definition" on ANY table or column
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname IN ('public', 'storage')
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- 3. Drop obsolete Supabase Auth triggers & functions (since Clerk manages users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_profile_role_update ON public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_profile_role_update() CASCADE;

-- 4. Drop the Supabase auth.users foreign key constraint on profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 5. Drop existing foreign key constraints on referencing tables to allow column type migration
ALTER TABLE IF EXISTS public.appointments DROP CONSTRAINT IF EXISTS appointments_patient_id_fkey;
ALTER TABLE IF EXISTS public.appointments DROP CONSTRAINT IF EXISTS appointments_doctor_id_fkey;
ALTER TABLE IF EXISTS public.doctor_availability DROP CONSTRAINT IF EXISTS doctor_availability_doctor_id_fkey;
ALTER TABLE IF EXISTS public.appointment_slots DROP CONSTRAINT IF EXISTS appointment_slots_doctor_id_fkey;
ALTER TABLE IF EXISTS public.prescriptions DROP CONSTRAINT IF EXISTS prescriptions_patient_id_fkey;
ALTER TABLE IF EXISTS public.prescriptions DROP CONSTRAINT IF EXISTS prescriptions_doctor_id_fkey;
ALTER TABLE IF EXISTS public.medical_records DROP CONSTRAINT IF EXISTS medical_records_patient_id_fkey;
ALTER TABLE IF EXISTS public.medical_records DROP CONSTRAINT IF EXISTS medical_records_doctor_id_fkey;
ALTER TABLE IF EXISTS public.vitals DROP CONSTRAINT IF EXISTS vitals_patient_id_fkey;
ALTER TABLE IF EXISTS public.emergencies DROP CONSTRAINT IF EXISTS emergencies_patient_id_fkey;
ALTER TABLE IF EXISTS public.symptom_checks DROP CONSTRAINT IF EXISTS symptom_checks_patient_id_fkey;
ALTER TABLE IF EXISTS public.availability_rules DROP CONSTRAINT IF EXISTS availability_rules_doctor_id_fkey;
ALTER TABLE IF EXISTS public.availability_exceptions DROP CONSTRAINT IF EXISTS availability_exceptions_doctor_id_fkey;

-- 6. Convert profiles.id and all foreign key IDs from UUID to TEXT (to accept Clerk IDs like 'user_2xyz...')
ALTER TABLE public.profiles ALTER COLUMN id TYPE text;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
    ALTER TABLE public.appointments ALTER COLUMN patient_id TYPE text;
    ALTER TABLE public.appointments ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'doctor_availability') THEN
    ALTER TABLE public.doctor_availability ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointment_slots') THEN
    ALTER TABLE public.appointment_slots ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prescriptions') THEN
    ALTER TABLE public.prescriptions ALTER COLUMN patient_id TYPE text;
    ALTER TABLE public.prescriptions ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'medical_records') THEN
    ALTER TABLE public.medical_records ALTER COLUMN patient_id TYPE text;
    ALTER TABLE public.medical_records ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vitals') THEN
    ALTER TABLE public.vitals ALTER COLUMN patient_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emergencies') THEN
    ALTER TABLE public.emergencies ALTER COLUMN patient_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symptom_checks') THEN
    ALTER TABLE public.symptom_checks ALTER COLUMN patient_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'availability_rules') THEN
    ALTER TABLE public.availability_rules ALTER COLUMN doctor_id TYPE text;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'availability_exceptions') THEN
    ALTER TABLE public.availability_exceptions ALTER COLUMN doctor_id TYPE text;
  END IF;
END $$;

-- 7. Re-attach foreign key constraints pointing to public.profiles(id)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'appointments') THEN
    ALTER TABLE public.appointments 
      ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
      ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prescriptions') THEN
    ALTER TABLE public.prescriptions 
      ADD CONSTRAINT prescriptions_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
      ADD CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'medical_records') THEN
    ALTER TABLE public.medical_records 
      ADD CONSTRAINT medical_records_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
      ADD CONSTRAINT medical_records_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vitals') THEN
    ALTER TABLE public.vitals 
      ADD CONSTRAINT vitals_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'emergencies') THEN
    ALTER TABLE public.emergencies 
      ADD CONSTRAINT emergencies_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'symptom_checks') THEN
    ALTER TABLE public.symptom_checks 
      ADD CONSTRAINT symptom_checks_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 8. Add database-level validation checks:
--    - Mobile number must be exactly 10 digits
--    - Age must be between 1 and 100
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_age_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_age_check 
  CHECK (age IS NULL OR (age >= 1 AND age <= 100));

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_phone_check;
ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_phone_check 
  CHECK (phone IS NULL OR phone = '' OR phone ~ '^[0-9]{10}$');

-- 9. Disable RLS on application data tables
-- Since authentication is verified by Clerk at the app/middleware level, disabling RLS prevents
-- Supabase from rejecting Clerk requests due to missing auth.uid() tokens
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.medical_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.vitals DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.emergencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.symptom_checks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.availability_rules DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.availability_exceptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointment_slots DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.doctor_availability DISABLE ROW LEVEL SECURITY;

-- 10. Recreate clean Clerk-compatible storage policies
DROP POLICY IF EXISTS "Allow public read on avatars" ON storage.objects;
CREATE POLICY "Allow public read on avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow uploads to avatars" ON storage.objects;
CREATE POLICY "Allow uploads to avatars" ON storage.objects
  FOR ALL USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow access to prescriptions bucket" ON storage.objects;
CREATE POLICY "Allow access to prescriptions bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'prescriptions') WITH CHECK (bucket_id = 'prescriptions');
