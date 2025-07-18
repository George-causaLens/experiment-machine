-- Fix blueprint table schema to match TypeScript types
-- The current schema has single TEXT fields but TypeScript expects arrays

-- Add new array columns
ALTER TABLE blueprints ADD COLUMN IF NOT EXISTS industry_array TEXT[] DEFAULT '{}';
ALTER TABLE blueprints ADD COLUMN IF NOT EXISTS target_roles_array TEXT[] DEFAULT '{}';
ALTER TABLE blueprints ADD COLUMN IF NOT EXISTS company_size_array TEXT[] DEFAULT '{}';
ALTER TABLE blueprints ADD COLUMN IF NOT EXISTS company_revenue_array TEXT[] DEFAULT '{}';
ALTER TABLE blueprints ADD COLUMN IF NOT EXISTS pain_points_array TEXT[] DEFAULT '{}';

-- Migrate existing data from single fields to arrays
UPDATE blueprints 
SET 
  industry_array = CASE 
    WHEN industry IS NOT NULL AND industry != '' THEN ARRAY[industry]
    ELSE '{}'
  END,
  target_roles_array = CASE 
    WHEN target_role IS NOT NULL AND target_role != '' THEN ARRAY[target_role]
    ELSE '{}'
  END,
  company_size_array = CASE 
    WHEN company_size IS NOT NULL AND company_size != '' THEN ARRAY[company_size]
    ELSE '{}'
  END;

-- Drop old single columns (after confirming migration worked)
-- ALTER TABLE blueprints DROP COLUMN IF EXISTS industry;
-- ALTER TABLE blueprints DROP COLUMN IF EXISTS target_role;
-- ALTER TABLE blueprints DROP COLUMN IF EXISTS company_size;

-- Rename new columns to match TypeScript expectations
ALTER TABLE blueprints RENAME COLUMN industry_array TO industry;
ALTER TABLE blueprints RENAME COLUMN target_roles_array TO target_roles;
ALTER TABLE blueprints RENAME COLUMN company_size_array TO company_size;
ALTER TABLE blueprints RENAME COLUMN company_revenue_array TO company_revenue;
ALTER TABLE blueprints RENAME COLUMN pain_points_array TO pain_points;

-- Update indexes
DROP INDEX IF EXISTS idx_blueprints_industry;
CREATE INDEX idx_blueprints_industry ON blueprints USING GIN(industry); 