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
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Check if current user is super admin
  IF current_user_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super admins can view all users';
  END IF;
  
  -- Return all users from public.users table only
  RETURN QUERY
  SELECT 
    users.id,
    users.email,
    users.full_name,
    users.role,
    users.status,
    users.approved_at,
    users.approved_by,
    users.created_at,
    users.updated_at
  FROM public.users
  ORDER BY users.created_at DESC;
END;
$$;

-- Function to get super admin stats (super admin only) - COMPLETELY REWRITTEN
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
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Check if current user is super admin
  IF current_user_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super admins can view stats';
  END IF;
  
  -- Return stats from public.users table only
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

-- Function to get pending approval requests (super admin only) - COMPLETELY REWRITTEN
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
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Check if current user is super admin
  IF current_user_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super admins can view pending approvals';
  END IF;
  
  -- Return pending users from public.users table only
  RETURN QUERY
  SELECT 
    users.id,
    users.email,
    users.full_name,
    users.created_at
  FROM public.users
  WHERE users.status = 'pending'
  ORDER BY users.created_at DESC;
END;
$$;

-- Function to update any user (super admin only) - COMPLETELY REWRITTEN
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
DECLARE
  current_user_role TEXT;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.users 
  WHERE id = auth.uid();
  
  -- Check if current user is super admin
  IF current_user_role != 'super_admin' THEN
    RAISE EXCEPTION 'Only super admins can update users';
  END IF;
  
  -- Update the user in public.users table only
  UPDATE public.users 
  SET 
    role = COALESCE(new_role, role),
    status = COALESCE(new_status, status),
    full_name = COALESCE(new_full_name, full_name),
    updated_at = NOW(),
    approved_at = CASE 
      WHEN new_status = 'approved' AND status != 'approved' THEN NOW()
      ELSE approved_at
    END,
    approved_by = CASE 
      WHEN new_status = 'approved' AND status != 'approved' THEN auth.uid()
      ELSE approved_by
    END
  WHERE id = target_user_id;
  
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