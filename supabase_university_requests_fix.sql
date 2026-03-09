-- Drop the existing policy just in case
DROP POLICY IF EXISTS "Allow public inserts for university requests" ON university_requests;

-- Create policy allowing anyone with the anon key to safely insert a request 
CREATE POLICY "Allow public inserts for university requests"
    ON university_requests
    FOR INSERT
    TO public
    WITH CHECK (true);
    
-- Add an explicit policy for the 'anon' role which Supabase's REST API uses by default
CREATE POLICY "Allow anon inserts for university requests"
    ON university_requests
    FOR INSERT
    TO anon
    WITH CHECK (true);
