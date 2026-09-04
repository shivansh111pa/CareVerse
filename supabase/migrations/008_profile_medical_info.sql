-- Add age, height, and weight to profiles table
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists height text;
alter table public.profiles add column if not exists weight text;
