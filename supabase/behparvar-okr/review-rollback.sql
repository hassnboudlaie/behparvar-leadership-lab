begin;
revoke all on public.behparvar_okr_cycles,public.behparvar_okr_assessments from public,anon,authenticated;
drop function public.behparvar_okr_start_cycle(text,text,date,text,text,uuid[],uuid),public.behparvar_okr_record_assessment(uuid,bigint,text,boolean);
drop policy cycle_read on public.behparvar_okr_cycles;
drop function behparvar_private.can_read_cycle(uuid);
alter table public.behparvar_okr_cycles set schema behparvar_okr_recovery;
alter table public.behparvar_okr_assessments set schema behparvar_okr_recovery;
commit;
