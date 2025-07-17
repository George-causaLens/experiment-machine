-- Simple query to approve a pending user as admin by email
-- Replace 'user@example.com' with the actual email address

UPDATE public.users 
SET 
  status = 'approved',
  role = 'admin',
  approved_at = NOW(),
  updated_at = NOW()
WHERE email = 'user@example.com' 
AND status = 'pending';

-- Check if the update worked
SELECT email, status, role, approved_at 
FROM public.users 
WHERE email = 'user@example.com'; 