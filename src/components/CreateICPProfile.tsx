import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  UserGroupIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  CogIcon,
  ExclamationTriangleIcon,
  TagIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { ICPProfile } from '../types';

interface CreateICPProfileProps {
  icpProfiles: ICPProfile[];
  onAddICPProfile: (profile: ICPProfile) => void;
  onUpdateICPProfile: (id: string, updates: Partial<ICPProfile>) => void;
}

const CreateICPProfile: React.FC<CreateICPProfileProps> = ({ 
  icpProfiles, 
  onAddICPProfile, 
  onUpdateICPProfile 
}) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const existingProfile = isEditing ? icpProfiles.find(p => p.id === id) : null;

  const [formData, setFormData] = useState<Partial<ICPProfile>>({
    name: '',
    description: '',
    jobTitles: [],
    industries: [],
    geographies: [],
    companySizes: [],
    companyRevenue: [],
    technologyStack: [],
    painPoints: [],
    buyingAuthority: 'decision-maker',
    tags: []
  });

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newGeography, setNewGeography] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('');
  const [newCompanyRevenue, setNewCompanyRevenue] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newTag, setNewTag] = useState('');

  // Predefined options for dropdowns
  const predefinedJobTitles = [
    'CEO', 'CTO', 'CFO', 'COO', 'VP Engineering', 'VP Sales', 'VP Marketing', 'VP Operations',
    'Director of Engineering', 'Director of Sales', 'Director of Marketing', 'Director of Operations',
    'Head of Product', 'Head of Technology', 'Head of Growth', 'Head of Revenue',
    'Engineering Manager', 'Sales Manager', 'Marketing Manager', 'Product Manager',
    'Senior Developer', 'Senior Sales Executive', 'Senior Marketing Specialist'
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
    'Lead generation', 'Customer acquisition cost', 'Sales cycle length', 'Conversion rates',
    'Customer retention', 'Revenue growth', 'Operational efficiency', 'Data management',
    'Process automation', 'Team productivity', 'Cost reduction', 'Market expansion',
    'Competitive pressure', 'Technology integration', 'Compliance requirements',
    'Scaling challenges', 'Customer satisfaction', 'Employee retention'
  ];

  useEffect(() => {
    if (existingProfile) {
      setFormData(existingProfile);
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      // Show error message in UI instead of alert
      return;
    }

    const profileData: ICPProfile = {
      id: isEditing ? id! : `icp-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      jobTitles: formData.jobTitles || [],
      industries: formData.industries || [],
      geographies: formData.geographies || [],
      companySizes: formData.companySizes || [],
      companyRevenue: formData.companyRevenue || [],
      technologyStack: formData.technologyStack || [],
      painPoints: formData.painPoints || [],
      buyingAuthority: formData.buyingAuthority || 'decision-maker',
      tags: formData.tags || [],
      createdAt: existingProfile?.createdAt || new Date(),
      lastUsed: new Date(),
      usageCount: existingProfile?.usageCount || 0,
      relatedExperiments: existingProfile?.relatedExperiments || []
    };

    if (isEditing) {
      onUpdateICPProfile(id!, profileData);
    } else {
      onAddICPProfile(profileData);
    }
    
    navigate('/icp-profiles');
  };

  const addItem = (field: keyof ICPProfile, value: string, setter: (value: string) => void) => {
    if (value.trim() && !(formData[field] as string[])?.includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[] || []), value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof ICPProfile, itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter(item => item !== itemToRemove)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/icp-profiles')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to ICP Profiles
        </button>
        <div className="flex items-center">
          <UserGroupIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit ICP Profile' : 'Create New ICP Profile'}
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your ideal customer profile' : 'Define your ideal customer profile for targeted experiments'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Manufacturing COOs - Large Companies"
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
                placeholder="Describe this ideal customer profile..."
              />
            </div>
          </div>
        </div>

        {/* Job Titles */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
            Job Titles
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedJobTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('jobTitles', newJobTitle, setNewJobTitle)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.jobTitles?.map((title, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {title}
                  <button
                    type="button"
                    onClick={() => removeItem('jobTitles', title)}
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
            Industries
          </h2>
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
              {formData.industries?.map((industry, index) => (
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

        {/* Geographies */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GlobeAltIcon className="w-5 h-5 mr-2 text-primary-600" />
            Geographies
          </h2>
          <div className="space-y-4">
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
                onClick={() => addItem('geographies', newGeography, setNewGeography)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.geographies?.map((geo, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {geo}
                  <button
                    type="button"
                    onClick={() => removeItem('geographies', geo)}
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
                {formData.companySizes?.map((size, index) => (
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
              Company Revenue
            </h2>
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
                {formData.companyRevenue?.map((revenue, index) => (
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

        {/* Technology Stack */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CogIcon className="w-5 h-5 mr-2 text-primary-600" />
            Technology Stack
          </h2>
          <div className="space-y-4">
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
                onClick={() => addItem('technologyStack', newTechnology, setNewTechnology)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologyStack?.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeItem('technologyStack', tech)}
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
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-primary-600" />
            Pain Points
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select pain point</option>
                {predefinedPainPoints.map(pain => (
                  <option key={pain} value={pain}>{pain}</option>
                ))}
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
              {formData.painPoints?.map((pain, index) => (
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

        {/* Buying Authority */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Buying Authority</h2>
          <div>
            <select
              value={formData.buyingAuthority}
              onChange={(e) => setFormData(prev => ({ ...prev, buyingAuthority: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="decision-maker">Decision Maker</option>
              <option value="influencer">Influencer</option>
              <option value="end-user">End User</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TagIcon className="w-5 h-5 mr-2 text-primary-600" />
            Tags
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('tags', newTag, setNewTag);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => addItem('tags', newTag, setNewTag)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeItem('tags', tag)}
                    className="ml-2 text-gray-600 hover:text-gray-800"
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
            onClick={() => navigate('/icp-profiles')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            {isEditing ? 'Update ICP Profile' : 'Create ICP Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateICPProfile; 