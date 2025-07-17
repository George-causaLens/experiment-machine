-- Create ideas table
CREATE TABLE IF NOT EXISTS ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  urls JSONB DEFAULT '[]', -- Array of objects with {title: string, url: string}
  target_roles TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  company_sizes TEXT[] DEFAULT '{}',
  company_revenue TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',
  distribution_channels TEXT[] DEFAULT '{}',
  outreach_strategies TEXT[] DEFAULT '{}',
  content_types TEXT[] DEFAULT '{}',
  messaging_focus TEXT[] DEFAULT '{}',
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  effort TEXT CHECK (effort IN ('high', 'medium', 'low')) DEFAULT 'medium',
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on ideas table
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- RLS policies for ideas
CREATE POLICY "Users can view all ideas" ON ideas
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ideas" ON ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" ON ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for ideas table
CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_priority ON ideas(priority);
CREATE INDEX IF NOT EXISTS idx_ideas_effort ON ideas(effort);
CREATE INDEX IF NOT EXISTS idx_ideas_impact ON ideas(impact);
CREATE INDEX IF NOT EXISTS idx_ideas_created_at ON ideas(created_at); 