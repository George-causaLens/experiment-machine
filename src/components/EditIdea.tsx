import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  LinkIcon
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
  const [saving, setSaving] = useState(false);
  const [idea, setIdea] = useState<Idea | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [urls, setUrls] = useState<Array<{ title: string; url: string }>>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);
  const [companyRevenue, setCompanyRevenue] = useState<string[]>([]);
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [distributionChannels, setDistributionChannels] = useState<string[]>([]);
  const [outreachStrategies, setOutreachStrategies] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [messagingFocus, setMessagingFocus] = useState<string[]>([]);
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [effort, setEffort] = useState<'high' | 'medium' | 'low'>('medium');
  const [impact, setImpact] = useState<'high' | 'medium' | 'low'>('medium');
  const [tags, setTags] = useState<string[]>([]);

  // Input states for adding new items
  const [newTargetRole, setNewTargetRole] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('');
  const [newCompanyRevenue, setNewCompanyRevenue] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');
  const [newDistributionChannel, setNewDistributionChannel] = useState('');
  const [newOutreachStrategy, setNewOutreachStrategy] = useState('');
  const [newContentType, setNewContentType] = useState('');
  const [newMessagingFocus, setNewMessagingFocus] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newUrlTitle, setNewUrlTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

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
        setIdea(foundIdea);
        setName(foundIdea.name);
        setDescription(foundIdea.description || '');
        setUrls(foundIdea.urls || []);
        setTargetRoles(foundIdea.targetRoles || []);
        setIndustries(foundIdea.industries || []);
        setCompanySizes(foundIdea.companySizes || []);
        setCompanyRevenue(foundIdea.companyRevenue || []);
        setPainPoints(foundIdea.painPoints || []);
        setDistributionChannels(foundIdea.distributionChannels || []);
        setOutreachStrategies(foundIdea.outreachStrategies || []);
        setContentTypes(foundIdea.contentTypes || []);
        setMessagingFocus(foundIdea.messagingFocus || []);
        setPriority(foundIdea.priority);
        setEffort(foundIdea.effort);
        setImpact(foundIdea.impact);
        setTags(foundIdea.tags || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idea || !name.trim()) {
      alert('Please fill in the idea name');
      return;
    }

    setSaving(true);

    try {
      const updatedIdea: Partial<Idea> = {
        name: name.trim(),
        description: description.trim() || undefined,
        urls,
        targetRoles,
        industries,
        companySizes,
        companyRevenue,
        painPoints,
        distributionChannels,
        outreachStrategies,
        contentTypes,
        messagingFocus,
        priority,
        effort,
        impact,
        tags
      };

      const success = await DataService.updateIdea(idea.id, updatedIdea);
      
      if (success) {
        onUpdateIdea(idea.id, updatedIdea);
        navigate('/ideas');
      } else {
        alert('Failed to update idea. Please try again.');
      }
    } catch (error) {
      console.error('Error updating idea:', error);
      alert('An error occurred while updating the idea.');
    } finally {
      setSaving(false);
    }
  };

  const addItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      switch (field) {
        case 'targetRole':
          if (!targetRoles.includes(value.trim())) {
            setTargetRoles([...targetRoles, value.trim()]);
          }
          break;
        case 'industry':
          if (!industries.includes(value.trim())) {
            setIndustries([...industries, value.trim()]);
          }
          break;
        case 'companySize':
          if (!companySizes.includes(value.trim())) {
            setCompanySizes([...companySizes, value.trim()]);
          }
          break;
        case 'companyRevenue':
          if (!companyRevenue.includes(value.trim())) {
            setCompanyRevenue([...companyRevenue, value.trim()]);
          }
          break;
        case 'painPoint':
          if (!painPoints.includes(value.trim())) {
            setPainPoints([...painPoints, value.trim()]);
          }
          break;
        case 'distributionChannel':
          if (!distributionChannels.includes(value.trim())) {
            setDistributionChannels([...distributionChannels, value.trim()]);
          }
          break;
        case 'outreachStrategy':
          if (!outreachStrategies.includes(value.trim())) {
            setOutreachStrategies([...outreachStrategies, value.trim()]);
          }
          break;
        case 'contentType':
          if (!contentTypes.includes(value.trim())) {
            setContentTypes([...contentTypes, value.trim()]);
          }
          break;
        case 'messagingFocus':
          if (!messagingFocus.includes(value.trim())) {
            setMessagingFocus([...messagingFocus, value.trim()]);
          }
          break;
        case 'tag':
          if (!tags.includes(value.trim())) {
            setTags([...tags, value.trim()]);
          }
          break;
      }
      setter('');
    }
  };

  const removeItem = (field: string, itemToRemove: string) => {
    switch (field) {
      case 'targetRole':
        setTargetRoles(targetRoles.filter(item => item !== itemToRemove));
        break;
      case 'industry':
        setIndustries(industries.filter(item => item !== itemToRemove));
        break;
      case 'companySize':
        setCompanySizes(companySizes.filter(item => item !== itemToRemove));
        break;
      case 'companyRevenue':
        setCompanyRevenue(companyRevenue.filter(item => item !== itemToRemove));
        break;
      case 'painPoint':
        setPainPoints(painPoints.filter(item => item !== itemToRemove));
        break;
      case 'distributionChannel':
        setDistributionChannels(distributionChannels.filter(item => item !== itemToRemove));
        break;
      case 'outreachStrategy':
        setOutreachStrategies(outreachStrategies.filter(item => item !== itemToRemove));
        break;
      case 'contentType':
        setContentTypes(contentTypes.filter(item => item !== itemToRemove));
        break;
      case 'messagingFocus':
        setMessagingFocus(messagingFocus.filter(item => item !== itemToRemove));
        break;
      case 'tag':
        setTags(tags.filter(item => item !== itemToRemove));
        break;
    }
  };

  const addUrl = () => {
    if (newUrl.trim() && newUrlTitle.trim()) {
      setUrls([...urls, { title: newUrlTitle.trim(), url: newUrl.trim() }]);
      setNewUrlTitle('');
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading idea...</div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Idea not found</h3>
        <button 
          onClick={() => navigate('/ideas')}
          className="btn-primary"
        >
          Back to Ideas
        </button>
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
          <LinkIcon className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Idea</h1>
            <p className="text-gray-600 mt-1">Update your experiment idea</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idea Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter idea name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe your idea..."
              />
            </div>

            {/* URLs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Related URLs
              </label>
              <div className="space-y-2">
                {urls.map((url, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={url.title}
                      onChange={(e) => {
                        const newUrls = [...urls];
                        newUrls[index].title = e.target.value;
                        setUrls(newUrls);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Title"
                    />
                    <input
                      type="url"
                      value={url.url}
                      onChange={(e) => {
                        const newUrls = [...urls];
                        newUrls[index].url = e.target.value;
                        setUrls(newUrls);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="URL"
                    />
                    <button
                      type="button"
                      onClick={() => removeUrl(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newUrlTitle}
                    onChange={(e) => setNewUrlTitle(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Title"
                  />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="URL"
                  />
                  <button
                    type="button"
                    onClick={addUrl}
                    className="p-2 text-primary-600 hover:text-primary-800"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Criteria */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Target Criteria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Target Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Roles
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTargetRole}
                    onChange={(e) => setNewTargetRole(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('targetRole', newTargetRole, setNewTargetRole))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Marketing Manager"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('targetRole', newTargetRole, setNewTargetRole)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {targetRoles.map((role, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => removeItem('targetRole', role)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industries
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('industry', newIndustry, setNewIndustry))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., SaaS"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('industry', newIndustry, setNewIndustry)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {industry}
                      <button
                        type="button"
                        onClick={() => removeItem('industry', industry)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Sizes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Sizes
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCompanySize}
                    onChange={(e) => setNewCompanySize(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('companySize', newCompanySize, setNewCompanySize))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 50-200 employees"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('companySize', newCompanySize, setNewCompanySize)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companySizes.map((size, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeItem('companySize', size)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Company Revenue */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Revenue
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCompanyRevenue}
                    onChange={(e) => setNewCompanyRevenue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., $1M-$10M"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {companyRevenue.map((revenue, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {revenue}
                      <button
                        type="button"
                        onClick={() => removeItem('companyRevenue', revenue)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Points
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newPainPoint}
                    onChange={(e) => setNewPainPoint(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('painPoint', newPainPoint, setNewPainPoint))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Lead generation"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('painPoint', newPainPoint, setNewPainPoint)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {painPoints.map((pain, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {pain}
                      <button
                        type="button"
                        onClick={() => removeItem('painPoint', pain)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy & Approach */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategy & Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Distribution Channels */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distribution Channels
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newDistributionChannel}
                    onChange={(e) => setNewDistributionChannel(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('distributionChannel', newDistributionChannel, setNewDistributionChannel))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., LinkedIn"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('distributionChannel', newDistributionChannel, setNewDistributionChannel)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {distributionChannels.map((channel, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {channel}
                      <button
                        type="button"
                        onClick={() => removeItem('distributionChannel', channel)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Outreach Strategies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outreach Strategies
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newOutreachStrategy}
                    onChange={(e) => setNewOutreachStrategy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('outreachStrategy', newOutreachStrategy, setNewOutreachStrategy))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Cold email"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('outreachStrategy', newOutreachStrategy, setNewOutreachStrategy)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {outreachStrategies.map((strategy, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {strategy}
                      <button
                        type="button"
                        onClick={() => removeItem('outreachStrategy', strategy)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Types
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newContentType}
                    onChange={(e) => setNewContentType(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('contentType', newContentType, setNewContentType))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Case study"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('contentType', newContentType, setNewContentType)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((type, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {type}
                      <button
                        type="button"
                        onClick={() => removeItem('contentType', type)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Messaging Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Messaging Focus
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessagingFocus}
                    onChange={(e) => setNewMessagingFocus(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('messagingFocus', newMessagingFocus, setNewMessagingFocus))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., ROI"
                  />
                  <button
                    type="button"
                    onClick={() => addItem('messagingFocus', newMessagingFocus, setNewMessagingFocus)}
                    className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {messagingFocus.map((focus, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {focus}
                      <button
                        type="button"
                        onClick={() => removeItem('messagingFocus', focus)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Priority & Impact */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Priority & Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Effort
              </label>
              <select
                value={effort}
                onChange={(e) => setEffort(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Impact
              </label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tag', newTag, setNewTag))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={() => addItem('tag', newTag, setNewTag)}
                className="px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeItem('tag', tag)}
                    className="ml-1 text-primary-600 hover:text-primary-800"
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
              type="submit"
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditIdea; 