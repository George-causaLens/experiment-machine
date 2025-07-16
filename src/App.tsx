import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Experiment, Blueprint, ICPProfile } from './types';
import Dashboard from './components/Dashboard';
import ExperimentManager from './components/ExperimentManager';
import BlueprintLibrary from './components/BlueprintLibrary';
import AIRecommendations from './components/AIRecommendations';
import ExperimentDetail from './components/ExperimentDetail';
import BlueprintDetail from './components/BlueprintDetail';
import CreateExperiment from './components/CreateExperiment';
import CreateBlueprint from './components/CreateBlueprint';
import EditBlueprint from './components/EditBlueprint';
import Navigation from './components/Navigation';
import ICPProfileManager from './components/ICPProfileManager';
import CreateICPProfile from './components/CreateICPProfile';
import AnalyticsDashboard from './components/AnalyticsDashboard';

function App() {
  // State management for experiments
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'exp-068',
      name: 'Technical Pain Point LinkedIn - Manufacturing COOs',
      description: 'High response rate LinkedIn campaigns with technical pain point messaging for Manufacturing COOs',
      status: 'active',
      createdAt: new Date('2024-01-15'),
      startedAt: new Date('2024-01-16'),
      endDate: new Date('2024-12-15'), // Future date for active experiment
      blueprintId: 'bp-001',
      outreachStrategy: 'LinkedIn Direct Message',
      messaging: 'Technical pain point messaging focused on document processing inefficiencies',
      content: 'LinkedIn Direct Message',
      distributionChannel: 'LinkedIn',
      targetAudience: 'Manufacturing COOs at $100M+ companies',
      variables: [
        { name: 'Target Role', value: 'COO', type: 'icp' },
        { name: 'Company Size', value: '$100M+ revenue', type: 'icp' },
        { name: 'Pain Point', value: 'Document processing inefficiencies', type: 'messaging' }
      ],
      successCriteria: {
        primaryGoal: 'meetings',
        targetMetrics: {
          meetingsBooked: 10,
          leadsGenerated: 15,
          responseRate: 8.0,
          roi: 3.0
        },
        timeFrame: 30,
        successThreshold: 80,
        secondaryGoals: ['High response rate', 'Quality leads']
      },
      integrationTracking: [
        {
          integrationId: 'linkedin-1',
          integrationName: 'LinkedIn Campaign Manager',
          integrationType: 'linkedin',
          campaignName: 'COO Document Automation Campaign',
          activityType: 'impressions',
          lastSync: new Date('2024-01-20'),
          isActive: true,
          config: { campaignId: 'li-campaign-001' }
        }
      ],
      metrics: {
        impressions: 1250,
        clicks: 89,
        conversions: 12,
        meetingsBooked: 8,
        cost: 450,
        roi: 1180, // Calculated: (8 × $7,200 - $450) / $450 × 100 = 1,180%
        conversionRate: 13.5,
        ctr: 7.1,
        cpc: 5.1,
        cpm: 360
      },
      successScore: 85,
      tags: ['linkedin', 'coo', 'manufacturing', 'technical-pain-points']
    },
    {
      id: 'exp-067',
      name: 'Case Study Email Nurture - Financial Services CTOs',
      description: 'Case study email nurture sequences for Financial Services CTOs',
      status: 'completed',
      createdAt: new Date('2024-01-10'),
      startedAt: new Date('2024-01-11'),
      endDate: new Date('2024-01-25'),
      completedAt: new Date('2024-01-25'),
      blueprintId: 'bp-002',
      outreachStrategy: 'Email Sequence',
      messaging: 'Case study focused on fraud detection ROI and implementation',
      content: 'Email Sequence',
      distributionChannel: 'Email',
      targetAudience: 'Financial Services CTOs at $500M+ companies',
      variables: [
        { name: 'Target Role', value: 'CTO', type: 'icp' },
        { name: 'Company Size', value: '$500M+ revenue', type: 'icp' },
        { name: 'Sequence Length', value: '5 emails', type: 'content' }
      ],
      successCriteria: {
        primaryGoal: 'leads',
        targetMetrics: {
          meetingsBooked: 12,
          leadsGenerated: 20,
          responseRate: 12.0,
          roi: 2.5
        },
        timeFrame: 21,
        successThreshold: 75,
        secondaryGoals: ['High engagement rate', 'Low cost per lead']
      },
      integrationTracking: [
        {
          integrationId: 'hubspot-1',
          integrationName: 'HubSpot CRM',
          integrationType: 'hubspot',
          campaignName: 'CTO Fraud Detection Email Sequence',
          activityType: 'leads',
          lastSync: new Date('2024-01-25'),
          isActive: true,
          config: { campaignId: 'hs-campaign-002' }
        }
      ],
      metrics: {
        impressions: 800,
        clicks: 156,
        conversions: 18,
        meetingsBooked: 14,
        cost: 320,
        roi: 3050, // Calculated: (14 × $7,200 - $320) / $320 × 100 = 3,050%
        conversionRate: 11.5,
        ctr: 19.5,
        cpc: 2.1,
        cpm: 400
      },
      successScore: 78,
      tags: ['email', 'cto', 'financial-services', 'case-study']
    },
    {
      id: 'exp-066',
      name: 'ROI-Focused Content - Healthcare VPs',
      description: 'ROI-focused content approaches for Healthcare VP Operations',
      status: 'completed',
      createdAt: new Date('2024-01-05'),
      startedAt: new Date('2024-01-06'),
      endDate: new Date('2024-01-20'),
      completedAt: new Date('2024-01-20'),
      blueprintId: 'bp-003',
      outreachStrategy: 'Content Marketing',
      messaging: 'ROI-focused content highlighting $15M annual efficiency gains',
      content: 'ROI Calculator & Case Study',
      distributionChannel: 'Content Marketing',
      targetAudience: 'Healthcare VP Operations at $50M+ companies',
      variables: [
        { name: 'Content Type', value: 'ROI Calculator', type: 'content' },
        { name: 'Target Role', value: 'VP Operations', type: 'icp' },
        { name: 'Value Focus', value: '$15M annual efficiency', type: 'messaging' }
      ],
      successCriteria: {
        primaryGoal: 'revenue',
        targetMetrics: {
          meetingsBooked: 15,
          leadsGenerated: 25,
          revenueGenerated: 50000,
          roi: 4.0
        },
        timeFrame: 30,
        successThreshold: 85,
        secondaryGoals: ['High conversion rate', 'Quality content engagement']
      },
      integrationTracking: [
        {
          integrationId: 'google-analytics-1',
          integrationName: 'Google Analytics',
          integrationType: 'google-analytics',
          campaignName: 'Healthcare VP Content Campaign',
          activityType: 'conversions',
          lastSync: new Date('2024-01-20'),
          isActive: true,
          config: { campaignId: 'ga-campaign-003' }
        },
        {
          integrationId: 'hubspot-1',
          integrationName: 'HubSpot CRM',
          integrationType: 'hubspot',
          campaignName: 'Healthcare VP Lead Tracking',
          activityType: 'leads',
          lastSync: new Date('2024-01-20'),
          isActive: true,
          config: { campaignId: 'hs-campaign-003' }
        }
      ],
      metrics: {
        impressions: 2100,
        clicks: 234,
        conversions: 22,
        meetingsBooked: 16,
        cost: 180,
        roi: 6300, // Calculated: (16 × $7,200 - $180) / $180 × 100 = 6,300%
        conversionRate: 9.4,
        ctr: 11.1,
        cpc: 0.8,
        cpm: 85.7
      },
      successScore: 92,
      tags: ['content', 'roi-focused', 'healthcare', 'vp-operations']
    }
  ]);

  // State management for blueprints
  const [blueprints, setBlueprints] = useState<Blueprint[]>([
    {
      id: 'bp-001',
      name: 'Manufacturing COO Document Automation',
      description: 'Automate PDF categorization and document processing for Manufacturing COOs at large companies',
      industry: 'Manufacturing',
      targetRole: 'COO',
      companySize: '$100M+ revenue',
      automation: 'PDF → Categorization automation',
      valueProposition: '$50M annual value through streamlined document processing',
      successRate: 85,
      avgRoi: 4.2,
      avgMeetingsBooked: 18,
      totalRevenue: 50000000,
      conversionRate: 22.5,
      tags: ['manufacturing', 'coo', 'document-automation', 'pdf-processing'],
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-20'),
      usageCount: 15,
      relatedExperiments: ['exp-068', 'exp-065']
    },
    {
      id: 'bp-002',
      name: 'Financial Services CTO Fraud Detection',
      description: 'Automate transaction monitoring and fraud detection for Financial Services CTOs',
      industry: 'Financial Services',
      targetRole: 'CTO',
      companySize: '$500M+ revenue',
      automation: 'Transaction → Fraud Detection',
      valueProposition: '$25M annual savings through automated fraud prevention',
      successRate: 78,
      avgRoi: 3.8,
      avgMeetingsBooked: 14,
      totalRevenue: 25000000,
      conversionRate: 18.2,
      tags: ['financial-services', 'cto', 'fraud-detection', 'transaction-monitoring'],
      createdAt: new Date('2023-12-15'),
      lastUsed: new Date('2024-01-18'),
      usageCount: 23,
      relatedExperiments: ['exp-067']
    },
    {
      id: 'bp-003',
      name: 'Healthcare VP Operations Compliance',
      description: 'Automate patient data compliance and regulatory reporting for Healthcare VP Operations',
      industry: 'Healthcare',
      targetRole: 'VP Operations',
      companySize: '$50M+ revenue',
      automation: 'Patient Data → Compliance Automation',
      valueProposition: '$15M annual efficiency gains through automated compliance',
      successRate: 82,
      avgRoi: 3.5,
      avgMeetingsBooked: 16,
      totalRevenue: 15000000,
      conversionRate: 19.8,
      tags: ['healthcare', 'vp-operations', 'compliance', 'patient-data'],
      createdAt: new Date('2023-11-20'),
      lastUsed: new Date('2024-01-15'),
      usageCount: 8,
      relatedExperiments: ['exp-066']
    }
  ]);

  // State management for ICP profiles
  const [icpProfiles, setICPProfiles] = useState<ICPProfile[]>([
    {
      id: 'icp-001',
      name: 'Manufacturing COO - Large Companies',
      description: 'COOs at large manufacturing companies with $100M+ revenue',
      jobTitles: ['COO', 'Chief Operating Officer'],
      industries: ['Manufacturing', 'Industrial'],
      geographies: ['North America', 'United States'],
      companySizes: ['$100M+ revenue', '1001-5000 employees', '5001-10000 employees'],
      companyRevenue: ['$100M - $500M', '$500M - $1B', '$1B - $5B'],
      technologyStack: ['ERP Systems', 'Manufacturing Software', 'Supply Chain Management'],
      painPoints: ['Operational efficiency', 'Cost reduction', 'Process automation'],
      buyingAuthority: 'executive',
      tags: ['manufacturing', 'coo', 'large-companies', 'operational-efficiency'],
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-20'),
      usageCount: 15,
      relatedExperiments: ['exp-068']
    },
    {
      id: 'icp-002',
      name: 'Financial Services CTO - Enterprise',
      description: 'CTOs at large financial services companies with $500M+ revenue',
      jobTitles: ['CTO', 'Chief Technology Officer', 'VP Engineering'],
      industries: ['Financial Services', 'Banking', 'Insurance'],
      geographies: ['North America', 'United States', 'Europe'],
      companySizes: ['$500M+ revenue', '5001-10000 employees', '10000+ employees'],
      companyRevenue: ['$500M - $1B', '$1B - $5B', '$5B - $10B'],
      technologyStack: ['AWS', 'Azure', 'Salesforce', 'HubSpot', 'Custom Software'],
      painPoints: ['Security compliance', 'Technology integration', 'Data management'],
      buyingAuthority: 'executive',
      tags: ['financial-services', 'cto', 'enterprise', 'security'],
      createdAt: new Date('2023-12-15'),
      lastUsed: new Date('2024-01-18'),
      usageCount: 23,
      relatedExperiments: ['exp-067']
    },
    {
      id: 'icp-003',
      name: 'Healthcare VP Operations - Mid-Market',
      description: 'VP Operations at mid-market healthcare companies with $50M+ revenue',
      jobTitles: ['VP Operations', 'VP of Operations', 'Director of Operations'],
      industries: ['Healthcare', 'Medical Devices', 'Pharmaceuticals'],
      geographies: ['North America', 'United States'],
      companySizes: ['$50M+ revenue', '201-500 employees', '501-1000 employees'],
      companyRevenue: ['$50M - $100M', '$100M - $500M'],
      technologyStack: ['Electronic Health Records', 'Healthcare Software', 'Compliance Tools'],
      painPoints: ['Compliance requirements', 'Operational efficiency', 'Patient care quality'],
      buyingAuthority: 'decision-maker',
      tags: ['healthcare', 'vp-operations', 'mid-market', 'compliance'],
      createdAt: new Date('2023-11-20'),
      lastUsed: new Date('2024-01-15'),
      usageCount: 8,
      relatedExperiments: ['exp-066']
    }
  ]);

  // Functions to manage experiments
  const addExperiment = (experiment: Experiment) => {
    setExperiments(prev => [...prev, experiment]);
  };

  const updateExperiment = (id: string, updates: Partial<Experiment>) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    ));
  };

  const deleteExperiment = (id: string) => {
    setExperiments(prev => prev.filter(exp => exp.id !== id));
  };

  // Functions to manage blueprints
  const addBlueprint = (blueprint: Blueprint) => {
    setBlueprints(prev => [...prev, blueprint]);
  };

  const updateBlueprint = (id: string, updates: Partial<Blueprint>) => {
    setBlueprints(prev => prev.map(bp => 
      bp.id === id ? { ...bp, ...updates } : bp
    ));
  };

  const deleteBlueprint = (id: string) => {
    setBlueprints(prev => prev.filter(bp => bp.id !== id));
  };

  // Functions to manage ICP profiles
  const addICPProfile = (icpProfile: ICPProfile) => {
    setICPProfiles(prev => [...prev, icpProfile]);
  };

  const updateICPProfile = (id: string, updates: Partial<ICPProfile>) => {
    setICPProfiles(prev => prev.map(icp => 
      icp.id === id ? { ...icp, ...updates } : icp
    ));
  };

  const deleteICPProfile = (id: string) => {
    setICPProfiles(prev => prev.filter(icp => icp.id !== id));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="lg:pl-64">
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            <Routes>
            <Route path="/" element={
              <Dashboard 
                experiments={experiments}
                blueprints={blueprints}
              />
            } />
            <Route path="/experiments" element={
              <ExperimentManager 
                experiments={experiments}
                blueprints={blueprints}
                onAddExperiment={addExperiment}
                onUpdateExperiment={updateExperiment}
                onDeleteExperiment={deleteExperiment}
              />
            } />
            <Route path="/experiments/:id" element={
              <ExperimentDetail 
                experiments={experiments}
                onUpdateExperiment={updateExperiment}
                onDeleteExperiment={deleteExperiment}
              />
            } />
            <Route path="/experiments/:id/edit" element={
              <CreateExperiment 
                blueprints={blueprints}
                icpProfiles={icpProfiles}
                experiments={experiments}
                onAddExperiment={addExperiment}
                onUpdateExperiment={updateExperiment}
                isEditing={true}
              />
            } />
            <Route path="/experiments/create" element={
              <CreateExperiment 
                blueprints={blueprints}
                icpProfiles={icpProfiles}
                experiments={experiments}
                onAddExperiment={addExperiment}
              />
            } />
            <Route path="/blueprints" element={
              <BlueprintLibrary 
                blueprints={blueprints}
                experiments={experiments}
                onAddBlueprint={addBlueprint}
                onUpdateBlueprint={updateBlueprint}
                onDeleteBlueprint={deleteBlueprint}
              />
            } />
            <Route path="/blueprints/:id" element={
              <BlueprintDetail 
                blueprints={blueprints}
                experiments={experiments}
                onUpdateBlueprint={updateBlueprint}
                onDeleteBlueprint={deleteBlueprint}
              />
            } />
            <Route path="/blueprints/:id/edit" element={
              <EditBlueprint 
                blueprints={blueprints}
                onUpdateBlueprint={updateBlueprint}
              />
            } />
            <Route path="/blueprints/create" element={
              <CreateBlueprint 
                onAddBlueprint={addBlueprint}
              />
            } />
            <Route path="/icp-profiles" element={
              <ICPProfileManager 
                icpProfiles={icpProfiles}
                onAddICPProfile={addICPProfile}
                onUpdateICPProfile={updateICPProfile}
                onDeleteICPProfile={deleteICPProfile}
              />
            } />
            <Route path="/icp-profiles/create" element={
              <CreateICPProfile 
                icpProfiles={icpProfiles}
                onAddICPProfile={addICPProfile}
                onUpdateICPProfile={updateICPProfile}
              />
            } />
            <Route path="/icp-profiles/:id/edit" element={
              <CreateICPProfile 
                icpProfiles={icpProfiles}
                onAddICPProfile={addICPProfile}
                onUpdateICPProfile={updateICPProfile}
              />
            } />
            <Route path="/ai-recommendations" element={
              <AIRecommendations 
                experiments={experiments}
                blueprints={blueprints}
                onAddExperiment={addExperiment}
                onAddBlueprint={addBlueprint}
              />
            } />
            <Route path="/analytics" element={
              <AnalyticsDashboard 
                experiments={experiments}
                blueprints={blueprints}
              />
            } />
                      </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App; 