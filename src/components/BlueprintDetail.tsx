import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CogIcon,
  TagIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Blueprint, Experiment } from '../types';

interface BlueprintDetailProps {
  blueprints: Blueprint[];
  experiments: Experiment[];
  onUpdateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
  onDeleteBlueprint: (id: string) => void;
}

const BlueprintDetail: React.FC<BlueprintDetailProps> = ({ 
  blueprints, 
  experiments, 
  onUpdateBlueprint, 
  onDeleteBlueprint 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const blueprint = blueprints.find(bp => bp.id === id);
  const relatedExperiments = experiments.filter(exp => 
    blueprint?.relatedExperiments?.includes(exp.id)
  );

  // Helper function to safely handle both string and array values
  const safeArray = (value: any): string[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

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

  const handleDelete = () => {
    onDeleteBlueprint(blueprint.id);
    navigate('/blueprints');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/blueprints')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Blueprints
        </button>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BookOpenIcon className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{blueprint.name}</h1>
              <p className="text-gray-600 mt-1">{blueprint.description}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => navigate(`/blueprints/${blueprint.id}/edit`)}
              className="btn-secondary flex items-center"
            >
              <PencilIcon className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger flex items-center"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Blueprint Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{blueprint.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{blueprint.avgRoi}x</div>
                <div className="text-sm text-gray-600">Avg ROI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{blueprint.avgMeetingsBooked}</div>
                <div className="text-sm text-gray-600">Avg Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(blueprint.totalRevenue)}</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </div>

          {/* Blueprint Details */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Blueprint Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <div className="space-y-1">
                    {safeArray(blueprint.industry).length > 0 ? (
                      safeArray(blueprint.industry).map((industry, index) => (
                        <div key={index} className="flex items-center text-gray-900">
                          <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{industry}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No industries specified</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Roles</label>
                  <div className="space-y-1">
                    {safeArray(blueprint.targetRoles).length > 0 ? (
                      safeArray(blueprint.targetRoles).map((role, index) => (
                        <div key={index} className="flex items-center text-gray-900">
                          <UserGroupIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{role}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No target roles specified</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <div className="space-y-1">
                    {safeArray(blueprint.companySize).length > 0 ? (
                      safeArray(blueprint.companySize).map((size, index) => (
                        <div key={index} className="flex items-center text-gray-900">
                          <UsersIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{size}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No company sizes specified</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Revenue</label>
                  <div className="space-y-1">
                    {safeArray(blueprint.companyRevenue).length > 0 ? (
                      safeArray(blueprint.companyRevenue).map((revenue, index) => (
                        <div key={index} className="flex items-center text-gray-900">
                          <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{revenue}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No revenue ranges specified</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Points</label>
                  <div className="space-y-1">
                    {safeArray(blueprint.painPoints).length > 0 ? (
                      safeArray(blueprint.painPoints).map((pain, index) => (
                        <div key={index} className="flex items-center text-gray-900">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{pain}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">No pain points specified</div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Automation</label>
                  <div className="flex items-center text-gray-900">
                    <CogIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {blueprint.automation}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value Proposition</label>
                  <div className="flex items-center text-gray-900">
                    <CurrencyDollarIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {blueprint.valueProposition}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Rate</label>
                  <div className="flex items-center text-gray-900">
                    <ChartBarIcon className="w-4 h-4 mr-2 text-gray-500" />
                    {blueprint.conversionRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Experiments */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Experiments</h2>
            {relatedExperiments.length > 0 ? (
              <div className="space-y-3">
                {relatedExperiments.map(experiment => (
                  <div 
                    key={experiment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/experiments/${experiment.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{experiment.name}</h3>
                        <p className="text-sm text-gray-600">{experiment.outreachStrategy}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{experiment.successScore}%</div>
                        <div className="text-xs text-gray-500">Success Score</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No related experiments found.</p>
            )}
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Usage Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Usage Count</span>
                <span className="font-medium">{blueprint.usageCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created</span>
                <span className="font-medium">{formatDate(blueprint.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Used</span>
                <span className="font-medium">{formatDate(blueprint.lastUsed)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {blueprint.tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                >
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/experiments/create', { 
                  state: { selectedBlueprintId: blueprint.id } 
                })}
                className="w-full btn-primary"
              >
                Create New Experiment
              </button>
              <button
                onClick={() => navigate('/ai-recommendations')}
                className="w-full btn-secondary"
              >
                Get AI Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Blueprint</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{blueprint.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlueprintDetail; 