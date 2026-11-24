create table public.behparvar_okr_meetings (
 id uuid primary key default gen_random_uuid(),
 host_id uuid not null default auth.uid() references auth.users(id),
 partner_id uuid not null references auth.users(id),
 scheduled_at timestamptz not null,
 topics text not null default '',
 notes text not null default '',
 tasks jsonb not null default '[]' check(jsonb_typeof(tasks)='array'),
 revision bigint not null default 0,
 check(host_id<>partner_id)
);
create index on public.behparvar_okr_meetings(partner_id,scheduled_at);
create index on public.behparvar_okr_meetings(host_id,scheduled_at);
create table public.behparvar_okr_private_notes (
 meeting_id uuid references public.behparvar_okr_meetings(id) on delete cascade,
 author_id uuid default auth.uid() references auth.users(id),
 note text not null,
 revision bigint not null default 0,
 primary key(meeting_id,author_id)
);
alter table public.behparvar_okr_meetings enable row level security;
alter table public.behparvar_okr_private_notes enable row level security;
revoke all on public.behparvar_okr_meetings, public.behparvar_okr_private_notes from public,anon,authenticated;
grant select on public.behparvar_okr_meetings, public.behparvar_okr_private_notes to authenticated;
grant insert(partner_id,scheduled_at,topics) on public.behparvar_okr_meetings to authenticated;
grant update(scheduled_at,topics,notes,tasks,revision) on public.behparvar_okr_meetings to authenticated;
grant insert(meeting_id,note),update(note,revision) on public.behparvar_okr_private_notes to authenticated;
create function public.behparvar_okr_directory()
returns table(user_id uuid, display_name text)
language sql stable security definer set search_path = '' as $$
 select m.user_id,coalesce(nullif(u.raw_user_meta_data->>'full_name',''),u.email,m.user_id::text)
 from public.behparvar_okr_members m join auth.users u on u.id=m.user_id
 where exists(select 1 from public.behparvar_okr_members caller where caller.user_id=(select auth.uid()));
$$;
revoke all on function public.behparvar_okr_directory() from public,anon;
grant execute on function public.behparvar_okr_directory() to authenticated;
create policy meeting_read on public.behparvar_okr_meetings for select to authenticated using (
 (select auth.uid()) in (host_id,partner_id) and exists(select 1 from public.behparvar_okr_members)
);
create policy meeting_schedule on public.behparvar_okr_meetings for insert to authenticated with check (
 host_id=(select auth.uid()) and exists(select 1 from public.behparvar_okr_members where role='admin')
 and partner_id in (select user_id from public.behparvar_okr_directory())
);
create policy meeting_change on public.behparvar_okr_meetings for update to authenticated using (
 (select auth.uid()) in (host_id,partner_id) and exists(select 1 from public.behparvar_okr_members where role='admin')
) with check ((select auth.uid()) in (host_id,partner_id));
create policy personal_read on public.behparvar_okr_private_notes for select to authenticated using(
 author_id=(select auth.uid()) and exists(select 1 from public.behparvar_okr_meetings m where m.id=meeting_id)
);
create policy personal_write on public.behparvar_okr_private_notes for insert to authenticated with check(
 author_id=(select auth.uid()) and exists(select 1 from public.behparvar_okr_meetings m where m.id=meeting_id)
);
create policy personal_edit on public.behparvar_okr_private_notes for update to authenticated using(
 author_id=(select auth.uid()) and exists(select 1 from public.behparvar_okr_meetings m where m.id=meeting_id)
) with check(author_id=(select auth.uid()));
