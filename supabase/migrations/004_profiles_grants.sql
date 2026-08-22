-- ============================================================
-- 004_profiles_grants.sql
-- Restore default privileges on profiles (anon/authenticated
-- grants were missing, causing "permission denied for table
-- profiles" for all user-facing queries).
-- Matches existing RLS policies: public read, own-row write.
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
