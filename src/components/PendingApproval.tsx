import React from 'react';
import { ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const PendingApproval: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <ClockIcon className="h-12 w-12 text-yellow-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Account Pending Approval</h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for registering with The Experiment Machine!
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Your account is currently under review by our super administrator. 
            You'll receive an email notification once your account has been approved.
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="text-center">
            <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              What happens next?
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Our super admin will review your registration request</p>
              <p>• You'll receive an email notification of the decision</p>
              <p>• Once approved, you'll have full access to the platform</p>
              <p>• This process typically takes 24-48 hours</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="text-primary-600 hover:text-primary-500 text-sm font-medium"
          >
            Check approval status
          </button>
        </div>
        
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact support at support@experimentmachine.com</p>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval; 