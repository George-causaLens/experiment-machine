-- Update Super Admin RPC Functions
-- Run this in your Supabase SQL editor to fix the dashboard issue

-- Function to get all users (super admin only)
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  status TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view all users';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.status,
    u.approved_at,
    u.approved_by,
    u.created_at,
    u.updated_at
  FROM public.users u
  ORDER BY u.created_at DESC;
END;
$$;

-- Function to get super admin stats (super admin only)
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS TABLE (
  total_users BIGINT,
  pending_approvals BIGINT,
  approved_users BIGINT,
  rejected_users BIGINT,
  suspended_users BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view stats';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_approvals,
    COUNT(*) FILTER (WHERE status = 'approved') as approved_users,
    COUNT(*) FILTER (WHERE status = 'rejected') as rejected_users,
    COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users
  FROM public.users;
END;
$$;

-- Function to get pending approval requests (super admin only)
CREATE OR REPLACE FUNCTION public.get_pending_approvals()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view pending approvals';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.full_name,
    u.created_at
  FROM public.users u
  WHERE u.status = 'pending'
  ORDER BY u.created_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_super_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_approvals() TO authenticated; 