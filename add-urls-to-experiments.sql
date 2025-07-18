-- Add URLs field to experiments table
ALTER TABLE experiments ADD COLUMN urls JSONB DEFAULT '[]';

-- Add comment to document the field
COMMENT ON COLUMN experiments.urls IS 'Array of objects with {title: string, url: string} structure for related links'; 