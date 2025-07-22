-- Migration: Add support for multiple outreach strategies and distribution channels
-- This migration converts single text fields to JSONB arrays

-- Step 1: Add new columns
ALTER TABLE experiments 
ADD COLUMN outreach_strategies JSONB DEFAULT '[]',
ADD COLUMN distribution_channels JSONB DEFAULT '[]';

-- Step 2: Migrate existing data
-- Convert single outreach_strategy values to arrays
UPDATE experiments 
SET outreach_strategies = CASE 
  WHEN outreach_strategy IS NOT NULL AND outreach_strategy != '' 
  THEN jsonb_build_array(outreach_strategy)
  ELSE '[]'::jsonb
END;

-- Convert single distribution_channel values to arrays
UPDATE experiments 
SET distribution_channels = CASE 
  WHEN distribution_channel IS NOT NULL AND distribution_channel != '' 
  THEN jsonb_build_array(distribution_channel)
  ELSE '[]'::jsonb
END;

-- Step 3: Drop old columns (after confirming migration worked)
-- ALTER TABLE experiments DROP COLUMN outreach_strategy;
-- ALTER TABLE experiments DROP COLUMN distribution_channel;

-- Note: Keep old columns for now to ensure backward compatibility
-- They can be dropped in a future migration after confirming everything works 