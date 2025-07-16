-- Fix existing data by setting user_id for super admin
-- Run this in your Supabase SQL editor

-- First, let's see what data exists
SELECT 'experiments' as table_name, COUNT(*) as count FROM experiments
UNION ALL
SELECT 'blueprints' as table_name, COUNT(*) as count FROM blueprints
UNION ALL
SELECT 'icp_profiles' as table_name, COUNT(*) as count FROM icp_profiles;

-- Get the super admin user ID
SELECT id, email, role, status FROM users WHERE role = 'super_admin';

-- Update existing experiments to belong to super admin
-- Replace 'your-super-admin-user-id' with the actual UUID from the query above
UPDATE experiments 
SET user_id = (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
WHERE user_id IS NULL;

-- Update existing blueprints to belong to super admin
UPDATE blueprints 
SET user_id = (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
WHERE user_id IS NULL;

-- Update existing icp_profiles to belong to super admin
UPDATE icp_profiles 
SET user_id = (SELECT id FROM users WHERE role = 'super_admin' LIMIT 1)
WHERE user_id IS NULL;

-- Verify the updates
SELECT 'experiments' as table_name, COUNT(*) as count FROM experiments WHERE user_id IS NOT NULL
UNION ALL
SELECT 'blueprints' as table_name, COUNT(*) as count FROM blueprints WHERE user_id IS NOT NULL
UNION ALL
SELECT 'icp_profiles' as table_name, COUNT(*) as count FROM icp_profiles WHERE user_id IS NOT NULL; 