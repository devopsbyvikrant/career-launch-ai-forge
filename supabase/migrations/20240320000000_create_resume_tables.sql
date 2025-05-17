-- Create schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Set the search path
SET search_path TO public;

-- Enable required extensions in the public schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" SCHEMA public;

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS cover_letters;
DROP TABLE IF EXISTS ats_optimized_resumes;
DROP TABLE IF EXISTS resume_analysis;

-- Create resume_analysis table
CREATE TABLE resume_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resume_id UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    extracted_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ats_optimized_resumes table
CREATE TABLE ats_optimized_resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    original_resume_id UUID REFERENCES resume_analysis(resume_id),
    job_description TEXT NOT NULL,
    optimized_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letters table
CREATE TABLE cover_letters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    resume_id UUID REFERENCES resume_analysis(resume_id),
    job_description TEXT NOT NULL,
    cover_letter_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_resume_analysis_created_at ON resume_analysis(created_at);
CREATE INDEX idx_resume_analysis_resume_id ON resume_analysis(resume_id);
CREATE INDEX idx_ats_optimized_resumes_original_resume_id ON ats_optimized_resumes(original_resume_id);
CREATE INDEX idx_cover_letters_resume_id ON cover_letters(resume_id);

-- Add RLS policies
ALTER TABLE resume_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_optimized_resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON resume_analysis
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON resume_analysis
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON ats_optimized_resumes
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON ats_optimized_resumes
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON cover_letters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Enable insert for authenticated users" ON cover_letters
    FOR INSERT TO authenticated WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 