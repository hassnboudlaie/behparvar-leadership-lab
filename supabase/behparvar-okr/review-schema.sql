create table public.behparvar_okr_cycles(
 id uuid primary key default gen_random_uuid(), creator_id uuid not null references auth.users(id),
 name text not null, description text not null, deadline date not null,
 frequency text not null check(frequency in ('once','quarterly','annual')), access text not null check(access in ('private','participant')),
 created_at timestamptz not null default now()
);
create table public.behparvar_okr_assessments(
 id uuid primary key default gen_random_uuid(),cycle_id uuid not null references public.behparvar_okr_cycles(id),
 subject_id uuid not null references auth.users(id),evaluator_id uuid not null references auth.users(id),
 kind text not null check(kind in ('self','manager')), answer text not null default '',
 completed boolean not null default false,revision bigint not null default 0,
 unique(cycle_id,subject_id,kind),check((kind='self')=(subject_id=evaluator_id))
);
create index on public.behparvar_okr_assessments(evaluator_id,cycle_id);
create index on public.behparvar_okr_assessments(subject_id,cycle_id);
alter table public.behparvar_okr_cycles enable row level security;
alter table public.behparvar_okr_assessments enable row level security;
revoke all on public.behparvar_okr_cycles,public.behparvar_okr_assessments from public,anon,authenticated;
grant select on public.behparvar_okr_cycles,public.behparvar_okr_assessments to authenticated;
-- Independent predicates avoid cycles between parent and child RLS policies.
create function behparvar_private.can_read_cycle(c uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.behparvar_okr_members where user_id=(select auth.uid()))
 and (exists(select 1 from public.behparvar_okr_cycles where id=c and creator_id=(select auth.uid())) or
 exists(select 1 from public.behparvar_okr_assessments where cycle_id=c and (select auth.uid()) in (subject_id,evaluator_id)));
$$;
revoke all on function behparvar_private.can_read_cycle(uuid) from public,anon;
grant execute on function behparvar_private.can_read_cycle(uuid) to authenticated;
create policy cycle_read on public.behparvar_okr_cycles for select to authenticated using(behparvar_private.can_read_cycle(id));
create policy assessment_read on public.behparvar_okr_assessments for select to authenticated using(
 exists(select 1 from public.behparvar_okr_members) and
 (evaluator_id=(select auth.uid()) or (subject_id=(select auth.uid()) and completed and
 exists(select 1 from public.behparvar_okr_cycles c where c.id=cycle_id and c.access='participant')))
);
create function public.behparvar_okr_start_cycle(title text,description_text text,deadline_date date,repeat_frequency text,access_mode text,participants uuid[],manager uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare new_id uuid; subject uuid; actor uuid:=auth.uid();
begin
 if not exists(select 1 from public.behparvar_okr_members where user_id=actor and role='admin') then raise exception 'Not permitted';end if;
 if coalesce(trim(title),'')='' or deadline_date is null or coalesce(cardinality(participants),0)=0 or deadline_date<current_date then raise exception 'Invalid cycle';end if;
 if manager is not null and (manager=any(participants) or not exists(select 1 from public.behparvar_okr_members where user_id=manager)) then raise exception 'Invalid manager';end if;
 insert into public.behparvar_okr_cycles(creator_id,name,description,deadline,frequency,access) values(actor,trim(title),coalesce(description_text,''),deadline_date,repeat_frequency,access_mode) returning id into new_id;
 for subject in select distinct unnest(participants) loop
  if not exists(select 1 from public.behparvar_okr_members where user_id=subject) then raise exception 'Invalid participant';end if;
  insert into public.behparvar_okr_assessments(cycle_id,subject_id,evaluator_id,kind) values(new_id,subject,subject,'self');
  if manager is not null then insert into public.behparvar_okr_assessments(cycle_id,subject_id,evaluator_id,kind) values(new_id,subject,manager,'manager');end if;
 end loop;return new_id;
end $$;
create function public.behparvar_okr_record_assessment(entry uuid,expected_revision bigint,response_text text,finish boolean)
returns boolean language sql security definer set search_path='' as $$
 with changed as (update public.behparvar_okr_assessments set answer=coalesce(response_text,''),completed=finish,revision=revision+1
 where id=entry and evaluator_id=(select auth.uid()) and revision=expected_revision and not completed
 and exists(select 1 from public.behparvar_okr_members where user_id=(select auth.uid()))
 and (not finish or trim(coalesce(response_text,''))<>'') returning id) select exists(select 1 from changed);
$$;
revoke all on function public.behparvar_okr_start_cycle(text,text,date,text,text,uuid[],uuid),public.behparvar_okr_record_assessment(uuid,bigint,text,boolean) from public,anon;
grant execute on function public.behparvar_okr_start_cycle(text,text,date,text,text,uuid[],uuid),public.behparvar_okr_record_assessment(uuid,bigint,text,boolean) to authenticated;
