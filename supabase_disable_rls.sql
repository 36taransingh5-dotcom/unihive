-- Disable RLS entirely for the university_requests table
-- Since this is just a public lead-generation form (a drop-box), we don't need complex row-level security.
-- Anyone should be able to drop a request in, and only admins (via the Supabase dashboard) will read them.

ALTER TABLE university_requests DISABLE ROW LEVEL SECURITY;
