-- Run once before deploying the meeting module, inside one transaction.
create schema behparvar_okr_recovery;
revoke all on schema behparvar_okr_recovery from public, anon, authenticated;
create table behparvar_okr_recovery.workspace_before_meetings as table public.behparvar_okr_workspace;
create table behparvar_okr_recovery.members_before_meetings as table public.behparvar_okr_members;
create table behparvar_okr_recovery.invites_before_meetings as table public.behparvar_okr_invitations;
revoke all on all tables in schema behparvar_okr_recovery from public,anon,authenticated;
