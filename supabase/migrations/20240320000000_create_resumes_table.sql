-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_content TEXT NOT NULL, -- Base64 encoded file content
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    extracted_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS resumes_created_at_idx ON resumes(created_at);

-- Add RLS policies
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes"
    ON resumes FOR INSERT
    WITH CHECK (auth.uid() = auth.uid());

-- Allow users to view their own resumes
CREATE POLICY "Users can view their own resumes"
    ON resumes FOR SELECT
    USING (auth.uid() = auth.uid());

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes"
    ON resumes FOR UPDATE
    USING (auth.uid() = auth.uid());

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
    ON resumes FOR DELETE
    USING (auth.uid() = auth.uid()); 