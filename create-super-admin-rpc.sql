-- Create RPC functions for super admin operations
-- Run this in your Supabase SQL editor

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

-- Function to update any user (super admin only)
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
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super_admin' 
    AND status = 'approved'
  ) THEN
    RAISE EXCEPTION 'Only super admins can update users';
  END IF;
  
  -- Update the user
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
GRANT EXECUTE ON FUNCTION public.update_user_by_admin(UUID, TEXT, TEXT, TEXT) TO authenticated; 