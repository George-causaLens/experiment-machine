-- Super Admin Setup for The Experiment Machine
-- Run this in your Supabase SQL editor

-- 1. Create users table to track approval status
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'pending' CHECK (role IN ('super_admin', 'admin', 'user', 'pending')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add user_id columns to existing tables if they don't exist
DO $$ 
BEGIN
    -- Add user_id to experiments table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'experiments' AND column_name = 'user_id') THEN
        ALTER TABLE public.experiments ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add user_id to blueprints table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blueprints' AND column_name = 'user_id') THEN
        ALTER TABLE public.blueprints ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
    
    -- Add user_id to icp_profiles table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'icp_profiles' AND column_name = 'user_id') THEN
        ALTER TABLE public.icp_profiles ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- 3. Create RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Super admins can see all users
CREATE POLICY "Super admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.role = 'super_admin'
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Super admins can update all users
CREATE POLICY "Super admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.role = 'super_admin'
    )
  );

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Only super admins can insert new users
CREATE POLICY "Only super admins can insert users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u 
      WHERE u.id = auth.uid() AND u.role = 'super_admin'
    )
  );

-- 4. Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'pending',
    'pending'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Create function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = user_id AND status = 'approved'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update existing RLS policies to require approval
-- Experiments
DROP POLICY IF EXISTS "Users can view own experiments" ON public.experiments;
CREATE POLICY "Approved users can view own experiments" ON public.experiments
  FOR SELECT USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert own experiments" ON public.experiments;
CREATE POLICY "Approved users can insert own experiments" ON public.experiments
  FOR INSERT WITH CHECK (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own experiments" ON public.experiments;
CREATE POLICY "Approved users can update own experiments" ON public.experiments
  FOR UPDATE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete own experiments" ON public.experiments;
CREATE POLICY "Approved users can delete own experiments" ON public.experiments
  FOR DELETE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

-- Blueprints
DROP POLICY IF EXISTS "Users can view own blueprints" ON public.blueprints;
CREATE POLICY "Approved users can view own blueprints" ON public.blueprints
  FOR SELECT USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert own blueprints" ON public.blueprints;
CREATE POLICY "Approved users can insert own blueprints" ON public.blueprints
  FOR INSERT WITH CHECK (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own blueprints" ON public.blueprints;
CREATE POLICY "Approved users can update own blueprints" ON public.blueprints
  FOR UPDATE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete own blueprints" ON public.blueprints;
CREATE POLICY "Approved users can delete own blueprints" ON public.blueprints
  FOR DELETE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

-- ICP Profiles
DROP POLICY IF EXISTS "Users can view own icp profiles" ON public.icp_profiles;
CREATE POLICY "Approved users can view own icp profiles" ON public.icp_profiles
  FOR SELECT USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can insert own icp profiles" ON public.icp_profiles;
CREATE POLICY "Approved users can insert own icp profiles" ON public.icp_profiles
  FOR INSERT WITH CHECK (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can update own icp profiles" ON public.icp_profiles;
CREATE POLICY "Approved users can update own icp profiles" ON public.icp_profiles
  FOR UPDATE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can delete own icp profiles" ON public.icp_profiles;
CREATE POLICY "Approved users can delete own icp profiles" ON public.icp_profiles
  FOR DELETE USING (
    public.is_user_approved() AND user_id = auth.uid()
  );

-- 8. Create the first super admin (replace with your email)
-- IMPORTANT: Replace 'your-email@example.com' with your actual email
INSERT INTO public.users (id, email, full_name, role, status, approved_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  'super_admin',
  'approved',
  NOW()
FROM auth.users 
WHERE email = 'your-email@example.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  status = 'approved',
  approved_at = NOW();

-- 9. Create function to approve users
CREATE OR REPLACE FUNCTION public.approve_user(user_id UUID, approved_by UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  -- Check if the approver is a super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = approved_by AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Only super admins can approve users';
  END IF;
  
  -- Update user status
  UPDATE public.users 
  SET 
    status = 'approved',
    approved_at = NOW(),
    approved_by = approved_by,
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create function to reject users
CREATE OR REPLACE FUNCTION public.reject_user(user_id UUID, rejected_by UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  -- Check if the rejecter is a super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = rejected_by AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Only super admins can reject users';
  END IF;
  
  -- Update user status
  UPDATE public.users 
  SET 
    status = 'rejected',
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. Create function to suspend users
CREATE OR REPLACE FUNCTION public.suspend_user(user_id UUID, suspended_by UUID DEFAULT auth.uid())
RETURNS VOID AS $$
BEGIN
  -- Check if the suspender is a super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = suspended_by AND role = 'super_admin'
  ) THEN
    RAISE EXCEPTION 'Only super admins can suspend users';
  END IF;
  
  -- Update user status
  UPDATE public.users 
  SET 
    status = 'suspended',
    updated_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 