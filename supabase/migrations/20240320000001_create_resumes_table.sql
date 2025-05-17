-- Drop existing table if it exists
DROP TABLE IF EXISTS resumes;

-- Create resumes table
CREATE TABLE resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_content TEXT NOT NULL, -- Base64 encoded file content
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    extracted_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_resumes_created_at;

-- Create index on created_at for faster queries
CREATE INDEX idx_resumes_created_at ON resumes(created_at);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON resumes;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON resumes;

-- Add RLS policies
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON resumes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON resumes
    FOR INSERT TO authenticated WITH CHECK (true);

-- Revoke existing permissions
REVOKE ALL ON TABLE resumes FROM authenticated;

-- Grant necessary permissions
GRANT ALL ON TABLE resumes TO authenticated; 