-- Create experiments table
CREATE TABLE experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  blueprint_id TEXT NOT NULL,
  outreach_strategy TEXT NOT NULL,
  messaging TEXT,
  content TEXT,
  distribution_channel TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  success_score NUMERIC(5,2),
  tags TEXT[] DEFAULT '{}',
  icp_profile_id TEXT,
  custom_targeting JSONB,
  target_audience TEXT NOT NULL,
  success_criteria JSONB NOT NULL,
  integration_tracking JSONB DEFAULT '[]'
);

-- Create blueprints table
CREATE TABLE blueprints (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT[] DEFAULT '{}',
  target_roles TEXT[] DEFAULT '{}',
  company_size TEXT[] DEFAULT '{}',
  company_revenue TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',
  automation TEXT NOT NULL,
  value_proposition TEXT NOT NULL,
  success_rate NUMERIC(5,2) DEFAULT 0,
  avg_roi NUMERIC(10,2) DEFAULT 0,
  avg_meetings_booked INTEGER DEFAULT 0,
  total_revenue NUMERIC(15,2) DEFAULT 0,
  conversion_rate NUMERIC(5,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  related_experiments TEXT[] DEFAULT '{}'
);

-- Create icp_profiles table
CREATE TABLE icp_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  job_titles TEXT[] DEFAULT '{}',
  industries TEXT[] DEFAULT '{}',
  geographies TEXT[] DEFAULT '{}',
  company_sizes TEXT[] DEFAULT '{}',
  company_revenue TEXT[] DEFAULT '{}',
  technology_stack TEXT[] DEFAULT '{}',
  pain_points TEXT[] DEFAULT '{}',
  buying_authority TEXT DEFAULT 'decision-maker' CHECK (buying_authority IN ('decision-maker', 'influencer', 'end-user', 'executive')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0,
  related_experiments TEXT[] DEFAULT '{}'
);

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

-- Create indexes for better performance
CREATE INDEX idx_experiments_status ON experiments(status);
CREATE INDEX idx_experiments_blueprint_id ON experiments(blueprint_id);
CREATE INDEX idx_experiments_created_at ON experiments(created_at);
CREATE INDEX idx_blueprints_industry ON blueprints(industry);
CREATE INDEX idx_icp_profiles_industries ON icp_profiles USING GIN(industries);

-- Enable Row Level Security (RLS) - you can customize this later
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE icp_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public read/write access (for development)
-- In production, you'd want more restrictive policies
CREATE POLICY "Allow public read access" ON experiments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON experiments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON experiments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON experiments FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON blueprints FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON blueprints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON blueprints FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON blueprints FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON icp_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON icp_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON icp_profiles FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON icp_profiles FOR DELETE USING (true);

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

-- Add unique constraint to prevent duplicate idea names per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_ideas_user_name_unique ON ideas(user_id, name); 