-- Enhance Experiment Targeting Analysis
-- Add individual columns for better AI analysis and learning
-- Run this in your Supabase SQL editor

-- Add individual targeting columns for analysis
DO $$ 
BEGIN
    -- Add job titles column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_job_titles') THEN
        ALTER TABLE experiments ADD COLUMN target_job_titles TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add industries column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_industries') THEN
        ALTER TABLE experiments ADD COLUMN target_industries TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add company sizes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_company_sizes') THEN
        ALTER TABLE experiments ADD COLUMN target_company_sizes TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add company revenue column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_company_revenue') THEN
        ALTER TABLE experiments ADD COLUMN target_company_revenue TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add pain points column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_pain_points') THEN
        ALTER TABLE experiments ADD COLUMN target_pain_points TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add geographies column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_geographies') THEN
        ALTER TABLE experiments ADD COLUMN target_geographies TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add technology stack column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_technology_stack') THEN
        ALTER TABLE experiments ADD COLUMN target_technology_stack TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add buying authority column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'experiments' AND column_name = 'target_buying_authority') THEN
        ALTER TABLE experiments ADD COLUMN target_buying_authority TEXT DEFAULT 'decision-maker';
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_experiments_target_job_titles ON experiments USING GIN(target_job_titles);
CREATE INDEX IF NOT EXISTS idx_experiments_target_industries ON experiments USING GIN(target_industries);
CREATE INDEX IF NOT EXISTS idx_experiments_target_company_sizes ON experiments USING GIN(target_company_sizes);
CREATE INDEX IF NOT EXISTS idx_experiments_target_company_revenue ON experiments USING GIN(target_company_revenue);
CREATE INDEX IF NOT EXISTS idx_experiments_target_pain_points ON experiments USING GIN(target_pain_points);
CREATE INDEX IF NOT EXISTS idx_experiments_target_geographies ON experiments USING GIN(target_geographies);
CREATE INDEX IF NOT EXISTS idx_experiments_target_technology_stack ON experiments USING GIN(target_technology_stack);
CREATE INDEX IF NOT EXISTS idx_experiments_target_buying_authority ON experiments(target_buying_authority);

-- Verify the columns exist
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'experiments' 
AND column_name LIKE 'target_%'
ORDER BY column_name; 