-- CareVerse: profiles table extensions & avatars storage configuration

-- 1. Add new columns to profiles table
alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists avatar_url text;

-- 2. Ensure storage schema is active and create the avatars bucket
-- Note: 'storage' is a default Supabase schema for file management
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- 3. Storage bucket Row Level Security (RLS) Policies
-- Allow public access to read files in the 'avatars' bucket (since it's marked public)
create policy "Allow public access to avatars"
on storage.objects for select
to public
using (bucket_id = 'avatars');

-- Allow authenticated users to upload files to their own subfolder (named after their auth.uid())
create policy "Allow users to upload avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update files in their own subfolder
create policy "Allow users to update own avatars"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete files in their own subfolder
create policy "Allow users to delete own avatars"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);
