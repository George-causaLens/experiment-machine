import React, { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';
import { SecurityUtils } from '../utils/security';

interface AuthProps {
  onAuthSuccess?: () => void;
}

const AuthComponent: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState('');

  // Create rate limiter for authentication attempts
  const authRateLimiter = SecurityUtils.createRateLimiter(5, 60000); // 5 attempts per minute

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess?.();
      }
    };
    
    checkAuth();
  }, [onAuthSuccess]);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Validate user email format
        if (session.user?.email && !SecurityUtils.isValidEmail(session.user.email)) {
          console.error('Invalid email format detected');
          supabase.auth.signOut();
          return;
        }
        
        onAuthSuccess?.();
      }
    });

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const customTheme = {
    ...ThemeSupa,
    variables: {
      colors: {
        brand: '#3B82F6',
        brandAccent: '#2563EB',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">The Experiment Machine</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your experimentation dashboard
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {/* Rate Limit Warning */}
          {isRateLimited && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Too many login attempts
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{rateLimitMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: customTheme }}
            providers={[]} // Only email/password authentication
            redirectTo={window.location.origin}
            showLinks={true}
            view="sign_in"
          />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Secure authentication powered by Supabase</p>
          <p className="mt-1">Need help? Contact support at support@experimentmachine.com</p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent; 