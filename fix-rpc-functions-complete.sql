-- Complete fix for RPC functions with ambiguous column references
-- Run this in your Supabase SQL editor to completely replace all functions

-- First, drop all existing functions to ensure clean slate
DROP FUNCTION IF EXISTS public.get_all_users();
DROP FUNCTION IF EXISTS public.get_super_admin_stats();
DROP FUNCTION IF EXISTS public.get_pending_approvals();
DROP FUNCTION IF EXISTS public.update_user_by_admin(UUID, TEXT, TEXT, TEXT);

-- Function to get all users (super admin only) - COMPLETELY REWRITTEN
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS TABLE (
  user_id UUID,
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
    SELECT 1 FROM public.users AS u
    WHERE u.id = auth.uid() 
    AND u.role = 'super_admin' 
    AND u.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view all users';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email,
    u.full_name,
    u.role,
    u.status,
    u.approved_at,
    u.approved_by,
    u.created_at,
    u.updated_at
  FROM public.users AS u
  ORDER BY u.created_at DESC;
END;
$$;

-- Function to get super admin stats
CREATE OR REPLACE FUNCTION public.get_super_admin_stats()
RETURNS TABLE (
  total_users INTEGER,
  pending_approvals INTEGER,
  approved_users INTEGER,
  rejected_users INTEGER,
  suspended_users INTEGER
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users AS u
    WHERE u.id = auth.uid() 
    AND u.role = 'super_admin' 
    AND u.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view stats';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER AS total_users,
    COUNT(*) FILTER (WHERE u.status = 'pending')::INTEGER AS pending_approvals,
    COUNT(*) FILTER (WHERE u.status = 'approved')::INTEGER AS approved_users,
    COUNT(*) FILTER (WHERE u.status = 'rejected')::INTEGER AS rejected_users,
    COUNT(*) FILTER (WHERE u.status = 'suspended')::INTEGER AS suspended_users
  FROM public.users AS u;
END;
$$;

-- Function to get pending approvals
CREATE OR REPLACE FUNCTION public.get_pending_approvals()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  full_name TEXT,
  role TEXT,
  status TEXT,
  created_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users AS u
    WHERE u.id = auth.uid() 
    AND u.role = 'super_admin' 
    AND u.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can view pending approvals';
  END IF;
  
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email,
    u.full_name,
    u.role,
    u.status,
    u.created_at
  FROM public.users AS u
  WHERE u.status = 'pending'
  ORDER BY u.created_at ASC;
END;
$$;

-- Function to update user by admin
CREATE OR REPLACE FUNCTION public.update_user_by_admin(
  target_user_id UUID,
  new_role TEXT DEFAULT NULL,
  new_status TEXT DEFAULT NULL,
  new_full_name TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user is super admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users AS u
    WHERE u.id = auth.uid() 
    AND u.role = 'super_admin' 
    AND u.status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can update users';
  END IF;
  
  -- Update the target user
  UPDATE public.users AS u
  SET 
    role = COALESCE(new_role, u.role),
    status = COALESCE(new_status, u.status),
    full_name = COALESCE(new_full_name, u.full_name),
    updated_at = NOW()
  WHERE u.id = target_user_id;
  
  -- Check if any rows were affected
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_all_users() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_super_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_pending_approvals() TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_by_admin(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Verify functions were created successfully
SELECT 
  routine_name, 
  routine_type, 
  data_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_all_users', 'get_super_admin_stats', 'get_pending_approvals', 'update_user_by_admin')
ORDER BY routine_name; 