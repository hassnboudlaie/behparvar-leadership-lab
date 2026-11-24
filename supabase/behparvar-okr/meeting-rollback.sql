-- Run after reverting the client. Preserve meeting records for recovery.
begin;
revoke all on public.behparvar_okr_meetings,public.behparvar_okr_private_notes from authenticated,anon,public;
drop function public.behparvar_okr_directory();
alter table public.behparvar_okr_private_notes set schema behparvar_okr_recovery;
alter table public.behparvar_okr_meetings set schema behparvar_okr_recovery;
commit;
