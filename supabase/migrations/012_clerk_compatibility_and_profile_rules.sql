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

-- 2. Drop all policies that depend on public.profiles or its columns
-- (PostgreSQL blocks altering a column type if ANY policy in storage or tables references it)
DO $$
DECLARE
    pol RECORD;
BEGIN
    -- Dynamically drop any policy across any schema (e.g. storage, public) that references public.profiles
    FOR pol IN (
        SELECT 
            p.polname,
            c.relname AS table_name,
            n.nspname AS schema_name
        FROM pg_policy p
        JOIN pg_class c ON p.polrelid = c.oid
        JOIN pg_namespace n ON c.relnamespace = n.oid
        WHERE p.oid IN (
            SELECT objid 
            FROM pg_depend 
            WHERE refobjid = 'public.profiles'::regclass 
              AND classid = 'pg_policy'::regclass
        )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.polname, pol.schema_name, pol.table_name);
    END LOOP;
END $$;

-- Also explicitly drop known storage and table policies to ensure clean state
DROP POLICY IF EXISTS "Doctors can view all prescription PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Doctors can insert prescription PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Doctors can update prescription PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own avatars" ON storage.objects;

DROP POLICY IF EXISTS "Users can select own profile" ON public.profiles;
DROP POLICY IF EXISTS "Doctors can select all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

DROP POLICY IF EXISTS "Patients can insert their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Patients can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can manage their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Doctors can manage their own availability rules" ON public.availability_rules;
DROP POLICY IF EXISTS "Doctors can manage their own availability exceptions" ON public.availability_exceptions;

DROP POLICY IF EXISTS "Patients can view own prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Doctors can view all prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Doctors can insert prescriptions" ON public.prescriptions;
DROP POLICY IF EXISTS "Doctors can update own prescriptions" ON public.prescriptions;

DROP POLICY IF EXISTS "Doctors can manage their own medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Patients can view their own medical records" ON public.medical_records;

DROP POLICY IF EXISTS "Patients can manage their own vitals" ON public.vitals;
DROP POLICY IF EXISTS "Doctors can view vitals of their patients" ON public.vitals;

DROP POLICY IF EXISTS "Patients can insert their own emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Doctors can view all emergencies" ON public.emergencies;
DROP POLICY IF EXISTS "Doctors can update all emergencies" ON public.emergencies;

DROP POLICY IF EXISTS "Patients can insert their own symptom checks" ON public.symptom_checks;
DROP POLICY IF EXISTS "Doctors can view all symptom checks" ON public.symptom_checks;

-- 3. Drop the Supabase auth.users foreign key constraint (since Clerk manages auth)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 4. Drop existing foreign key constraints on referencing tables to allow column type migration
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

-- 5. Convert profiles.id and all foreign key IDs from UUID to TEXT (to accept Clerk IDs like 'user_2xyz...')
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

-- 6. Re-attach foreign key constraints pointing to public.profiles(id)
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

-- 7. Add database-level validation checks:
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

-- 8. Recreate clean Clerk-compatible RLS policies for storage & tables
DROP POLICY IF EXISTS "Allow public read on avatars" ON storage.objects;
CREATE POLICY "Allow public read on avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow uploads to avatars" ON storage.objects;
CREATE POLICY "Allow uploads to avatars" ON storage.objects
  FOR ALL USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Allow access to prescriptions bucket" ON storage.objects;
CREATE POLICY "Allow access to prescriptions bucket" ON storage.objects
  FOR ALL USING (bucket_id = 'prescriptions') WITH CHECK (bucket_id = 'prescriptions');

DROP POLICY IF EXISTS "Allow all profile access" ON public.profiles;
CREATE POLICY "Allow all profile access" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);

-- 9. Remove Supabase Auth trigger (since Clerk handles user registration)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
