import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  BeakerIcon, 
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  FlagIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Experiment, Blueprint, ExperimentVariable, SuccessCriteria, ICPProfile, CustomTargeting, AIRecommendation } from '../types';

interface CreateExperimentProps {
  blueprints: Blueprint[];
  icpProfiles: ICPProfile[];
  experiments?: Experiment[];
  onAddExperiment: (experiment: Experiment) => void;
  onUpdateExperiment?: (id: string, updates: Partial<Experiment>) => void;
  isEditing?: boolean;
}

const CreateExperiment: React.FC<CreateExperimentProps> = ({ blueprints, icpProfiles, experiments = [], onAddExperiment, onUpdateExperiment, isEditing = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const aiRecommendation = location.state?.aiRecommendation as AIRecommendation | undefined;
  const selectedIdea = location.state?.selectedIdea as any;
  const mode = location.state?.mode as string;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    blueprintId: '',
    outreachStrategy: '',
    messaging: '',
    content: '',
    distributionChannel: '',
    targetAudience: '',
    selectedIcpProfileId: '',
    customTargeting: null as CustomTargeting | null,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
    tags: [] as string[],
    variables: [] as ExperimentVariable[],
    successCriteria: {
      primaryGoal: 'meetings' as const,
      targetMetrics: {
        meetingsBooked: 0,
        leadsGenerated: 0,
        revenueGenerated: 0,
        responseRate: 0,
        clickThroughRate: 0,
        conversionRate: 0,
        costPerLead: 0,
        roi: 0
      },
      timeFrame: 30,
      successThreshold: 80,
      secondaryGoals: [] as string[]
    } as SuccessCriteria,
  });
  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState({ name: '', value: '', type: 'icp' as const });
  const [newSecondaryGoal, setNewSecondaryGoal] = useState('');
  const [showCustomTargeting, setShowCustomTargeting] = useState(false);
  
  // Custom targeting form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newGeography, setNewGeography] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('');
  const [newCompanyRevenue, setNewCompanyRevenue] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');

  // Predefined options for custom targeting (same as CreateICPProfile)
  const predefinedJobTitles = [
    // CROSS-INDUSTRY (Operational + Analytical Titles)
    { group: 'CROSS-INDUSTRY (Operational + Analytical Titles)', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Operating Officer (COO)',
    'Chief Transformation Officer (CTO)',
    'Chief Supply Chain Officer (CSCO)',
    'Chief Commercial Officer (CCO)',
    'Chief Financial Officer (CFO)',
    'Chief Analytics Officer (CAO)',
    'Chief Data Officer (CDO)',
    'Chief Technology Officer (CTO)',
    'Chief Information Officer (CIO)',
    { group: 'C-1 to C-3 (Operational Leadership)', type: 'subheader' },
    'VP / SVP / Director of Operations',
    'VP / Director of Supply Chain',
    'VP / Director of Process Excellence / Operational Excellence',
    'VP / Director of Commercial Operations',
    'VP / Director of Shared Services / Business Services',
    'VP / Director of Global Business Services (GBS)',
    'VP / Director of Digital Transformation',
    'VP / Director of Procurement Operations',
    'Head of Business Process Automation / Intelligent Automation',
    { group: 'C-1 to C-3 (Analytical Leadership)', type: 'subheader' },
    'VP / Director of Analytics & Insights',
    'VP / Director of Data Science',
    'VP / Director of Reporting & BI',
    'VP / Director of Forecasting / Planning & Analysis',
    'Head of Advanced Analytics',
    'Head of Data Platforms / Engineering',
    { group: 'RETAIL / CPG', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Merchandising Officer',
    'Chief Supply Chain Officer',
    'Chief Marketing Officer (for campaign analytics ops)',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Demand Planning',
    'VP / Director of Inventory & Logistics',
    'Director of Retail Operations',
    'Director of Marketing Analytics',
    'Head of Category Insights',
    'Director of Trade Promotion Effectiveness',
    'Head of Sales & Channel Performance',
    { group: 'PHARMACEUTICALS', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Commercial Officer',
    'Chief Medical Officer (for clinical ops)',
    'Chief Scientific Officer',
    'Chief Operating Officer (often covers both R&D and Commercial Ops)',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Clinical Operations',
    'VP / Director of R&D Operations',
    'VP / Director of Commercial Excellence',
    'VP / Director of Medical Affairs Operations',
    'Director of Field Force Effectiveness',
    { group: 'FINANCIAL SERVICES', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Risk Officer (CRO)',
    'Chief Underwriting Officer (Insurance)',
    'Chief Operating Officer',
    'Chief Analytics Officer',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Risk & Compliance Operations',
    'VP / Director of Credit Analytics',
    'Director of Fraud & Financial Crime Analytics',
    'VP / Director of Claims Operations (Insurance)',
    'Director of Customer Intelligence',
    'Head of Financial Planning & Analysis (FP&A)',
    'Head of Regulatory Reporting Automation',
    { group: 'MANUFACTURING / INDUSTRIALS', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Supply Chain Officer',
    'Chief Operations Officer',
    'Chief Manufacturing Officer',
    'Chief Digital Officer / CIO',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Supply Chain Analytics',
    'VP / Director of Manufacturing Excellence',
    'Director of Quality Analytics'
  ];

  const predefinedIndustries = [
    'Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail', 'Education',
    'Real Estate', 'Transportation', 'Energy', 'Media & Entertainment', 'Consulting',
    'Legal Services', 'Insurance', 'Telecommunications', 'Aerospace', 'Automotive',
    'Biotechnology', 'Pharmaceuticals', 'E-commerce', 'SaaS', 'Fintech', 'Edtech',
    'Healthtech', 'Proptech', 'Logistics', 'Food & Beverage', 'Fashion', 'Sports'
  ];

  const predefinedGeographies = [
    'North America', 'United States', 'Canada', 'Europe', 'United Kingdom', 'Germany',
    'France', 'Netherlands', 'Sweden', 'Switzerland', 'Asia Pacific', 'Australia',
    'Singapore', 'Japan', 'South Korea', 'India', 'China', 'Latin America', 'Brazil',
    'Mexico', 'Argentina', 'Middle East', 'United Arab Emirates', 'Israel', 'Africa',
    'South Africa', 'Nigeria', 'Kenya'
  ];

  const predefinedCompanySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees',
    '501-1000 employees', '1001-5000 employees', '5001-10000 employees', '10000+ employees'
  ];

  const predefinedCompanyRevenue = [
    'Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', '$100M - $500M',
    '$500M - $1B', '$1B - $5B', '$5B - $10B', '$10B+'
  ];

  const predefinedTechnologies = [
    'Salesforce', 'HubSpot', 'Marketo', 'Pardot', 'Zapier', 'Slack', 'Microsoft Teams',
    'Zoom', 'Google Workspace', 'Microsoft 365', 'AWS', 'Azure', 'Google Cloud',
    'Shopify', 'WooCommerce', 'Magento', 'WordPress', 'Drupal', 'Joomla',
    'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'
  ];

  const predefinedPainPoints = [
    // General Pain Points (Operational + Analytical)
    { group: 'General Pain Points (Operational + Analytical)', type: 'header' },
    'Operational efficiency',
    'Process automation',
    'Manual reporting',
    'Forecasting inaccuracy',
    'Delayed insights',
    'Siloed data',
    'Decision latency',
    'High labor costs',
    'Workflow bottlenecks',
    'Repetitive tasks',
    'Tool sprawl',
    'Poor data quality',
    'Slow time-to-value',
    'Legacy systems',
    'Resource constraints',
    'Insight inactionability',
    'Compliance risk',
    'Scaling limitations',
    'Human error',
    'Audit complexity',
    'Change resistance',
    'Demand unpredictability',
    'Data overload',
    'Underused analytics',
    'Inefficient handoffs',
    'Analyst dependency',
    { group: 'Retail / CPG Pain Points', type: 'header' },
    'Demand volatility',
    'Inventory imbalances',
    'Trade inefficiency',
    'Merchandising delays',
    'Pricing complexity',
    'Promotion performance',
    'Supply disruptions',
    'Channel misalignment',
    'Sales forecasting gaps',
    'Planogram inefficiency',
    'SKU proliferation',
    'Store execution gaps',
    { group: 'Pharmaceuticals Pain Points', type: 'header' },
    'Trial enrollment delays',
    'Field force inefficiency',
    'Commercial waste',
    'Market access complexity',
    'Regulatory overhead',
    'R&D cycle time',
    'Site activation delays',
    'HCP targeting issues',
    'Data integration issues',
    'Launch forecasting gaps',
    'Medical affairs backlog',
    'Compliance documentation',
    { group: 'Financial Services Pain Points', type: 'header' },
    'Risk exposure',
    'Manual underwriting',
    'Claims backlog',
    'Fraud detection delays',
    'Credit scoring gaps',
    'KYC inefficiency',
    'Regulatory reporting',
    'Policy churn analysis',
    'Customer attrition risk',
    'Branch performance gaps',
    'Audit trail gaps',
    'Pricing inconsistency',
    { group: 'Manufacturing / Industrials Pain Points', type: 'header' },
    'Downtime prediction',
    'Root cause delay',
    'Quality variation',
    'Maintenance inefficiency',
    'Throughput stagnation',
    'Supply planning errors',
    'Parts inventory bloat',
    'Procurement delays',
    'Schedule variability',
    'Energy inefficiency',
    'Waste identification',
    'Equipment failure'
  ];

  const outreachStrategies = [
    'LinkedIn Direct Message',
    'Email Sequence',
    'Content Marketing',
    'Webinar',
    'Social Media',
    'Paid Advertising',
    'Event Marketing',
    'Direct Mail'
  ];

  const distributionChannels = [
    'LinkedIn',
    'Email',
    'Content Marketing',
    'Webinar',
    'Twitter',
    'Facebook',
    'Google Ads',
    'Events',
    'Direct Mail'
  ];

  const variableTypes = [
    { value: 'icp', label: 'Target ICP' },
    { value: 'messaging', label: 'Messaging' },
    { value: 'content', label: 'Content' },
    { value: 'channel', label: 'Channel' },
    { value: 'timing', label: 'Timing' },
    { value: 'other', label: 'Other' }
  ];

  const primaryGoals = [
    { value: 'meetings', label: 'Meetings Booked' },
    { value: 'leads', label: 'Leads Generated' },
    { value: 'revenue', label: 'Revenue Generated' },
    { value: 'engagement', label: 'Engagement Rate' },
    { value: 'awareness', label: 'Brand Awareness' }
  ];

  // Pre-populate form with AI recommendation data or existing experiment data
  useEffect(() => {
    if (isEditing && id) {
      // Load existing experiment data for editing
      const existingExperiment = experiments.find(exp => exp.id === id);
      if (existingExperiment) {
        setFormData({
          name: existingExperiment.name,
          description: existingExperiment.description,
          blueprintId: existingExperiment.blueprintId,
          outreachStrategy: existingExperiment.outreachStrategy,
          messaging: existingExperiment.messaging,
          content: existingExperiment.content,
          distributionChannel: existingExperiment.distributionChannel,
          targetAudience: existingExperiment.targetAudience,
          selectedIcpProfileId: '',
          customTargeting: null,
          endDate: existingExperiment.endDate.toISOString().split('T')[0],
          tags: existingExperiment.tags,
          variables: existingExperiment.variables,
          successCriteria: existingExperiment.successCriteria
        });
      }
    } else if (aiRecommendation) {
      const suggestedVariables = aiRecommendation.suggestedVariables || [];
      
      // Extract values from suggested variables
      const outreachStrategy = suggestedVariables.find(v => v.name === 'Outreach Strategy')?.value || '';
      const messaging = suggestedVariables.find(v => v.name === 'Messaging Focus')?.value || '';
      const content = suggestedVariables.find(v => v.name === 'Content Type')?.value || '';
      const contentStrategy = suggestedVariables.find(v => v.name === 'Content Strategy')?.value || '';
      const roiFocus = suggestedVariables.find(v => v.name === 'ROI Focus')?.value || '';
      const valueFocus = suggestedVariables.find(v => v.name === 'Value Focus')?.value || '';
      
      // Map outreach strategy to distribution channel
      const getDistributionChannel = (strategy: string) => {
        if (strategy.includes('LinkedIn')) return 'LinkedIn';
        if (strategy.includes('Email')) return 'Email';
        if (strategy.includes('Content') || strategy.includes('Webinar')) return 'Content Marketing';
        if (strategy.includes('Social')) return 'Social Media';
        if (strategy.includes('Paid')) return 'Google Ads';
        if (strategy.includes('Event')) return 'Events';
        return '';
      };

      setFormData(prev => ({
        ...prev,
        name: aiRecommendation.title,
        description: aiRecommendation.description,
        outreachStrategy: outreachStrategy,
        messaging: messaging || roiFocus || valueFocus,
        content: content || contentStrategy,
        distributionChannel: getDistributionChannel(outreachStrategy),
        variables: suggestedVariables,
        tags: ['ai-recommendation', aiRecommendation.type]
      }));
    }
  }, [aiRecommendation, isEditing, id, experiments]);

  // Handle idea data when creating experiment from idea
  useEffect(() => {
    if (selectedIdea && (mode === 'from-idea' || mode === 'from-idea-form')) {
      setFormData(prev => ({
        ...prev,
        name: selectedIdea.name || '',
        description: selectedIdea.description || '',
        outreachStrategy: selectedIdea.outreachStrategies?.[0] || '',
        distributionChannel: selectedIdea.distributionChannels?.[0] || '',
        content: selectedIdea.contentTypes?.[0] || '',
        messaging: selectedIdea.messagingFocus?.[0] || '',
        tags: selectedIdea.tags || [],
        customTargeting: {
          jobTitles: selectedIdea.targetRoles || [],
          industries: selectedIdea.industries || [],
          geographies: [],
          companySizes: selectedIdea.companySizes || [],
          companyRevenue: selectedIdea.companyRevenue || [],
          technologyStack: [],
          painPoints: selectedIdea.painPoints || [],
          buyingAuthority: 'decision-maker'
        }
      }));
    }
  }, [selectedIdea, mode]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that either an ICP profile is selected or custom targeting is filled out
    if (!formData.selectedIcpProfileId && (!formData.customTargeting || !formData.customTargeting.jobTitles.length || !formData.customTargeting.industries.length || !formData.customTargeting.companySizes.length)) {
      // Show error message in UI instead of alert
      return;
    }
    
    // Determine target audience based on ICP profile or custom targeting
    let finalTargetAudience = formData.targetAudience;
    if (formData.selectedIcpProfileId) {
      const selectedProfile = icpProfiles.find(profile => profile.id === formData.selectedIcpProfileId);
      if (selectedProfile) {
        const jobTitle = selectedProfile.jobTitles[0] || 'Decision Maker';
        const industry = selectedProfile.industries[0] || 'Various';
        const companySize = selectedProfile.companySizes[0] || 'Various';
        finalTargetAudience = `${jobTitle} at ${companySize} companies in ${industry}`;
      }
    } else if (formData.customTargeting) {
      const jobTitle = formData.customTargeting.jobTitles[0] || 'Decision Maker';
      const industry = formData.customTargeting.industries[0] || 'Various';
      const companySize = formData.customTargeting.companySizes[0] || 'Various';
      finalTargetAudience = `${jobTitle} at ${companySize} companies in ${industry}`;
    }
    
    const experimentData: Partial<Experiment> = {
      name: formData.name,
      description: formData.description,
      endDate: new Date(formData.endDate),
      blueprintId: formData.blueprintId,
      outreachStrategy: formData.outreachStrategy,
      messaging: formData.messaging,
      content: formData.content,
      distributionChannel: formData.distributionChannel,
      targetAudience: finalTargetAudience,
      variables: formData.variables,
      successCriteria: formData.successCriteria,
      tags: formData.tags
    };

    if (isEditing && id && onUpdateExperiment) {
      // Update existing experiment
      onUpdateExperiment(id, experimentData);
      navigate(`/experiments/${id}`);
    } else {
      // Create new experiment
      const newExperiment: Experiment = {
        id: `exp-${Date.now()}`,
        ...experimentData,
        status: 'active',
        createdAt: new Date(),
        startedAt: new Date(),
        integrationTracking: [],
        metrics: {
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
        }
      } as Experiment;

      onAddExperiment(newExperiment);
      navigate('/experiments');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addVariable = () => {
    if (newVariable.name.trim() && newVariable.value.trim()) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }]
      }));
      setNewVariable({ name: '', value: '', type: 'icp' });
    }
  };

  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const addSecondaryGoal = () => {
    if (newSecondaryGoal.trim() && !formData.successCriteria.secondaryGoals?.includes(newSecondaryGoal.trim())) {
      setFormData(prev => ({
        ...prev,
        successCriteria: {
          ...prev.successCriteria,
          secondaryGoals: [...(prev.successCriteria.secondaryGoals || []), newSecondaryGoal.trim()]
        }
      }));
      setNewSecondaryGoal('');
    }
  };

  const removeSecondaryGoal = (goalToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      successCriteria: {
        ...prev.successCriteria,
        secondaryGoals: prev.successCriteria.secondaryGoals?.filter(goal => goal !== goalToRemove) || []
      }
    }));
  };

  // Helper functions for custom targeting
  const addCustomTargetingItem = (field: keyof CustomTargeting, value: string, setter: (value: string) => void) => {
    if (value.trim() && formData.customTargeting && !(formData.customTargeting[field] as string[])?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        customTargeting: prev.customTargeting ? {
          ...prev.customTargeting,
          [field]: [...(prev.customTargeting[field] as string[] || []), value.trim()]
        } : null
      }));
      setter('');
    }
  };

  const removeCustomTargetingItem = (field: keyof CustomTargeting, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      customTargeting: prev.customTargeting ? {
        ...prev.customTargeting,
        [field]: (prev.customTargeting[field] as string[] || []).filter(item => item !== itemToRemove)
      } : null
    }));
  };



  const selectedBlueprint = blueprints.find(bp => bp.id === formData.blueprintId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/experiments')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Experiments
        </button>
        <div className="flex items-center">
          <BeakerIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Experiment' : 'Create New Experiment'}
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your experiment configuration' : 'Design a new marketing outreach strategy to test'}
        </p>
      </div>

      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-purple-900">
                AI Recommendation Applied
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                This experiment has been pre-populated with AI suggestions based on your recommendation: "{aiRecommendation.title}"
              </p>
              <div className="mt-2 text-xs text-purple-600">
                <strong>Confidence:</strong> {aiRecommendation.confidence}% • <strong>Expected Outcome:</strong> {aiRecommendation.expectedOutcome}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiment Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Technical Pain Point LinkedIn - Manufacturing COOs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blueprint *
              </label>
              <select
                required
                value={formData.blueprintId}
                onChange={(e) => setFormData(prev => ({ ...prev, blueprintId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a blueprint</option>
                {blueprints.map(blueprint => (
                  <option key={blueprint.id} value={blueprint.id}>
                    {blueprint.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your experiment strategy and goals..."
              />
            </div>
          </div>
        </div>

        {/* Blueprint Context */}
        {selectedBlueprint && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-md font-semibold text-blue-900 mb-2">Blueprint Context</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Industry:</span>
                <div className="font-medium text-blue-900">{selectedBlueprint.industry}</div>
              </div>
              <div>
                <span className="text-blue-700">Target Roles:</span>
                <div className="font-medium text-blue-900">{selectedBlueprint.targetRoles.join(', ')}</div>
              </div>
              <div>
                <span className="text-blue-700">Company Size:</span>
                <div className="font-medium text-blue-900">{selectedBlueprint.companySize}</div>
              </div>
              <div>
                <span className="text-blue-700">Automation:</span>
                <div className="font-medium text-blue-900">{selectedBlueprint.automation}</div>
              </div>
            </div>
          </div>
        )}

        {/* Outreach Strategy */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Outreach Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outreach Strategy *
              </label>
              <select
                required
                value={formData.outreachStrategy}
                onChange={(e) => setFormData(prev => ({ ...prev, outreachStrategy: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select strategy</option>
                {outreachStrategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Channel *
              </label>
              <select
                required
                value={formData.distributionChannel}
                onChange={(e) => setFormData(prev => ({ ...prev, distributionChannel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select channel</option>
                {distributionChannels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience *
              </label>
              
              {/* ICP Profile Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select ICP Profile
                  </label>
                  <select
                    value={formData.selectedIcpProfileId}
                    onChange={(e) => {
                      setFormData(prev => ({ 
                        ...prev, 
                        selectedIcpProfileId: e.target.value,
                        customTargeting: null 
                      }));
                      setShowCustomTargeting(false);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Choose an existing ICP profile</option>
                    {icpProfiles.map(profile => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name} - {profile.jobTitles[0] || 'Decision Maker'} at {profile.companySizes[0] || 'Various'} companies in {profile.industries[0] || 'Various'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Or create custom targeting */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomTargeting(!showCustomTargeting);
                      setFormData(prev => ({ 
                        ...prev, 
                        selectedIcpProfileId: '',
                        customTargeting: showCustomTargeting ? null : {
                          jobTitles: [],
                          industries: [],
                          geographies: [],
                          companySizes: [],
                          companyRevenue: [],
                          technologyStack: [],
                          painPoints: [],
                          buyingAuthority: 'decision-maker'
                        }
                      }));
                    }}
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <UserGroupIcon className="w-4 h-4 mr-2" />
                    {showCustomTargeting ? 'Hide Custom Targeting' : 'Create Custom Targeting'}
                  </button>
                </div>

                {/* Custom Targeting Form */}
                {showCustomTargeting && formData.customTargeting && (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-6">
                    <h4 className="text-lg font-medium text-gray-900">Custom Targeting Criteria</h4>
                    
                    {/* Job Titles */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2 text-primary-600" />
                        Job Titles
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={newJobTitle}
                            onChange={(e) => setNewJobTitle(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select from predefined options</option>
                            {predefinedJobTitles.map((item, index) => {
                              if (typeof item === 'string') {
                                return <option key={index} value={item}>{item}</option>;
                              } else if (item.type === 'header') {
                                return <optgroup key={index} label={item.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                              } else if (item.type === 'subheader') {
                                return <optgroup key={index} label={item.group} className="font-semibold text-gray-700 bg-gray-50"></optgroup>;
                              }
                              return null;
                            })}
                          </select>
                          <button
                            type="button"
                            onClick={() => addCustomTargetingItem('jobTitles', newJobTitle, setNewJobTitle)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.customTargeting.jobTitles?.map((title, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                            >
                              {title}
                              <button
                                type="button"
                                onClick={() => removeCustomTargetingItem('jobTitles', title)}
                                className="ml-2 text-primary-600 hover:text-primary-800"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Industries */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <BuildingOfficeIcon className="w-4 h-4 mr-2 text-primary-600" />
                        Industries
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={newIndustry}
                            onChange={(e) => setNewIndustry(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select from predefined options</option>
                            {predefinedIndustries.map(industry => (
                              <option key={industry} value={industry}>{industry}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => addCustomTargetingItem('industries', newIndustry, setNewIndustry)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.customTargeting.industries?.map((industry, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {industry}
                              <button
                                type="button"
                                onClick={() => removeCustomTargetingItem('industries', industry)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Geographies */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <GlobeAltIcon className="w-4 h-4 mr-2 text-primary-600" />
                        Geographies
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={newGeography}
                            onChange={(e) => setNewGeography(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select from predefined options</option>
                            {predefinedGeographies.map(geo => (
                              <option key={geo} value={geo}>{geo}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => addCustomTargetingItem('geographies', newGeography, setNewGeography)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.customTargeting.geographies?.map((geo, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                            >
                              {geo}
                              <button
                                type="button"
                                onClick={() => removeCustomTargetingItem('geographies', geo)}
                                className="ml-2 text-green-600 hover:text-green-800"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Company Size and Revenue */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3">Company Size</h5>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <select
                              value={newCompanySize}
                              onChange={(e) => setNewCompanySize(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select company size</option>
                              {predefinedCompanySizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => addCustomTargetingItem('companySizes', newCompanySize, setNewCompanySize)}
                              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.customTargeting.companySizes?.map((size, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                              >
                                {size}
                                <button
                                  type="button"
                                  onClick={() => removeCustomTargetingItem('companySizes', size)}
                                  className="ml-2 text-purple-600 hover:text-purple-800"
                                >
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-primary-600" />
                          Company Revenue
                        </h5>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <select
                              value={newCompanyRevenue}
                              onChange={(e) => setNewCompanyRevenue(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="">Select revenue range</option>
                              {predefinedCompanyRevenue.map(revenue => (
                                <option key={revenue} value={revenue}>{revenue}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => addCustomTargetingItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue)}
                              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {formData.customTargeting.companyRevenue?.map((revenue, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                              >
                                {revenue}
                                <button
                                  type="button"
                                  onClick={() => removeCustomTargetingItem('companyRevenue', revenue)}
                                  className="ml-2 text-yellow-600 hover:text-yellow-800"
                                >
                                  <XMarkIcon className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technology Stack */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <CogIcon className="w-4 h-4 mr-2 text-primary-600" />
                        Technology Stack
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={newTechnology}
                            onChange={(e) => setNewTechnology(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select technology</option>
                            {predefinedTechnologies.map(tech => (
                              <option key={tech} value={tech}>{tech}</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => addCustomTargetingItem('technologyStack', newTechnology, setNewTechnology)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.customTargeting.technologyStack?.map((tech, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                            >
                              {tech}
                              <button
                                type="button"
                                onClick={() => removeCustomTargetingItem('technologyStack', tech)}
                                className="ml-2 text-indigo-600 hover:text-indigo-800"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pain Points */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                        <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-primary-600" />
                        Pain Points
                      </h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <select
                            value={newPainPoint}
                            onChange={(e) => setNewPainPoint(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          >
                            <option value="">Select pain point</option>
                            {predefinedPainPoints.map(pain => {
                              if (typeof pain === 'string') {
                                return <option key={pain} value={pain}>{pain}</option>;
                              } else if (pain.type === 'header') {
                                return <optgroup key={pain.group} label={pain.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                              }
                              return null;
                            })}
                          </select>
                          <button
                            type="button"
                            onClick={() => addCustomTargetingItem('painPoints', newPainPoint, setNewPainPoint)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <PlusIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.customTargeting.painPoints?.map((pain, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                            >
                              {pain}
                              <button
                                type="button"
                                onClick={() => removeCustomTargetingItem('painPoints', pain)}
                                className="ml-2 text-red-600 hover:text-red-800"
                              >
                                <XMarkIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Buying Authority */}
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Buying Authority</h5>
                      <select
                        value={formData.customTargeting.buyingAuthority}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          customTargeting: prev.customTargeting ? {
                            ...prev.customTargeting,
                            buyingAuthority: e.target.value as any
                          } : null
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="decision-maker">Decision Maker</option>
                        <option value="influencer">Influencer</option>
                        <option value="end-user">End User</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Selected Profile Display */}
                {formData.selectedIcpProfileId && !showCustomTargeting && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Selected ICP Profile</h4>
                    {(() => {
                      const selectedProfile = icpProfiles.find(p => p.id === formData.selectedIcpProfileId);
                      return selectedProfile ? (
                        <div className="text-sm text-blue-800">
                          <div><strong>Name:</strong> {selectedProfile.name}</div>
                          <div><strong>Job Titles:</strong> {selectedProfile.jobTitles.join(', ')}</div>
                          <div><strong>Industries:</strong> {selectedProfile.industries.join(', ')}</div>
                          <div><strong>Company Sizes:</strong> {selectedProfile.companySizes.join(', ')}</div>
                          {selectedProfile.painPoints && selectedProfile.painPoints.length > 0 && (
                            <div><strong>Pain Points:</strong> {selectedProfile.painPoints.join(', ')}</div>
                          )}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaging Focus
              </label>
              <input
                type="text"
                value={formData.messaging}
                onChange={(e) => setFormData(prev => ({ ...prev, messaging: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Technical pain point messaging"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Description
              </label>
              <textarea
                rows={2}
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe the content or assets for this experiment..."
              />
            </div>
          </div>
        </div>

        {/* Success Criteria */}
        <div className="card">
          <div className="flex items-center mb-4">
            <FlagIcon className="w-5 h-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Success Criteria</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal *
                </label>
                <select
                  required
                  value={formData.successCriteria.primaryGoal}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    successCriteria: {
                      ...prev.successCriteria,
                      primaryGoal: e.target.value as any
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {primaryGoals.map(goal => (
                    <option key={goal.value} value={goal.value}>{goal.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Frame (Days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.successCriteria.timeFrame}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    successCriteria: {
                      ...prev.successCriteria,
                      timeFrame: parseInt(e.target.value)
                    }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Target Metrics */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">Target Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Meetings Booked</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.successCriteria.targetMetrics.meetingsBooked || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      successCriteria: {
                        ...prev.successCriteria,
                        targetMetrics: {
                          ...prev.successCriteria.targetMetrics,
                          meetingsBooked: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Leads Generated</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.successCriteria.targetMetrics.leadsGenerated || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      successCriteria: {
                        ...prev.successCriteria,
                        targetMetrics: {
                          ...prev.successCriteria.targetMetrics,
                          leadsGenerated: parseInt(e.target.value) || 0
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Response Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.successCriteria.targetMetrics.responseRate || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      successCriteria: {
                        ...prev.successCriteria,
                        targetMetrics: {
                          ...prev.successCriteria.targetMetrics,
                          responseRate: parseFloat(e.target.value) || 0
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Target ROI</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.successCriteria.targetMetrics.roi || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      successCriteria: {
                        ...prev.successCriteria,
                        targetMetrics: {
                          ...prev.successCriteria.targetMetrics,
                          roi: parseFloat(e.target.value) || 0
                        }
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Success Threshold */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Threshold (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                value={formData.successCriteria.successThreshold}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  successCriteria: {
                    ...prev.successCriteria,
                    successThreshold: parseInt(e.target.value)
                  }
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., 80 means 80% of target = success"
              />
            </div>

            {/* Secondary Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Goals
              </label>
              <div className="space-y-2">
                {formData.successCriteria.secondaryGoals?.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="flex-1 text-sm text-gray-600">{goal}</span>
                    <button
                      type="button"
                      onClick={() => removeSecondaryGoal(goal)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add secondary goal"
                    value={newSecondaryGoal}
                    onChange={(e) => setNewSecondaryGoal(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSecondaryGoal())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addSecondaryGoal}
                    className="btn-secondary"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Experiment Variables */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiment Variables</h2>
          <div className="space-y-4">
            {formData.variables.map((variable, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{variable.name}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{variable.value}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">{variable.type}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariable(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Variable name"
                value={newVariable.name}
                onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="Value"
                value={newVariable.value}
                onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <select
                value={newVariable.type}
                onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {variableTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addVariable}
                className="btn-secondary flex items-center justify-center"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Variable
              </button>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/experiments')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Create Experiment
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExperiment; 