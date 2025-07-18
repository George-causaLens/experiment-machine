import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
  LightBulbIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Idea } from '../types';
import { DataService } from '../services/dataService';

interface EditIdeaProps {
  onUpdateIdea: (id: string, updates: Partial<Idea>) => void;
}

const EditIdea: React.FC<EditIdeaProps> = ({ onUpdateIdea }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submissionIdRef = useRef<string | null>(null);

  const [formData, setFormData] = useState<Partial<Idea>>({
    name: '',
    description: '',
    urls: [{ title: '', url: '' }],
    targetRoles: [],
    industries: [],
    companySizes: [],
    companyRevenue: [],
    painPoints: [],
    distributionChannels: [],
    outreachStrategies: [],
    contentTypes: [],
    messagingFocus: [],
    priority: 'medium',
    effort: 'medium',
    impact: 'medium',
    tags: []
  });

  const [newTargetRole, setNewTargetRole] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('');
  const [newCompanyRevenue, setNewCompanyRevenue] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newDistributionChannel, setNewDistributionChannel] = useState('');
  const [newOutreachStrategy, setNewOutreachStrategy] = useState('');
  const [newContentType, setNewContentType] = useState('');
  const [newMessagingFocus, setNewMessagingFocus] = useState('');

  // Predefined options (same as CreateIdea)
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

  const predefinedCompanySizes = [
    '1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees',
    '501-1000 employees', '1001-5000 employees', '5001-10000 employees', '10000+ employees'
  ];

  const predefinedCompanyRevenue = [
    'Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', '$100M - $500M',
    '$500M - $1B', '$1B - $5B', '$5B - $10B', '$10B+'
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
    'Clinical trial delays',
    'Regulatory compliance',
    'Drug development costs',
    'Market access complexity',
    'Field force optimization',
    'Medical affairs coordination',
    'Patient recruitment challenges',
    'Real-world evidence gaps',
    'Pricing strategy complexity',
    'Market launch timing',
    { group: 'Financial Services Pain Points', type: 'header' },
    'Regulatory reporting',
    'Risk assessment delays',
    'Fraud detection gaps',
    'Customer onboarding friction',
    'Credit decision latency',
    'Compliance monitoring',
    'Portfolio optimization',
    'Claims processing delays',
    'Customer churn prediction',
    'Market volatility impact',
    { group: 'Manufacturing / Industrials Pain Points', type: 'header' },
    'Supply chain disruptions',
    'Quality control issues',
    'Production planning inefficiency',
    'Equipment downtime',
    'Inventory optimization',
    'Demand forecasting accuracy',
    'Supplier performance tracking',
    'Maintenance scheduling',
    'Cost optimization',
    'Sustainability compliance'
  ];

  const predefinedDistributionChannels = [
    'LinkedIn', 'Email', 'Cold calling', 'Content marketing', 'SEO/SEM',
    'Social media', 'Webinars', 'Events/Conferences', 'Direct mail',
    'Referral programs', 'Partnerships', 'Trade shows', 'Podcasts',
    'Video marketing', 'Influencer marketing', 'PR/Media'
  ];

  const predefinedOutreachStrategies = [
    'Cold email sequences', 'LinkedIn direct messages', 'Content-based outreach',
    'Referral-based outreach', 'Event-based outreach', 'Social proof outreach',
    'Personalized video messages', 'Multi-channel campaigns', 'Account-based marketing',
    'Influencer partnerships', 'Thought leadership content', 'Case study sharing',
    'Webinar invitations', 'Free consultation offers', 'Industry report sharing'
  ];

  const predefinedContentTypes = [
    'Case studies', 'White papers', 'Blog posts', 'Infographics', 'Videos',
    'Webinars', 'Podcasts', 'E-books', 'Industry reports', 'Templates',
    'Checklists', 'Guides', 'Tutorials', 'Demo videos', 'Testimonials',
    'ROI calculators', 'Comparison charts', 'Best practices guides'
  ];

  const predefinedMessagingFocus = [
    'ROI and cost savings', 'Time efficiency', 'Competitive advantage',
    'Risk reduction', 'Compliance benefits', 'Scalability', 'Innovation',
    'Customer satisfaction', 'Employee productivity', 'Revenue growth',
    'Process improvement', 'Data-driven decisions', 'Automation benefits',
    'Quality improvement', 'Sustainability', 'Digital transformation'
  ];

  useEffect(() => {
    if (id) {
      loadIdea();
    }
  }, [id]);

  const loadIdea = async () => {
    try {
      setLoading(true);
      const ideas = await DataService.getIdeas();
      const foundIdea = ideas.find(i => i.id === id);
      
      if (foundIdea) {
        setFormData({
          name: foundIdea.name,
          description: foundIdea.description || '',
          urls: foundIdea.urls && foundIdea.urls.length > 0 ? foundIdea.urls : [{ title: '', url: '' }],
          targetRoles: foundIdea.targetRoles || [],
          industries: foundIdea.industries || [],
          companySizes: foundIdea.companySizes || [],
          companyRevenue: foundIdea.companyRevenue || [],
          painPoints: foundIdea.painPoints || [],
          distributionChannels: foundIdea.distributionChannels || [],
          outreachStrategies: foundIdea.outreachStrategies || [],
          contentTypes: foundIdea.contentTypes || [],
          messagingFocus: foundIdea.messagingFocus || [],
          priority: foundIdea.priority,
          effort: foundIdea.effort,
          impact: foundIdea.impact,
          tags: foundIdea.tags || []
        });
      } else {
        navigate('/ideas');
      }
    } catch (error) {
      console.error('Error loading idea:', error);
      navigate('/ideas');
    } finally {
      setLoading(false);
    }
  };

  const addItem = (field: keyof typeof formData, value: string, setter: (value: string) => void) => {
    if (value.trim() && !(formData[field] as string[])?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof typeof formData, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[])?.filter(item => item !== itemToRemove) || []
    }));
  };

  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...(prev.urls || []), { title: '', url: '' }]
    }));
  };

  const removeUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      urls: (prev.urls || []).filter((_, i) => i !== index)
    }));
  };

  const updateUrl = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: (prev.urls || []).map((url, i) => 
        i === index ? { ...url, [field]: value } : url
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !formData.name?.trim()) {
      alert('Please fill in the idea name');
      return;
    }

    // Prevent duplicate submissions
    if (isSubmittingRef.current) {
      console.log('Submission already in progress, ignoring duplicate submit');
      return;
    }

    const submissionId = Math.random().toString(36).substring(7);
    submissionIdRef.current = submissionId;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    // Disable form immediately
    if (formRef.current) {
      formRef.current.style.pointerEvents = 'none';
    }

    try {
      // Filter out empty URLs
      const filteredUrls = (formData.urls || []).filter(url => url.title.trim() || url.url.trim());
      
      const ideaData: Partial<Idea> = {
        name: formData.name!.trim(),
        description: formData.description?.trim() || undefined,
        urls: filteredUrls.length > 0 ? filteredUrls : undefined,
        targetRoles: formData.targetRoles || [],
        industries: formData.industries || [],
        companySizes: formData.companySizes || [],
        companyRevenue: formData.companyRevenue || [],
        painPoints: formData.painPoints || [],
        distributionChannels: formData.distributionChannels || [],
        outreachStrategies: formData.outreachStrategies || [],
        contentTypes: formData.contentTypes || [],
        messagingFocus: formData.messagingFocus || [],
        priority: formData.priority!,
        effort: formData.effort!,
        impact: formData.impact!,
        tags: formData.tags || []
      };

      console.log('Submitting idea update:', { submissionId, ideaData });

      const success = await DataService.updateIdea(id, ideaData);
      
      if (success && submissionIdRef.current === submissionId) {
        console.log('Idea updated successfully:', submissionId);
        onUpdateIdea(id, ideaData);
        navigate('/ideas');
      } else if (submissionIdRef.current !== submissionId) {
        console.log('Submission ID mismatch, ignoring result:', submissionId);
      } else {
        console.error('Failed to update idea');
        alert('Failed to update idea. Please try again.');
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      if (submissionIdRef.current === submissionId) {
        alert('An error occurred while updating the idea.');
      }
    } finally {
      if (submissionIdRef.current === submissionId) {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
        
        // Re-enable form
        if (formRef.current) {
          formRef.current.style.pointerEvents = 'auto';
        }
      }
    }
  };

  const handleCreateExperiment = () => {
    navigate('/experiments/create', {
      state: {
        selectedIdea: formData,
        mode: 'from-idea-form'
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading idea...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/ideas')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Ideas Hub
        </button>
        <div className="flex items-center">
          <LightBulbIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Idea</h1>
        </div>
        <p className="text-gray-600 mt-2">
          Update your experiment idea with all the details needed to turn it into reality
        </p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idea Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., LinkedIn DM campaign for Manufacturing COOs"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your experiment idea, inspiration, and any relevant context..."
              />
            </div>
          </div>
        </div>

        {/* URLs/Links */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <LinkIcon className="w-5 h-5 mr-2 text-primary-600" />
            Inspiration Links
          </h2>
          <div className="space-y-4">
            {(formData.urls || []).map((url, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Link title (optional)"
                  value={url.title}
                  onChange={(e) => updateUrl(index, 'title', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <input
                  type="url"
                  placeholder="URL"
                  value={url.url}
                  onChange={(e) => updateUrl(index, 'url', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addUrl}
              className="btn-secondary flex items-center"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Link
            </button>
          </div>
        </div>

        {/* Priority, Effort, Impact */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Assessment</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Effort</label>
              <select
                value={formData.effort}
                onChange={(e) => setFormData(prev => ({ ...prev, effort: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Impact</label>
              <select
                value={formData.impact}
                onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Target Roles */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Roles</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value)}
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
                onClick={() => addItem('targetRoles', newTargetRole, setNewTargetRole)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.targetRoles || []).map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeItem('targetRoles', role)}
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
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Industries</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedIndustries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('industries', newIndustry, setNewIndustry)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.industries || []).map((industry, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeItem('industries', industry)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Company Sizes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Sizes</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newCompanySize}
                onChange={(e) => setNewCompanySize(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedCompanySizes.map((size, index) => (
                  <option key={index} value={size}>{size}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('companySizes', newCompanySize, setNewCompanySize)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.companySizes || []).map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeItem('companySizes', size)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Company Revenue */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Revenue</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newCompanyRevenue}
                onChange={(e) => setNewCompanyRevenue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedCompanyRevenue.map((revenue, index) => (
                  <option key={index} value={revenue}>{revenue}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.companyRevenue || []).map((revenue, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {revenue}
                  <button
                    type="button"
                    onClick={() => removeItem('companyRevenue', revenue)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pain Points</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedPainPoints.map((item, index) => {
                  if (typeof item === 'string') {
                    return <option key={index} value={item}>{item}</option>;
                  } else if (item.type === 'header') {
                    return <optgroup key={index} label={item.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                  }
                  return null;
                })}
              </select>
              <button
                type="button"
                onClick={() => addItem('painPoints', newPainPoint, setNewPainPoint)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.painPoints || []).map((pain, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {pain}
                  <button
                    type="button"
                    onClick={() => removeItem('painPoints', pain)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution Channels */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribution Channels</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newDistributionChannel}
                onChange={(e) => setNewDistributionChannel(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedDistributionChannels.map((channel, index) => (
                  <option key={index} value={channel}>{channel}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('distributionChannels', newDistributionChannel, setNewDistributionChannel)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.distributionChannels || []).map((channel, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {channel}
                  <button
                    type="button"
                    onClick={() => removeItem('distributionChannels', channel)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Outreach Strategies */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Outreach Strategies</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newOutreachStrategy}
                onChange={(e) => setNewOutreachStrategy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedOutreachStrategies.map((strategy, index) => (
                  <option key={index} value={strategy}>{strategy}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('outreachStrategies', newOutreachStrategy, setNewOutreachStrategy)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.outreachStrategies || []).map((strategy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {strategy}
                  <button
                    type="button"
                    onClick={() => removeItem('outreachStrategies', strategy)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Types */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Types</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newContentType}
                onChange={(e) => setNewContentType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedContentTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('contentTypes', newContentType, setNewContentType)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.contentTypes || []).map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeItem('contentTypes', type)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Messaging Focus */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Messaging Focus</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newMessagingFocus}
                onChange={(e) => setNewMessagingFocus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedMessagingFocus.map((focus, index) => (
                  <option key={index} value={focus}>{focus}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('messagingFocus', newMessagingFocus, setNewMessagingFocus)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.messagingFocus || []).map((focus, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {focus}
                  <button
                    type="button"
                    onClick={() => removeItem('messagingFocus', focus)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate('/ideas')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleCreateExperiment}
              className="btn-secondary flex items-center"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Create Experiment
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditIdea; 