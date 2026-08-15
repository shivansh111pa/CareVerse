-- CareVerse: custom claims in JWT via auth.users.raw_app_meta_data

-- 1. Create a function to update the user's raw_app_meta_data
create or replace function public.handle_profile_role_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new.role)
  where id = new.id;
  return new;
end;
$$;

-- 2. Drop trigger if exists (idempotency)
drop trigger if exists on_profile_role_update on public.profiles;

-- 3. Create the trigger on public.profiles
create trigger on_profile_role_update
  after insert or update of role on public.profiles
  for each row
  execute function public.handle_profile_role_update();

-- 4. Backfill existing users
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', p.role)
from public.profiles p
where p.id = auth.users.id;
