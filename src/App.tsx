import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './supabaseClient';
import { User } from '@supabase/supabase-js';
import Navigation from './components/Navigation';
import AuthComponent from './components/Auth';
import Dashboard from './components/Dashboard';
import ExperimentManager from './components/ExperimentManager';
import CreateExperiment from './components/CreateExperiment';
import ExperimentDetail from './components/ExperimentDetail';
import BlueprintLibrary from './components/BlueprintLibrary';
import CreateBlueprint from './components/CreateBlueprint';
import BlueprintDetail from './components/BlueprintDetail';
import EditBlueprint from './components/EditBlueprint';
import ICPProfileManager from './components/ICPProfileManager';
import CreateICPProfile from './components/CreateICPProfile';
import AIRecommendations from './components/AIRecommendations';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Integrations from './components/Integrations';
import { Experiment, Blueprint, ICPProfile } from './types';
import { DataService } from './services/dataService';



function App() {
  const [user, setUser] = useState<User | null>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [icpProfiles, setICPProfiles] = useState<ICPProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Load data from Supabase on component mount
  useEffect(() => {
    if (!user) return; // Only load data if user is authenticated

    const loadData = async () => {
      try {
        setLoading(true);
        const [experimentsData, blueprintsData, icpProfilesData] = await Promise.all([
          DataService.getExperiments(),
          DataService.getBlueprints(),
          DataService.getICPProfiles()
        ]);
        
        setExperiments(experimentsData);
        setBlueprints(blueprintsData);
        setICPProfiles(icpProfilesData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Show a more user-friendly error message
        if (error instanceof Error && error.message.includes('fetch')) {
          console.error('This might be a Supabase connection issue. Check your environment variables.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

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

  if (authLoading) {
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
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App; 