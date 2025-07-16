-- Enable Row Level Security on all tables
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE icp_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for experiments table
CREATE POLICY "Users can view their own experiments" ON experiments
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own experiments" ON experiments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own experiments" ON experiments
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own experiments" ON experiments
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for blueprints table
CREATE POLICY "Users can view their own blueprints" ON blueprints
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own blueprints" ON blueprints
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own blueprints" ON blueprints
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own blueprints" ON blueprints
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for icp_profiles table
CREATE POLICY "Users can view their own ICP profiles" ON icp_profiles
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can insert their own ICP profiles" ON icp_profiles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own ICP profiles" ON icp_profiles
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own ICP profiles" ON icp_profiles
    FOR DELETE USING (auth.uid() IS NOT NULL); 