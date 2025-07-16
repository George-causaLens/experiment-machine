-- Create RPC function to get user by ID (bypasses RLS)
-- Run this in your Supabase SQL editor

CREATE OR REPLACE FUNCTION public.get_user_by_id(user_id UUID)
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
  WHERE u.id = user_id;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_user_by_id(UUID) TO authenticated; 