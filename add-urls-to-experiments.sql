-- Add urls column to experiments table
-- Run this in your Supabase SQL editor

-- Add urls column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'urls') THEN
        ALTER TABLE experiments ADD COLUMN urls JSONB DEFAULT '[]';
    END IF;
END $$;

-- Verify the column exists
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'experiments' AND column_name = 'urls'; 