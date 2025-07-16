import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Please check your .env.local file or Vercel environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

// Helper functions for common operations
export const supabaseHelpers = {
  // Experiments
  async getExperiments() {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createExperiment(experiment: any) {
    const { data, error } = await supabase
      .from('experiments')
      .insert([experiment])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async updateExperiment(id: string, updates: any) {
    const { data, error } = await supabase
      .from('experiments')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },

  async deleteExperiment(id: string) {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Blueprints
  async getBlueprints() {
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createBlueprint(blueprint: any) {
    const { data, error } = await supabase
      .from('blueprints')
      .insert([blueprint])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // ICP Profiles
  async getICPProfiles() {
    const { data, error } = await supabase
      .from('icp_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createICPProfile(profile: any) {
    const { data, error } = await supabase
      .from('icp_profiles')
      .insert([profile])
      .select();
    
    if (error) throw error;
    return data[0];
  }
}; 