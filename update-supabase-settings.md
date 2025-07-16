# URGENT: Update Supabase Settings to Fix Password Reset

## The Problem
Your password reset is redirecting to the main app instead of the password reset form, allowing unauthorized access.

## Immediate Fix Required

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `fspprrwuwecmsgvpsjnw`

### Step 2: Update Authentication Settings
1. Go to **Authentication** → **Settings**
2. Find the **Redirect URLs** section
3. **REMOVE** any localhost URLs (like `http://localhost:3000`)
4. **ADD** these URLs:
   ```
   https://experiment-machine.vercel.app
   https://experiment-machine.vercel.app/
   https://experiment-machine.vercel.app/password-reset
   https://experiment-machine.vercel.app/auth/callback
   ```

### Step 3: Update Site URL
1. Set **Site URL** to:
   ```
   https://experiment-machine.vercel.app
   ```

### Step 4: Save Changes
1. Click **Save** at the bottom of the page

## What This Fixes
- Password reset links will now redirect to the proper form
- No more unauthorized access to dashboard
- Secure password reset flow

## Test After Update
1. Request a new password reset
2. Click the email link
3. Should go to password reset form, not dashboard

## If Still Not Working
The app now has client-side redirect handling, so even if Supabase redirects to the wrong URL, the app will catch it and redirect to the password reset form. 