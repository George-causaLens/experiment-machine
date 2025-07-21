-- Fix Experiment Targeting Data Issues
-- Run this in your Supabase SQL editor

-- Add missing urls column to experiments table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'urls') THEN
        ALTER TABLE experiments ADD COLUMN urls JSONB DEFAULT '[]';
    END IF;
END $$;

-- Add missing user_id column to experiments table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'user_id') THEN
        ALTER TABLE experiments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Verify the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'experiments' 
AND column_name IN ('urls', 'user_id', 'icp_profile_id', 'custom_targeting');

-- Create index for better query performance on user_id
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON experiments(user_id);

-- Create index for better query performance on icp_profile_id
CREATE INDEX IF NOT EXISTS idx_experiments_icp_profile_id ON experiments(icp_profile_id);

-- Create GIN index for custom_targeting JSONB queries
CREATE INDEX IF NOT EXISTS idx_experiments_custom_targeting ON experiments USING GIN(custom_targeting);

-- Create GIN index for urls JSONB queries
CREATE INDEX IF NOT EXISTS idx_experiments_urls ON experiments USING GIN(urls); 