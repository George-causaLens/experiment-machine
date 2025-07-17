-- Add unique constraint to prevent duplicate idea names per user
-- This will prevent duplicate ideas from being created even if the application logic fails

CREATE UNIQUE INDEX IF NOT EXISTS idx_ideas_user_name_unique ON ideas(user_id, name);

-- If there are existing duplicates, you may need to handle them first
-- You can check for duplicates with:
-- SELECT user_id, name, COUNT(*) FROM ideas GROUP BY user_id, name HAVING COUNT(*) > 1; 