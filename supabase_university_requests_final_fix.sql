-- Drop all existing policies on this table
DROP POLICY IF EXISTS "Allow public inserts for university requests" ON university_requests;
DROP POLICY IF EXISTS "Allow anon inserts for university requests" ON university_requests;
DROP POLICY IF EXISTS "Allow authenticated users to view university requests" ON university_requests;

-- Ensure RLS is enabled
ALTER TABLE university_requests ENABLE ROW LEVEL SECURITY;

-- 1. Allow inserts from ANYONE (anon or authenticated)
CREATE POLICY "Enable insert for all users"
ON "public"."university_requests"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow select for authenticated users ONLY (so public can't read other people's emails)
CREATE POLICY "Enable read access for authenticated users only"
ON "public"."university_requests"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);
