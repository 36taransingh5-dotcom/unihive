-- Create the university_requests table
CREATE TABLE IF NOT EXISTS university_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    university_name TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE university_requests ENABLE ROW LEVEL SECURITY;

-- Create policy allowing anyone to safely insert a request (since it's a public landing page form)
CREATE POLICY "Allow public inserts for university requests"
    ON university_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create policy allowing authenticated admins to view all requests (assuming authenticated users are admins for now, or just use Supabase Studio)
CREATE POLICY "Allow authenticated users to view university requests"
    ON university_requests
    FOR SELECT
    TO authenticated
    USING (true);
