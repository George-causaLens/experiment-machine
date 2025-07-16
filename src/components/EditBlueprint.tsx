import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { Blueprint } from '../types';

interface EditBlueprintProps {
  blueprints: Blueprint[];
  onUpdateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
}

const EditBlueprint: React.FC<EditBlueprintProps> = ({ 
  blueprints, 
  onUpdateBlueprint 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const blueprint = blueprints.find(bp => bp.id === id);
  
  const [formData, setFormData] = useState<Partial<Blueprint>>({
    name: '',
    description: '',
    industry: '',
    targetRole: '',
    companySize: '',
    automation: '',
    valueProposition: '',
    successRate: 0,
    avgRoi: 0,
    avgMeetingsBooked: 0,
    totalRevenue: 0,
    conversionRate: 0,
    tags: [],
    relatedExperiments: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (blueprint) {
      setFormData(blueprint);
    }
  }, [blueprint]);

  if (!blueprint) {
    return (
      <div className="text-center py-12">
        <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Blueprint not found</h3>
        <p className="text-gray-600 mb-4">The blueprint you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/blueprints')}
          className="btn-primary"
        >
          Back to Blueprints
        </button>
      </div>
    );
  }

  const handleInputChange = (field: keyof Blueprint, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBlueprint(blueprint.id, formData);
    navigate(`/blueprints/${blueprint.id}`);
  };

  const handleCancel = () => {
    navigate(`/blueprints/${blueprint.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/blueprints/${blueprint.id}`)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Blueprint
        </button>
        <div className="flex items-center">
          <BookOpenIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Edit Blueprint</h1>
        </div>
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
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="form-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry || ''}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className="form-select w-full"
                required
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
                value={formData.targetRole || ''}
                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                className="form-input w-full"
                placeholder="e.g., COO, CTO, VP Operations"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size *
              </label>
              <select
                value={formData.companySize || ''}
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                className="form-select w-full"
                required
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
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="form-textarea w-full"
              placeholder="Describe the business use case and value proposition..."
              required
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
                value={formData.automation || ''}
                onChange={(e) => handleInputChange('automation', e.target.value)}
                className="form-input w-full"
                placeholder="e.g., PDF → Categorization automation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition *
              </label>
              <input
                type="text"
                value={formData.valueProposition || ''}
                onChange={(e) => handleInputChange('valueProposition', e.target.value)}
                className="form-input w-full"
                placeholder="e.g., $50M annual value through streamlined processing"
                required
              />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Success Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.successRate || 0}
                onChange={(e) => handleInputChange('successRate', parseFloat(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg ROI (x)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={formData.avgRoi || 0}
                onChange={(e) => handleInputChange('avgRoi', parseFloat(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avg Meetings Booked
              </label>
              <input
                type="number"
                min="0"
                value={formData.avgMeetingsBooked || 0}
                onChange={(e) => handleInputChange('avgMeetingsBooked', parseInt(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Revenue ($)
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalRevenue || 0}
                onChange={(e) => handleInputChange('totalRevenue', parseInt(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversion Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.conversionRate || 0}
                onChange={(e) => handleInputChange('conversionRate', parseFloat(e.target.value) || 0)}
                className="form-input w-full"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="form-input flex-1"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="btn-secondary"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlueprint; 