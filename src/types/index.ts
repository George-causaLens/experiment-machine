// NEW: ICP Profile Interface
export interface ICPProfile {
  id: string;
  name: string;
  description: string;
  jobTitles: string[];
  industries: string[];
  geographies: string[];
  companySizes: string[];
  companyRevenue: string[];
  technologyStack?: string[];
  painPoints?: string[];
  buyingAuthority: 'decision-maker' | 'influencer' | 'end-user' | 'executive';
  tags: string[];
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  relatedExperiments: string[];
}

// NEW: Custom Targeting Interface
export interface CustomTargeting {
  jobTitles: string[];
  industries: string[];
  geographies: string[];
  companySizes: string[];
  companyRevenue: string[];
  technologyStack?: string[];
  painPoints?: string[];
  buyingAuthority: 'decision-maker' | 'influencer' | 'end-user' | 'executive';
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  createdAt: Date;
  startedAt?: Date;
  endDate: Date; // NEW: When the experiment is scheduled to end
  completedAt?: Date;
  blueprintId: string; // Links experiment to specific blueprint
  outreachStrategy: string; // e.g., "LinkedIn Direct Message", "Email Sequence", "Content Marketing"
  messaging: string;
  content: string;
  distributionChannel: string;
  variables: ExperimentVariable[];
  metrics: ExperimentMetrics;
  successScore?: number;
  tags: string[];
  // NEW: ICP Profile or Custom Targeting
  icpProfileId?: string; // If using a predefined ICP profile
  customTargeting?: CustomTargeting; // If using custom targeting values
  targetAudience: string; // Legacy field - keep for backward compatibility
  successCriteria: SuccessCriteria; // NEW: Define what success looks like
  integrationTracking: IntegrationTracking[]; // NEW: Track which integrations/campaigns
}

export interface ExperimentVariable {
  name: string;
  value: string;
  type: 'icp' | 'messaging' | 'content' | 'channel' | 'timing' | 'other';
}

export interface ExperimentMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  meetingsBooked: number;
  cost: number;
  roi: number;
  conversionRate: number;
  ctr: number;
  cpc: number;
  cpm: number;
}

// NEW: Success Criteria Interface
export interface SuccessCriteria {
  primaryGoal: 'meetings' | 'leads' | 'revenue' | 'engagement' | 'awareness';
  targetMetrics: {
    meetingsBooked?: number;
    leadsGenerated?: number;
    revenueGenerated?: number;
    responseRate?: number;
    clickThroughRate?: number;
    conversionRate?: number;
    costPerLead?: number;
    roi?: number;
  };
  timeFrame: number; // Days to run the experiment
  successThreshold: number; // Percentage of target to consider successful (e.g., 80%)
  secondaryGoals?: string[]; // Additional success indicators
}

// NEW: Integration Tracking Interface
export interface IntegrationTracking {
  integrationId: string;
  integrationName: string;
  integrationType: 'hubspot' | 'google-analytics' | 'linkedin' | 'email' | 'zapier' | 'other';
  campaignId?: string; // Specific campaign ID in the integration
  campaignName?: string; // Human-readable campaign name
  activityType: 'impressions' | 'clicks' | 'conversions' | 'meetings' | 'leads' | 'revenue';
  trackingUrl?: string; // URL to track this specific experiment
  lastSync: Date;
  isActive: boolean;
  config: Record<string, any>; // Integration-specific configuration
}

export interface Blueprint {
  id: string;
  name: string;
  description: string;
  industry: string;
  targetRole: string;
  companySize: string;
  automation: string;
  valueProposition: string;
  successRate: number;
  avgRoi: number;
  avgMeetingsBooked: number;
  totalRevenue: number;
  conversionRate: number;
  tags: string[];
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  relatedExperiments: string[]; // IDs of successful experiments for this blueprint
}

export interface Integration {
  id: string;
  name: string;
  type: 'hubspot' | 'google-analytics' | 'linkedin' | 'email' | 'zapier' | 'other';
  status: 'connected' | 'disconnected' | 'error';
  lastSync: Date;
  config: Record<string, any>;
  // NEW: Integration capabilities
  capabilities: {
    canTrackImpressions: boolean;
    canTrackClicks: boolean;
    canTrackConversions: boolean;
    canTrackMeetings: boolean;
    canTrackLeads: boolean;
    canTrackRevenue: boolean;
    canCreateCampaigns: boolean;
    canSyncContacts: boolean;
  };
  // NEW: Available campaigns/activities
  availableCampaigns?: {
    id: string;
    name: string;
    type: string;
    status: 'active' | 'paused' | 'completed';
    metrics?: Record<string, number>;
  }[];
}

export interface AIRecommendation {
  id: string;
  type: 'blueprint-match' | 'experiment-replication' | 'optimization' | 'new-blueprint';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  suggestedVariables: ExperimentVariable[];
  expectedOutcome: string;
  relatedBlueprints: string[];
  relatedExperiments: string[];
  targetBlueprint?: string; // If recommending for specific blueprint
}

export interface DashboardMetrics {
  totalExperiments: number;
  activeExperiments: number;
  successRate: number;
  totalMeetingsBooked: number;
  avgRoi: number;
  topPerformingChannel: string;
  topPerformingIcp: string;
}

export interface ExperimentFilters {
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  icp?: string[];
  channel?: string[];
  tags?: string[];
  performance?: 'high' | 'medium' | 'low';
}

// NEW: Success Score Calculation Types
export interface SuccessScoreCalculation {
  experimentId: string;
  calculatedAt: Date;
  score: number; // 0-100
  breakdown: {
    primaryGoal: number; // Weight: 60%
    secondaryGoals: number; // Weight: 30%
    efficiency: number; // Weight: 10%
  };
  details: {
    targetAchievement: number; // Percentage of target met
    timeEfficiency: number; // How quickly goals were achieved
    costEfficiency: number; // ROI vs expected
    qualityScore: number; // Lead quality, meeting attendance, etc.
  };
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'super_admin' | 'admin' | 'user' | 'pending';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  approved_at?: Date;
  approved_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserApprovalRequest {
  id: string;
  email: string;
  full_name?: string;
  created_at: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SuperAdminStats {
  totalUsers: number;
  pendingApprovals: number;
  approvedUsers: number;
  rejectedUsers: number;
  suspendedUsers: number;
} 