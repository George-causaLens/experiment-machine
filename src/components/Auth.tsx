import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../supabaseClient';

interface AuthProps {
  onAuthSuccess?: () => void;
}

const AuthComponent: React.FC<AuthProps> = ({ onAuthSuccess }) => {
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
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3B82F6',
                    brandAccent: '#2563EB',
                  },
                },
              },
            }}
            providers={['google', 'github']}
            redirectTo={window.location.origin}
            onAuthStateChange={(event, session) => {
              if (event === 'SIGNED_IN' && session) {
                onAuthSuccess?.();
              }
            }}
          />
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Protected by Supabase Auth</p>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent; 