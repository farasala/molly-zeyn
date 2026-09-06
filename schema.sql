-- English Studio — Supabase schema + RLS
-- Run in the Supabase SQL editor (Stage 1). Safe to re-run.

-- ============================================================ profiles
create table if not exists public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  full_name    text not null,
  role         text not null default 'student' check (role in ('student','teacher')),
  avatar_color text not null default 'var(--pink-500)',
  created_at   timestamptz not null default now()
);

-- create a profile automatically on sign-up; name + role come from user metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Nothing should be able to call the trigger function over the REST API.
-- Postgres does not check EXECUTE for trigger functions, so the trigger keeps working.
revoke execute on function public.handle_new_user() from anon, authenticated, public;

-- ============================================================ groups
create table if not exists public.groups (
  id         uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id   uuid not null references public.groups(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  added_at   timestamptz not null default now(),
  primary key (group_id, student_id)
);

-- true when the teacher and the student share at least one group
create or replace function public.teaches(_teacher uuid, _student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.group_members gm
    join public.groups g on g.id = gm.group_id
    where g.teacher_id = _teacher and gm.student_id = _student
  );
$$;

-- ============================================================ progress
create table if not exists public.activity_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  level_id   text not null,
  unit_n     int  not null,
  lesson_id  text,                       -- '1A' for practice, null for a unit test
  kind       text not null check (kind in ('practice','test')),
  score      int  not null check (score >= 0),
  total      int  not null check (total > 0),
  xp         int  not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists activity_results_user_idx on public.activity_results (user_id, level_id, unit_n);

create table if not exists public.known_words (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  level_id   text not null,
  word       text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, level_id, word)
);

-- ============================================================ homework (stage 6)
create table if not exists public.homework (
  id           uuid primary key default gen_random_uuid(),
  teacher_id   uuid not null references public.profiles(id) on delete cascade,
  group_id     uuid references public.groups(id) on delete cascade,
  student_id   uuid references public.profiles(id) on delete cascade,
  title        text not null,
  instructions text,
  lesson_ref   text,                     -- e.g. '1A' or 'U1'
  due_at       timestamptz,
  created_at   timestamptz not null default now(),
  constraint homework_target check (group_id is not null or student_id is not null)
);

create table if not exists public.homework_submissions (
  id           uuid primary key default gen_random_uuid(),
  homework_id  uuid not null references public.homework(id) on delete cascade,
  student_id   uuid not null references public.profiles(id) on delete cascade,
  body         text,
  file_path    text,                     -- 'homework/<student_id>/<file>'
  status       text not null default 'submitted' check (status in ('submitted','reviewed')),
  grade        text,
  feedback     text,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  unique (homework_id, student_id)
);

-- ============================================================ RLS
alter table public.profiles             enable row level security;
alter table public.groups               enable row level security;
alter table public.group_members        enable row level security;
alter table public.activity_results     enable row level security;
alter table public.known_words          enable row level security;
alter table public.homework             enable row level security;
alter table public.homework_submissions enable row level security;

-- profiles: own row read/write; teacher reads their students
drop policy if exists profiles_self       on public.profiles;
drop policy if exists profiles_self_write on public.profiles;
drop policy if exists profiles_teacher    on public.profiles;
create policy profiles_self       on public.profiles for select using (id = auth.uid());
create policy profiles_self_write on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_teacher    on public.profiles for select using (public.teaches(auth.uid(), id));

-- groups and group_members refer to each other, so the membership tests live
-- in security-definer functions. Inlining them as sub-selects makes each
-- policy read the other table, and Postgres refuses with
-- "infinite recursion detected in policy".
create or replace function public.is_group_teacher(_group uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.groups g where g.id = _group and g.teacher_id = auth.uid()
  );
$$;

create or replace function public.is_group_member(_group uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.group_members gm
    where gm.group_id = _group and gm.student_id = auth.uid()
  );
$$;

revoke execute on function public.is_group_teacher(uuid) from anon;
revoke execute on function public.is_group_member(uuid)  from anon;

-- groups: owned by the teacher; members may read their own group
drop policy if exists groups_owner  on public.groups;
drop policy if exists groups_member on public.groups;
create policy groups_owner  on public.groups for all
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy groups_member on public.groups for select using (public.is_group_member(id));

-- group_members: teacher manages; student sees their own membership
drop policy if exists gm_teacher on public.group_members;
drop policy if exists gm_self    on public.group_members;
create policy gm_teacher on public.group_members for all
  using (public.is_group_teacher(group_id))
  with check (public.is_group_teacher(group_id));
create policy gm_self on public.group_members for select using (student_id = auth.uid());

-- progress: student owns it, teacher reads it, teacher never writes it
drop policy if exists ar_self_read  on public.activity_results;
drop policy if exists ar_self_write on public.activity_results;
drop policy if exists ar_teacher    on public.activity_results;
create policy ar_self_read  on public.activity_results for select using (user_id = auth.uid());
create policy ar_self_write on public.activity_results for insert with check (user_id = auth.uid());
create policy ar_teacher    on public.activity_results for select using (public.teaches(auth.uid(), user_id));

drop policy if exists kw_self    on public.known_words;
drop policy if exists kw_teacher on public.known_words;
create policy kw_self    on public.known_words for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy kw_teacher on public.known_words for select using (public.teaches(auth.uid(), user_id));

-- homework: teacher owns the assignment; assigned students may read it
drop policy if exists hw_teacher on public.homework;
drop policy if exists hw_student on public.homework;
create policy hw_teacher on public.homework for all
  using (teacher_id = auth.uid()) with check (teacher_id = auth.uid());
create policy hw_student on public.homework for select using (
  student_id = auth.uid()
  or exists (select 1 from public.group_members gm where gm.group_id = homework.group_id and gm.student_id = auth.uid())
);

-- submissions: student writes their own; assigning teacher reads and grades
drop policy if exists hs_self    on public.homework_submissions;
drop policy if exists hs_teacher on public.homework_submissions;
create policy hs_self on public.homework_submissions for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy hs_teacher on public.homework_submissions for all
  using (exists (select 1 from public.homework h where h.id = homework_id and h.teacher_id = auth.uid()))
  with check (exists (select 1 from public.homework h where h.id = homework_id and h.teacher_id = auth.uid()));

-- ============================================================ storage
-- Create two buckets in the dashboard, then run this:
--   audio     — public  (the 92 mp3 files, uploaded under el/<slug>.mp3)
--   homework  — private (student uploads, first path segment = student id)
insert into storage.buckets (id, name, public) values ('audio','audio',true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('homework','homework',false)
  on conflict (id) do nothing;

drop policy if exists audio_public_read on storage.objects;
create policy audio_public_read on storage.objects for select using (bucket_id = 'audio');

drop policy if exists hw_files_own    on storage.objects;
drop policy if exists hw_files_teacher on storage.objects;
create policy hw_files_own on storage.objects for all
  using (bucket_id = 'homework' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'homework' and (storage.foldername(name))[1] = auth.uid()::text);
create policy hw_files_teacher on storage.objects for select using (
  bucket_id = 'homework'
  and public.teaches(auth.uid(), ((storage.foldername(name))[1])::uuid)
);
