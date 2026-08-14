-- CareVerse: profiles table, auto-insert trigger, and RLS policies

-- ---------------------------------------------------------------------------
-- Custom types
-- ---------------------------------------------------------------------------
create type public.user_role as enum ('patient', 'doctor');

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  role       public.user_role not null default 'patient',
  full_name  text not null default '',
  phone      text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Extended user profile keyed to Supabase Auth users';

-- ---------------------------------------------------------------------------
-- Auto-insert profile on signup
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can select own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Doctors can read all profiles (for future dashboard)
create policy "Doctors can select all profiles"
  on public.profiles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles p
      where p.id = auth.uid()
        and p.role = 'doctor'
    )
  );

-- Users can update only their own profile (role changes excluded via column grant)
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Prevent authenticated users from changing their own role via client updates.
-- Service role / migrations can still set role (e.g. seed script).
revoke update (role) on public.profiles from authenticated;

-- ---------------------------------------------------------------------------
-- Helper: resolve role for middleware (optional RPC, used server-side)
-- ---------------------------------------------------------------------------
create or replace function public.get_my_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function public.get_my_role() to authenticated;
