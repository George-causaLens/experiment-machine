import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  LightBulbIcon,
  PlusIcon,
  XMarkIcon,
  LinkIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Idea } from '../types';
import { DataService } from '../services/dataService';

interface CreateIdeaProps {
  onAddIdea: (idea: Idea) => void;
}

const CreateIdea: React.FC<CreateIdeaProps> = ({ onAddIdea }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    urls: [{ title: '', url: '' }] as Array<{ title: string; url: string }>,
    targetRoles: [] as string[],
    industries: [] as string[],
    companySizes: [] as string[],
    companyRevenue: [] as string[],
    painPoints: [] as string[],
    distributionChannels: [] as string[],
    outreachStrategies: [] as string[],
    contentTypes: [] as string[],
    messagingFocus: [] as string[],
    priority: 'medium' as 'high' | 'medium' | 'low',
    effort: 'medium' as 'high' | 'medium' | 'low',
    impact: 'medium' as 'high' | 'medium' | 'low',
    tags: [] as string[]
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

  // Predefined options (same as CreateExperiment)
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

  const predefinedDistributionChannels = [
    'LinkedIn', 'Email', 'Content Marketing', 'Paid Advertising', 'Webinars',
    'Direct Mail', 'Cold Calling', 'Referrals', 'Partnerships', 'Events',
    'Social Media', 'SEO', 'Trade Shows', 'Podcasts', 'Video Marketing'
  ];

  const predefinedOutreachStrategies = [
    'Direct Message', 'Email Sequence', 'Content Marketing', 'Paid Advertising',
    'Webinar', 'Direct Mail', 'Cold Call', 'Referral Program', 'Partnership',
    'Event Marketing', 'Social Media', 'SEO', 'Trade Show', 'Podcast',
    'Video Marketing', 'Influencer Marketing', 'Account-Based Marketing'
  ];

  const predefinedContentTypes = [
    'Blog Post', 'White Paper', 'Case Study', 'Video', 'Webinar',
    'Infographic', 'Podcast', 'Social Media Post', 'Email Newsletter',
    'E-book', 'Research Report', 'Demo Video', 'Testimonial', 'FAQ'
  ];

  const predefinedMessagingFocus = [
    'Problem-Solution', 'Value Proposition', 'Social Proof', 'Urgency',
    'Educational', 'Storytelling', 'Data-Driven', 'Emotional Appeal',
    'Exclusive Offer', 'Free Trial', 'Demo Request', 'Consultation'
  ];

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
      [field]: (prev[field] as string[] || []).filter(item => item !== itemToRemove)
    }));
  };

  const addUrl = () => {
    setFormData(prev => ({
      ...prev,
      urls: [...prev.urls, { title: '', url: '' }]
    }));
  };

  const removeUrl = (index: number) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
  };

  const updateUrl = (index: number, field: 'title' | 'url', value: string) => {
    setFormData(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => 
        i === index ? { ...url, [field]: value } : url
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter an idea name');
      return;
    }

    // Filter out empty URLs
    const filteredUrls = formData.urls.filter(url => url.url.trim());

    const ideaData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      urls: filteredUrls,
      targetRoles: formData.targetRoles,
      industries: formData.industries,
      companySizes: formData.companySizes,
      companyRevenue: formData.companyRevenue,
      painPoints: formData.painPoints,
      distributionChannels: formData.distributionChannels,
      outreachStrategies: formData.outreachStrategies,
      contentTypes: formData.contentTypes,
      messagingFocus: formData.messagingFocus,
      priority: formData.priority,
      effort: formData.effort,
      impact: formData.impact,
      tags: formData.tags
    };

    const newIdea = await DataService.createIdea(ideaData);
    if (newIdea) {
      onAddIdea(newIdea);
      navigate('/ideas');
    }
  };

  const handleCreateExperiment = () => {
    // Navigate to create experiment with idea data pre-filled
    navigate('/experiments/create', {
      state: {
        selectedIdea: formData,
        mode: 'from-idea-form'
      }
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Add New Idea</h1>
        </div>
        <p className="text-gray-600 mt-2">
          Capture your experiment idea with all the details needed to turn it into reality
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
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
            {formData.urls.map((url, index) => (
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
              {formData.targetRoles.map((role, index) => (
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
                {predefinedIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
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
              {formData.industries.map((industry, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeItem('industries', industry)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
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
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Size</h2>
            <div className="space-y-4">
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
                  onClick={() => addItem('companySizes', newCompanySize, setNewCompanySize)}
                  className="btn-secondary"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.companySizes.map((size, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {size}
                    <button
                      type="button"
                      onClick={() => removeItem('companySizes', size)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Revenue</h2>
            <div className="space-y-4">
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
                  onClick={() => addItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue)}
                  className="btn-secondary"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.companyRevenue.map((revenue, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                  >
                    {revenue}
                    <button
                      type="button"
                      onClick={() => removeItem('companyRevenue', revenue)}
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
                <option value="">Select pain point</option>
                {predefinedPainPoints.map(pain => {
                  if (typeof pain === 'string') {
                    return <option key={pain} value={pain}>{pain}</option>;
                  } else if (pain.type === 'header') {
                    return <optgroup key={pain.group} label={pain.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                  } else if (pain.type === 'subheader') {
                    return <optgroup key={pain.group} label={pain.group} className="font-semibold text-gray-700 bg-gray-50"></optgroup>;
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
              {formData.painPoints.map((pain, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {pain}
                  <button
                    type="button"
                    onClick={() => removeItem('painPoints', pain)}
                    className="ml-2 text-red-600 hover:text-red-800"
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
                <option value="">Select distribution channel</option>
                {predefinedDistributionChannels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
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
              {formData.distributionChannels.map((channel, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {channel}
                  <button
                    type="button"
                    onClick={() => removeItem('distributionChannels', channel)}
                    className="ml-2 text-green-600 hover:text-green-800"
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
                <option value="">Select outreach strategy</option>
                {predefinedOutreachStrategies.map(strategy => (
                  <option key={strategy} value={strategy}>{strategy}</option>
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
              {formData.outreachStrategies.map((strategy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {strategy}
                  <button
                    type="button"
                    onClick={() => removeItem('outreachStrategies', strategy)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
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
                <option value="">Select content type</option>
                {predefinedContentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
              {formData.contentTypes.map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeItem('contentTypes', type)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
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
                <option value="">Select messaging focus</option>
                {predefinedMessagingFocus.map(focus => (
                  <option key={focus} value={focus}>{focus}</option>
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
              {formData.messagingFocus.map((focus, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                >
                  {focus}
                  <button
                    type="button"
                    onClick={() => removeItem('messagingFocus', focus)}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/ideas')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreateExperiment}
            className="btn-primary"
          >
            Create Experiment
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Idea
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateIdea; 