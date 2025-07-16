-- Fix Super Admin Account
-- Run this in your Supabase SQL editor to create your super admin account

-- First, let's see what users exist in the auth.users table
SELECT id, email, created_at FROM auth.users;

-- Now, let's see what exists in our users table
SELECT * FROM public.users;

-- Create super admin account for your email
-- IMPORTANT: Replace 'your-email@example.com' with your actual email address
INSERT INTO public.users (id, email, full_name, role, status, approved_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'full_name', email),
  'super_admin',
  'approved',
  NOW()
FROM auth.users 
WHERE email = 'your-email@example.com'  -- Replace this with your actual email
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  status = 'approved',
  approved_at = NOW();

-- Verify the super admin was created
SELECT * FROM public.users WHERE role = 'super_admin'; 