-- CampLog MVP schema for Supabase Postgres
-- Assumes auth.users is managed by Supabase Auth.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.camp_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  camp_date date not null,
  location_name text not null,
  weather text not null check (weather in ('sunny', 'cloudy', 'rainy', 'snowy', 'windy', 'foggy')),
  campsite_type text not null check (campsite_type in ('free', 'sectioned', 'auto', 'glamping', 'other')),
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.log_media (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.camp_logs (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  storage_path text not null,
  public_url text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gear_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category text not null,
  brand text,
  memo text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.log_gear_items (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.camp_logs (id) on delete cascade,
  gear_item_id uuid not null references public.gear_items (id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (log_id, gear_item_id)
);

create index if not exists camp_logs_user_id_camp_date_idx
  on public.camp_logs (user_id, camp_date desc);

create index if not exists log_media_log_id_sort_order_idx
  on public.log_media (log_id, sort_order asc);

create index if not exists gear_items_user_id_category_idx
  on public.gear_items (user_id, category);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(excluded.display_name, public.profiles.display_name),
      updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_camp_logs_updated_at on public.camp_logs;
create trigger set_camp_logs_updated_at
before update on public.camp_logs
for each row execute procedure public.set_updated_at();

drop trigger if exists set_gear_items_updated_at on public.gear_items;
create trigger set_gear_items_updated_at
before update on public.gear_items
for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.camp_logs enable row level security;
alter table public.log_media enable row level security;
alter table public.gear_items enable row level security;
alter table public.log_gear_items enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id);

create policy "camp_logs_select_own"
on public.camp_logs
for select
using (auth.uid() = user_id);

create policy "camp_logs_insert_own"
on public.camp_logs
for insert
with check (auth.uid() = user_id);

create policy "camp_logs_update_own"
on public.camp_logs
for update
using (auth.uid() = user_id);

create policy "camp_logs_delete_own"
on public.camp_logs
for delete
using (auth.uid() = user_id);

create policy "log_media_select_own"
on public.log_media
for select
using (auth.uid() = user_id);

create policy "log_media_insert_own"
on public.log_media
for insert
with check (auth.uid() = user_id);

create policy "log_media_update_own"
on public.log_media
for update
using (auth.uid() = user_id);

create policy "log_media_delete_own"
on public.log_media
for delete
using (auth.uid() = user_id);

create policy "gear_items_select_own"
on public.gear_items
for select
using (auth.uid() = user_id);

create policy "gear_items_insert_own"
on public.gear_items
for insert
with check (auth.uid() = user_id);

create policy "gear_items_update_own"
on public.gear_items
for update
using (auth.uid() = user_id);

create policy "gear_items_delete_own"
on public.gear_items
for delete
using (auth.uid() = user_id);

create policy "log_gear_items_select_own"
on public.log_gear_items
for select
using (
  exists (
    select 1
    from public.camp_logs cl
    where cl.id = log_gear_items.log_id
      and cl.user_id = auth.uid()
  )
);

create policy "log_gear_items_insert_own"
on public.log_gear_items
for insert
with check (
  exists (
    select 1
    from public.camp_logs cl
    join public.gear_items gi on gi.id = log_gear_items.gear_item_id
    where cl.id = log_gear_items.log_id
      and cl.user_id = auth.uid()
      and gi.user_id = auth.uid()
  )
);

create policy "log_gear_items_delete_own"
on public.log_gear_items
for delete
using (
  exists (
    select 1
    from public.camp_logs cl
    where cl.id = log_gear_items.log_id
      and cl.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public)
values ('camp-media', 'camp-media', false)
on conflict (id) do nothing;

create policy "camp_media_bucket_select_own"
on storage.objects
for select
using (
  bucket_id = 'camp-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "camp_media_bucket_insert_own"
on storage.objects
for insert
with check (
  bucket_id = 'camp-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "camp_media_bucket_update_own"
on storage.objects
for update
using (
  bucket_id = 'camp-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "camp_media_bucket_delete_own"
on storage.objects
for delete
using (
  bucket_id = 'camp-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);
