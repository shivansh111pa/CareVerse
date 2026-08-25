-- Add payment tracking columns to appointments table
ALTER TABLE public.appointments
ADD COLUMN payment_method TEXT CHECK (payment_method IN ('cash', 'upi')) DEFAULT 'cash',
ADD COLUMN payment_amount NUMERIC DEFAULT 0;
