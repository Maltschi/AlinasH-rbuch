-- Supabase SQL Editor: einmal komplett ausführen.
create table if not exists public.chapters_draft(id uuid primary key,title text not null default '',description text not null default '',file_name text not null default '',file_path text not null,duration text not null default '',sort_order integer not null);
create table if not exists public.chapters_public(id uuid primary key,title text not null default '',description text not null default '',file_name text not null default '',file_path text not null,duration text not null default '',sort_order integer not null);
alter table public.chapters_draft enable row level security;
alter table public.chapters_public enable row level security;
create policy "draft anon all" on public.chapters_draft for all to anon using(true) with check(true);
create policy "public anon read" on public.chapters_public for select to anon using(true);
create policy "public anon insert" on public.chapters_public for insert to anon with check(true);
create policy "public anon delete" on public.chapters_public for delete to anon using(true);
-- Danach in Storage einen PUBLIC bucket namens audio anlegen.
create policy "audio anon read" on storage.objects for select to anon using(bucket_id='audio');
create policy "audio anon insert" on storage.objects for insert to anon with check(bucket_id='audio');
create policy "audio anon update" on storage.objects for update to anon using(bucket_id='audio') with check(bucket_id='audio');
create policy "audio anon delete" on storage.objects for delete to anon using(bucket_id='audio');