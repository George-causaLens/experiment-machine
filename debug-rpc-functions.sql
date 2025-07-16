-- Debug script to check current RPC functions
-- Run this in your Supabase SQL editor to see what's currently there

-- Check what functions exist
SELECT 
  routine_name, 
  routine_type, 
  data_type,
  routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_all_users', 'get_super_admin_stats', 'get_pending_approvals', 'update_user_by_admin')
ORDER BY routine_name;

-- Check if there are any functions with similar names
SELECT 
  routine_name, 
  routine_type, 
  data_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%user%' OR routine_name LIKE '%admin%'
ORDER BY routine_name;

-- Test the current functions manually
-- This will show us exactly what error we get
SELECT * FROM public.get_all_users(); 