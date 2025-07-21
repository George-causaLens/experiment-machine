-- Add missing columns to blueprints table
-- Run this in your Supabase SQL editor

-- Add company_revenue column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'company_revenue') THEN
        ALTER TABLE blueprints ADD COLUMN company_revenue TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add pain_points column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'pain_points') THEN
        ALTER TABLE blueprints ADD COLUMN pain_points TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add user_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'user_id') THEN
        ALTER TABLE blueprints ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verify the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blueprints' 
ORDER BY ordinal_position; 