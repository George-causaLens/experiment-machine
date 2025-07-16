# Super Admin Setup Guide

This guide will help you set up the super admin system for The Experiment Machine with approval-based registration.

## Step 1: Run the SQL Setup

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `super-admin-setup.sql`
4. **IMPORTANT**: Before running the SQL, replace `'your-email@example.com'` with your actual email address on line 7
5. Execute the SQL script

## Step 2: Verify the Setup

After running the SQL, you should see:
- A new `users` table in your database
- Row Level Security (RLS) policies updated
- Functions for user approval/rejection/suspension
- Your email set as the first super admin

## Step 3: Test the System

1. **Register a new user account**:
   - Go to your app and sign up with a different email
   - You should see the "Account Pending Approval" screen

2. **Approve the user as super admin**:
   - Sign in with your super admin account
   - Navigate to "Super Admin" in the sidebar
   - You should see the pending approval in the list
   - Click "Approve" to grant access

3. **Test user access**:
   - Sign in with the approved user account
   - You should now have full access to the platform

## Step 4: Configure Email Notifications (Optional)

To send email notifications when users are approved/rejected:

1. In Supabase, go to Authentication > Settings
2. Configure your email provider (SMTP or use Supabase's built-in email)
3. Create email templates for approval/rejection notifications

## User Roles and Permissions

### Super Admin
- Can view all users
- Can approve/reject/suspend users
- Can change user roles
- Has access to the Super Admin dashboard
- Can manage all system data

### Admin
- Can manage experiments, blueprints, and ICP profiles
- Cannot manage users
- Cannot access Super Admin dashboard

### User
- Can create and manage their own experiments
- Can access blueprints and ICP profiles
- Cannot manage other users' data

## User Status Flow

1. **Pending**: New user registration (default)
2. **Approved**: User can access the platform
3. **Rejected**: User cannot access the platform
4. **Suspended**: User temporarily blocked (can be re-approved)

## Security Features

- Row Level Security (RLS) ensures users can only access their own data
- Approval system prevents unauthorized access
- Super admin functions are protected by database-level checks
- All user management operations are logged

## Troubleshooting

### "Only super admins can approve users" error
- Make sure you're signed in with the email you specified in the SQL setup
- Check that the user record exists in the `users` table
- Verify the user has `role = 'super_admin'` and `status = 'approved'`

### Users can't see their data
- Check that the user's status is 'approved'
- Verify RLS policies are working correctly
- Ensure the user_id is properly set on data records

### Super Admin dashboard not showing
- Check that you're signed in with a super admin account
- Verify the user record has `role = 'super_admin'`
- Check browser console for any errors

## Database Schema

The system adds these new tables and functions:

### Tables
- `users`: Stores user approval status and roles

### Functions
- `handle_new_user()`: Automatically creates user records on registration
- `is_user_approved()`: Checks if a user is approved
- `approve_user()`: Approves a user (super admin only)
- `reject_user()`: Rejects a user (super admin only)
- `suspend_user()`: Suspends a user (super admin only)

### RLS Policies
- Updated all existing tables to require user approval
- Super admin policies for user management
- User-specific data access policies

## Next Steps

1. **Customize the approval process**: Modify the approval workflow to match your needs
2. **Add email notifications**: Set up automated emails for approval/rejection
3. **Add audit logging**: Track all user management actions
4. **Implement role-based features**: Add specific features for different user roles
5. **Add bulk operations**: Allow approving/rejecting multiple users at once

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your Supabase configuration
3. Check the database logs in Supabase
4. Ensure all environment variables are set correctly 