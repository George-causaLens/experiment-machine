-- Add missing columns to blueprints table
-- Run this in your Supabase SQL editor

-- Add target_roles column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'target_roles') THEN
        ALTER TABLE blueprints ADD COLUMN target_roles TEXT[] DEFAULT '{}';
    END IF;
END $$;

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

-- Add industry column if it doesn't exist (should be array)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'industry') THEN
        ALTER TABLE blueprints ADD COLUMN industry TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add company_size column if it doesn't exist (should be array)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'company_size') THEN
        ALTER TABLE blueprints ADD COLUMN company_size TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add tags column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'tags') THEN
        ALTER TABLE blueprints ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Add usage_count column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'usage_count') THEN
        ALTER TABLE blueprints ADD COLUMN usage_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Add related_experiments column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blueprints' AND column_name = 'related_experiments') THEN
        ALTER TABLE blueprints ADD COLUMN related_experiments TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Verify the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blueprints' 
ORDER BY ordinal_position; 