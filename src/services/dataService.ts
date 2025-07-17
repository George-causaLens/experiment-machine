import { supabase } from '../supabaseClient';
import { Experiment, Blueprint, ICPProfile } from '../types';

// Data transformation helpers
const transformExperiment = (dbExperiment: any): Experiment => ({
  id: dbExperiment.id,
  name: dbExperiment.name,
  description: dbExperiment.description,
  status: dbExperiment.status,
  createdAt: new Date(dbExperiment.created_at),
  startedAt: dbExperiment.started_at ? new Date(dbExperiment.started_at) : undefined,
  endDate: new Date(dbExperiment.end_date),
  completedAt: dbExperiment.completed_at ? new Date(dbExperiment.completed_at) : undefined,
  blueprintId: dbExperiment.blueprint_id,
  outreachStrategy: dbExperiment.outreach_strategy,
  messaging: dbExperiment.messaging,
  content: dbExperiment.content,
  distributionChannel: dbExperiment.distribution_channel,
  variables: dbExperiment.variables || [],
  metrics: dbExperiment.metrics || {
    impressions: 0,
    clicks: 0,
    conversions: 0,
    meetingsBooked: 0,
    cost: 0,
    roi: 0,
    conversionRate: 0,
    ctr: 0,
    cpc: 0,
    cpm: 0
  },
  successScore: dbExperiment.success_score,
  tags: dbExperiment.tags || [],
  icpProfileId: dbExperiment.icp_profile_id,
  customTargeting: dbExperiment.custom_targeting,
  targetAudience: dbExperiment.target_audience,
  successCriteria: dbExperiment.success_criteria,
  integrationTracking: dbExperiment.integration_tracking || []
});

const transformBlueprint = (dbBlueprint: any): Blueprint => ({
  id: dbBlueprint.id,
  name: dbBlueprint.name,
  description: dbBlueprint.description,
  industry: dbBlueprint.industry,
  targetRoles: dbBlueprint.target_roles || [],
  companySize: dbBlueprint.company_size,
  companyRevenue: dbBlueprint.company_revenue || [],
  painPoints: dbBlueprint.pain_points || [],
  automation: dbBlueprint.automation,
  valueProposition: dbBlueprint.value_proposition,
  successRate: dbBlueprint.success_rate || 0,
  avgRoi: dbBlueprint.avg_roi || 0,
  avgMeetingsBooked: dbBlueprint.avg_meetings_booked || 0,
  totalRevenue: dbBlueprint.total_revenue || 0,
  conversionRate: dbBlueprint.conversion_rate || 0,
  tags: dbBlueprint.tags || [],
  createdAt: new Date(dbBlueprint.created_at),
  lastUsed: new Date(dbBlueprint.last_used),
  usageCount: dbBlueprint.usage_count || 0,
  relatedExperiments: dbBlueprint.related_experiments || []
});

const transformICPProfile = (dbICP: any): ICPProfile => ({
  id: dbICP.id,
  name: dbICP.name,
  description: dbICP.description,
  jobTitles: dbICP.job_titles || [],
  industries: dbICP.industries || [],
  geographies: dbICP.geographies || [],
  companySizes: dbICP.company_sizes || [],
  companyRevenue: dbICP.company_revenue || [],
  technologyStack: dbICP.technology_stack || [],
  painPoints: dbICP.pain_points || [],
  buyingAuthority: dbICP.buying_authority || 'decision-maker',
  tags: dbICP.tags || [],
  createdAt: new Date(dbICP.created_at),
  lastUsed: new Date(dbICP.last_used),
  usageCount: dbICP.usage_count || 0,
  relatedExperiments: dbICP.related_experiments || []
});

// Data service class
export class DataService {
  // Experiments
  static async getExperiments(): Promise<Experiment[]> {
    const { data, error } = await supabase
      .from('experiments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching experiments:', error);
      return [];
    }
    
    return data.map(transformExperiment);
  }

  static async createExperiment(experiment: Omit<Experiment, 'id' | 'createdAt'>): Promise<Experiment | null> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const dbExperiment = {
      name: experiment.name,
      description: experiment.description,
      status: experiment.status,
      started_at: experiment.startedAt,
      end_date: experiment.endDate.toISOString(),
      completed_at: experiment.completedAt,
      blueprint_id: experiment.blueprintId,
      outreach_strategy: experiment.outreachStrategy,
      messaging: experiment.messaging,
      content: experiment.content,
      distribution_channel: experiment.distributionChannel,
      variables: experiment.variables,
      metrics: experiment.metrics,
      success_score: experiment.successScore,
      tags: experiment.tags,
      icp_profile_id: experiment.icpProfileId,
      custom_targeting: experiment.customTargeting,
      target_audience: experiment.targetAudience,
      success_criteria: experiment.successCriteria,
      integration_tracking: experiment.integrationTracking,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('experiments')
      .insert([dbExperiment])
      .select();
    
    if (error) {
      console.error('Error creating experiment:', error);
      return null;
    }
    
    return data[0] ? transformExperiment(data[0]) : null;
  }

  static async updateExperiment(id: string, updates: Partial<Experiment>): Promise<Experiment | null> {
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.startedAt !== undefined) dbUpdates.started_at = updates.startedAt?.toISOString();
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate.toISOString();
    if (updates.completedAt !== undefined) dbUpdates.completed_at = updates.completedAt?.toISOString();
    if (updates.blueprintId !== undefined) dbUpdates.blueprint_id = updates.blueprintId;
    if (updates.outreachStrategy !== undefined) dbUpdates.outreach_strategy = updates.outreachStrategy;
    if (updates.messaging !== undefined) dbUpdates.messaging = updates.messaging;
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.distributionChannel !== undefined) dbUpdates.distribution_channel = updates.distributionChannel;
    if (updates.variables !== undefined) dbUpdates.variables = updates.variables;
    if (updates.metrics !== undefined) dbUpdates.metrics = updates.metrics;
    if (updates.successScore !== undefined) dbUpdates.success_score = updates.successScore;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.icpProfileId !== undefined) dbUpdates.icp_profile_id = updates.icpProfileId;
    if (updates.customTargeting !== undefined) dbUpdates.custom_targeting = updates.customTargeting;
    if (updates.targetAudience !== undefined) dbUpdates.target_audience = updates.targetAudience;
    if (updates.successCriteria !== undefined) dbUpdates.success_criteria = updates.successCriteria;
    if (updates.integrationTracking !== undefined) dbUpdates.integration_tracking = updates.integrationTracking;

    const { data, error } = await supabase
      .from('experiments')
      .update(dbUpdates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating experiment:', error);
      return null;
    }
    
    return data[0] ? transformExperiment(data[0]) : null;
  }

  static async deleteExperiment(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('experiments')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting experiment:', error);
      return false;
    }
    
    return true;
  }

  // Blueprints
  static async getBlueprints(): Promise<Blueprint[]> {
    const { data, error } = await supabase
      .from('blueprints')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching blueprints:', error);
      return [];
    }
    
    return data.map(transformBlueprint);
  }

  static async createBlueprint(blueprint: Omit<Blueprint, 'id' | 'createdAt' | 'lastUsed'>): Promise<Blueprint | null> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const dbBlueprint = {
      name: blueprint.name,
      description: blueprint.description,
      industry: blueprint.industry,
      target_roles: blueprint.targetRoles,
      company_size: blueprint.companySize,
      company_revenue: blueprint.companyRevenue,
      pain_points: blueprint.painPoints,
      automation: blueprint.automation,
      value_proposition: blueprint.valueProposition,
      success_rate: blueprint.successRate,
      avg_roi: blueprint.avgRoi,
      avg_meetings_booked: blueprint.avgMeetingsBooked,
      total_revenue: blueprint.totalRevenue,
      conversion_rate: blueprint.conversionRate,
      tags: blueprint.tags,
      usage_count: blueprint.usageCount,
      related_experiments: blueprint.relatedExperiments,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('blueprints')
      .insert([dbBlueprint])
      .select();
    
    if (error) {
      console.error('Error creating blueprint:', error);
      return null;
    }
    
    return data[0] ? transformBlueprint(data[0]) : null;
  }

  static async updateBlueprint(id: string, updates: Partial<Blueprint>): Promise<Blueprint | null> {
    const dbUpdates: any = {};
    
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.industry !== undefined) dbUpdates.industry = updates.industry;
    if (updates.targetRoles !== undefined) dbUpdates.target_roles = updates.targetRoles;
    if (updates.companySize !== undefined) dbUpdates.company_size = updates.companySize;
    if (updates.companyRevenue !== undefined) dbUpdates.company_revenue = updates.companyRevenue;
    if (updates.painPoints !== undefined) dbUpdates.pain_points = updates.painPoints;
    if (updates.automation !== undefined) dbUpdates.automation = updates.automation;
    if (updates.valueProposition !== undefined) dbUpdates.value_proposition = updates.valueProposition;
    if (updates.successRate !== undefined) dbUpdates.success_rate = updates.successRate;
    if (updates.avgRoi !== undefined) dbUpdates.avg_roi = updates.avgRoi;
    if (updates.avgMeetingsBooked !== undefined) dbUpdates.avg_meetings_booked = updates.avgMeetingsBooked;
    if (updates.totalRevenue !== undefined) dbUpdates.total_revenue = updates.totalRevenue;
    if (updates.conversionRate !== undefined) dbUpdates.conversion_rate = updates.conversionRate;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.usageCount !== undefined) dbUpdates.usage_count = updates.usageCount;
    if (updates.relatedExperiments !== undefined) dbUpdates.related_experiments = updates.relatedExperiments;

    const { data, error } = await supabase
      .from('blueprints')
      .update(dbUpdates)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error('Error updating blueprint:', error);
      return null;
    }
    
    return data[0] ? transformBlueprint(data[0]) : null;
  }

  static async deleteBlueprint(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('blueprints')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blueprint:', error);
      return false;
    }
    
    return true;
  }

  // ICP Profiles
  static async getICPProfiles(): Promise<ICPProfile[]> {
    const { data, error } = await supabase
      .from('icp_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching ICP profiles:', error);
      return [];
    }
    
    return data.map(transformICPProfile);
  }

  static async createICPProfile(profile: Omit<ICPProfile, 'id' | 'createdAt' | 'lastUsed'>): Promise<ICPProfile | null> {
    // Get current user ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const dbProfile = {
      name: profile.name,
      description: profile.description,
      job_titles: profile.jobTitles,
      industries: profile.industries,
      geographies: profile.geographies,
      company_sizes: profile.companySizes,
      company_revenue: profile.companyRevenue,
      technology_stack: profile.technologyStack,
      pain_points: profile.painPoints,
      buying_authority: profile.buyingAuthority,
      tags: profile.tags,
      usage_count: profile.usageCount,
      related_experiments: profile.relatedExperiments,
      user_id: user.id
    };

    const { data, error } = await supabase
      .from('icp_profiles')
      .insert([dbProfile])
      .select();
    
    if (error) {
      console.error('Error creating ICP profile:', error);
      return null;
    }
    
    return data[0] ? transformICPProfile(data[0]) : null;
  }
} 