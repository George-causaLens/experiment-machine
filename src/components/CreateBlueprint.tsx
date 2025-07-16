import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Blueprint } from '../types';

interface CreateBlueprintProps {
  onAddBlueprint: (blueprint: Blueprint) => void;
}

const CreateBlueprint: React.FC<CreateBlueprintProps> = ({ onAddBlueprint }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    targetRole: '',
    companySize: '',
    automation: '',
    valueProposition: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newBlueprint = {
      id: `bp-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      targetRole: formData.targetRole,
      companySize: formData.companySize,
      automation: formData.automation,
      valueProposition: formData.valueProposition,
      successRate: 0,
      avgRoi: 0,
      avgMeetingsBooked: 0,
      totalRevenue: 0,
      conversionRate: 0,
      tags: [],
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      relatedExperiments: []
    };

    onAddBlueprint(newBlueprint);
    navigate('/blueprints');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/blueprints')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Blueprints
        </button>
        <div className="flex items-center">
          <BookOpenIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Blueprint</h1>
        </div>
        <p className="text-gray-600 mt-2">Create a new business use case blueprint</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blueprint Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Manufacturing COO Document Automation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                required
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Industry</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Role *
              </label>
              <input
                type="text"
                required
                value={formData.targetRole}
                onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., COO, CTO, VP Operations"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size *
              </label>
              <select
                required
                value={formData.companySize}
                onChange={(e) => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Company Size</option>
                <option value="$1M-$10M revenue">$1M-$10M revenue</option>
                <option value="$10M-$50M revenue">$10M-$50M revenue</option>
                <option value="$50M-$100M revenue">$50M-$100M revenue</option>
                <option value="$100M+ revenue">$100M+ revenue</option>
                <option value="$500M+ revenue">$500M+ revenue</option>
                <option value="$1B+ revenue">$1B+ revenue</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the business use case and value proposition..."
            />
          </div>
        </div>

        {/* Automation & Value */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Automation & Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Process *
              </label>
              <input
                type="text"
                required
                value={formData.automation}
                onChange={(e) => setFormData(prev => ({ ...prev, automation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., PDF → Categorization automation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition *
              </label>
              <input
                type="text"
                required
                value={formData.valueProposition}
                onChange={(e) => setFormData(prev => ({ ...prev, valueProposition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., $50M annual value through streamlined processing"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/blueprints')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Create Blueprint
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprint; 