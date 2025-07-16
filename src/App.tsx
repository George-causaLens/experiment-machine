import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Toaster } from 'react-hot-toast';
import { XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ExperimentManager from './components/ExperimentManager';
import CreateExperiment from './components/CreateExperiment';
import ExperimentDetail from './components/ExperimentDetail';
import BlueprintLibrary from './components/BlueprintLibrary';
import CreateBlueprint from './components/CreateBlueprint';
import EditBlueprint from './components/EditBlueprint';
import BlueprintDetail from './components/BlueprintDetail';
import ICPProfileManager from './components/ICPProfileManager';
import CreateICPProfile from './components/CreateICPProfile';
import AIRecommendations from './components/AIRecommendations';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Integrations from './components/Integrations';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AuthComponent from './components/Auth';
import PendingApproval from './components/PendingApproval';
import PasswordResetForm from './components/PasswordResetForm';
import { Experiment, Blueprint, ICPProfile } from './types';
import { DataService } from './services/dataService';
import { UserManagementService } from './services/userManagementService';

function App() {
  const [user, setUser] = useState<any>(null);
  const [appUser, setAppUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userStatusLoading, setUserStatusLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [icpProfiles, setICPProfiles] = useState<ICPProfile[]>([]);

  // Handle password reset redirects
  useEffect(() => {
    const handlePasswordResetRedirect = () => {
      // Check for password reset in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const isPasswordReset = urlParams.get('type') === 'recovery' && urlParams.get('token');
      
      // Check for password reset in hash (Supabase sometimes uses this)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const isHashPasswordReset = hashParams.get('type') === 'recovery' && hashParams.get('access_token');
      
      console.log('Password reset check:', {
        urlParams: Object.fromEntries(urlParams.entries()),
        hashParams: Object.fromEntries(hashParams.entries()),
        isPasswordReset,
        isHashPasswordReset,
        pathname: window.location.pathname,
        hash: window.location.hash
      });
      
      // Only redirect if we're not already on the password reset page
      if ((isPasswordReset || isHashPasswordReset) && !window.location.pathname.includes('/password-reset')) {
        const token = urlParams.get('token') || hashParams.get('access_token');
        const type = urlParams.get('type') || hashParams.get('type');
        
        if (token && type === 'recovery') {
          console.log('Redirecting to password reset form with token:', token);
          // Clear the URL and redirect to password reset form
          window.history.replaceState({}, document.title, '/password-reset');
          window.location.replace(`/password-reset?token=${token}&type=${type}`);
        }
      }
    };

    handlePasswordResetRedirect();
  }, []);

  // Get session on component mount
  useEffect(() => {
    const getSession = async () => {
      try {
        setAuthLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Check user approval status when user changes
  useEffect(() => {
    if (!user) {
      setAppUser(null);
      setUserStatusLoading(false);
      return;
    }

    const checkUserStatus = async () => {
      try {
        setUserStatusLoading(true);
        const currentUser = await UserManagementService.getCurrentUser();
        setAppUser(currentUser);
      } catch (error) {
        console.error('Error checking user status:', error);
        setAppUser(null);
      } finally {
        setUserStatusLoading(false);
      }
    };

    checkUserStatus();
  }, [user]);

  // Load data from Supabase on component mount
  useEffect(() => {
    console.log('Auth state check:', { 
      hasUser: !!user, 
      hasAppUser: !!appUser, 
      appUserStatus: appUser?.status,
      userEmail: user?.email 
    });

    if (!user) {
      console.log('No user - clearing data');
      setExperiments([]);
      setBlueprints([]);
      setICPProfiles([]);
      setLoading(false);
      return;
    }

    if (!appUser) {
      console.log('No app user - waiting for user status check');
      return; // Wait for user status check to complete
    }

    if (appUser.status !== 'approved') {
      console.log('User not approved - clearing data');
      setExperiments([]);
      setBlueprints([]);
      setICPProfiles([]);
      setLoading(false);
      return; // Only load data if user is authenticated and approved
    }

    const loadData = async () => {
      try {
        console.log('Starting data load for approved user:', user.email);
        setLoading(true);
        
        const [experimentsData, blueprintsData, icpProfilesData] = await Promise.all([
          DataService.getExperiments(),
          DataService.getBlueprints(),
          DataService.getICPProfiles()
        ]);
        
        console.log('Data loaded successfully:', {
          experiments: experimentsData.length,
          blueprints: blueprintsData.length,
          icpProfiles: icpProfilesData.length
        });
        
        setExperiments(experimentsData);
        setBlueprints(blueprintsData);
        setICPProfiles(icpProfilesData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Show a more user-friendly error message
        if (error instanceof Error && error.message.includes('fetch')) {
          console.error('This might be a Supabase connection issue. Check your environment variables.');
        }
        // Set empty arrays to prevent infinite loading
        setExperiments([]);
        setBlueprints([]);
        setICPProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, appUser]);

  const addExperiment = async (experiment: Omit<Experiment, 'id' | 'createdAt'>) => {
    const newExperiment = await DataService.createExperiment(experiment);
    if (newExperiment) {
      setExperiments(prev => [newExperiment, ...prev]);
    }
  };

  const updateExperiment = async (id: string, updates: Partial<Experiment>) => {
    const updatedExperiment = await DataService.updateExperiment(id, updates);
    if (updatedExperiment) {
      setExperiments(prev => prev.map(exp => exp.id === id ? updatedExperiment : exp));
    }
  };

  const deleteExperiment = async (id: string) => {
    const success = await DataService.deleteExperiment(id);
    if (success) {
      setExperiments(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const addBlueprint = async (blueprint: Omit<Blueprint, 'id' | 'createdAt' | 'lastUsed'>) => {
    const newBlueprint = await DataService.createBlueprint(blueprint);
    if (newBlueprint) {
      setBlueprints(prev => [newBlueprint, ...prev]);
    }
  };

  const updateBlueprint = async (id: string, updates: Partial<Blueprint>) => {
    // For now, we'll update locally. In a full implementation, you'd call DataService.updateBlueprint
    setBlueprints(prev => prev.map(bp => bp.id === id ? { ...bp, ...updates } : bp));
  };

  const deleteBlueprint = async (id: string) => {
    // For now, we'll delete locally. In a full implementation, you'd call DataService.deleteBlueprint
    setBlueprints(prev => prev.filter(bp => bp.id !== id));
  };

  const addICPProfile = async (profile: Omit<ICPProfile, 'id' | 'createdAt' | 'lastUsed'>) => {
    const newProfile = await DataService.createICPProfile(profile);
    if (newProfile) {
      setICPProfiles(prev => [newProfile, ...prev]);
    }
  };

  const updateICPProfile = async (id: string, updates: Partial<ICPProfile>) => {
    // For now, we'll update locally. In a full implementation, you'd call DataService.updateICPProfile
    setICPProfiles(prev => prev.map(profile => profile.id === id ? { ...profile, ...updates } : profile));
  };

  const deleteICPProfile = async (id: string) => {
    // For now, we'll delete locally. In a full implementation, you'd call DataService.deleteICPProfile
    setICPProfiles(prev => prev.filter(profile => profile.id !== id));
  };

  if (authLoading || userStatusLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthComponent 
        onAuthSuccess={() => {
          // Auth success will be handled by the auth state change listener
        }} 
      />
    );
  }

  // Show pending approval screen if user is not approved
  if (appUser && appUser.status === 'pending') {
    return <PendingApproval />;
  }

  // Show rejected screen if user is rejected
  if (appUser && appUser.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <XCircleIcon className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Account Rejected</h1>
            <p className="mt-4 text-lg text-gray-600">
              Your registration request has been rejected.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please contact support if you believe this was an error.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn-primary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show suspended screen if user is suspended
  if (appUser && appUser.status === 'suspended') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-24 w-24 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
              <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Account Suspended</h1>
            <p className="mt-4 text-lg text-gray-600">
              Your account has been suspended.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Please contact support for more information.
            </p>
          </div>
          <div className="text-center">
            <button
              onClick={() => supabase.auth.signOut()}
              className="btn-primary"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CRITICAL SECURITY CHECK: Only show main app if user is authenticated AND approved
  if (!appUser || appUser.status !== 'approved') {
    console.log('Security check failed - user not properly authenticated:', {
      hasAppUser: !!appUser,
      appUserStatus: appUser?.status,
      userEmail: user?.email
    });
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your access...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your experiment data...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="p-6 lg:pl-72">
          <Routes>
            <Route path="/" element={<Dashboard experiments={experiments} blueprints={blueprints} />} />
            <Route path="/experiments" element={<ExperimentManager experiments={experiments} blueprints={blueprints} onAddExperiment={addExperiment} onUpdateExperiment={updateExperiment} onDeleteExperiment={deleteExperiment} />} />
            <Route path="/experiments/create" element={<CreateExperiment blueprints={blueprints} icpProfiles={icpProfiles} experiments={experiments} onAddExperiment={addExperiment} />} />
            <Route path="/experiments/:id" element={<ExperimentDetail experiments={experiments} onUpdateExperiment={updateExperiment} onDeleteExperiment={deleteExperiment} />} />
            <Route path="/experiments/:id/edit" element={<CreateExperiment blueprints={blueprints} icpProfiles={icpProfiles} experiments={experiments} onAddExperiment={addExperiment} onUpdateExperiment={updateExperiment} isEditing={true} />} />
            <Route path="/blueprints" element={<BlueprintLibrary blueprints={blueprints} experiments={experiments} onAddBlueprint={addBlueprint} onUpdateBlueprint={updateBlueprint} onDeleteBlueprint={deleteBlueprint} />} />
            <Route path="/blueprints/create" element={<CreateBlueprint onAddBlueprint={addBlueprint} />} />
            <Route path="/blueprints/:id" element={<BlueprintDetail blueprints={blueprints} experiments={experiments} onUpdateBlueprint={updateBlueprint} onDeleteBlueprint={deleteBlueprint} />} />
            <Route path="/blueprints/:id/edit" element={<EditBlueprint blueprints={blueprints} onUpdateBlueprint={updateBlueprint} />} />
            <Route path="/icp-profiles" element={<ICPProfileManager icpProfiles={icpProfiles} onAddICPProfile={addICPProfile} onUpdateICPProfile={updateICPProfile} onDeleteICPProfile={deleteICPProfile} />} />
            <Route path="/icp-profiles/create" element={<CreateICPProfile icpProfiles={icpProfiles} onAddICPProfile={addICPProfile} onUpdateICPProfile={updateICPProfile} />} />
            <Route path="/icp-profiles/:id/edit" element={<CreateICPProfile icpProfiles={icpProfiles} onAddICPProfile={addICPProfile} onUpdateICPProfile={updateICPProfile} />} />
            <Route path="/ai-recommendations" element={<AIRecommendations experiments={experiments} blueprints={blueprints} onAddExperiment={addExperiment} onAddBlueprint={addBlueprint} />} />
            <Route path="/analytics" element={<AnalyticsDashboard experiments={experiments} blueprints={blueprints} />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/super-admin" element={<SuperAdminDashboard />} />
            <Route path="/password-reset" element={<PasswordResetForm />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App; 