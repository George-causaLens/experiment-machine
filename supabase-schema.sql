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
  industry TEXT NOT NULL,
  target_role TEXT NOT NULL,
  company_size TEXT NOT NULL,
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