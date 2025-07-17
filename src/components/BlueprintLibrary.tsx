import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon, 
  PlusIcon, 
  MagnifyingGlassIcon, 
  StarIcon,
  ChartBarIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Blueprint, Experiment } from '../types';

interface BlueprintLibraryProps {
  blueprints: Blueprint[];
  experiments: Experiment[];
  onAddBlueprint: (blueprint: Blueprint) => void;
  onUpdateBlueprint: (id: string, updates: Partial<Blueprint>) => void;
  onDeleteBlueprint: (id: string) => void;
}

const BlueprintLibrary: React.FC<BlueprintLibraryProps> = ({ 
  blueprints, 
  experiments, 
  onAddBlueprint, 
  onUpdateBlueprint, 
  onDeleteBlueprint 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(blueprints.map(bp => bp.industry)))];

  const filteredBlueprints = blueprints.filter(blueprint => {
    const matchesSearch = !searchTerm || 
      blueprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blueprint.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || blueprint.industry === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseBlueprint = (blueprint: Blueprint) => {
    // Navigate to create experiment with blueprint pre-filled
    navigate('/experiments/create', { 
      state: { 
        selectedBlueprint: blueprint,
        mode: 'use-blueprint'
      } 
    });
  };

  const handleViewBlueprint = (blueprint: Blueprint) => {
    navigate(`/blueprints/${blueprint.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blueprint Library</h1>
          <p className="text-gray-600">Repeatable business use cases with proven outreach strategies</p>
        </div>
        <button 
          onClick={() => navigate('/blueprints/create')}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Blueprint
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex border border-gray-300 rounded-lg">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 text-sm font-medium capitalize ${
                selectedCategory === category 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredBlueprints.map((blueprint, index) => (
          <motion.div
            key={blueprint.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewBlueprint(blueprint)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {blueprint.industry && blueprint.industry.length > 0 
                      ? blueprint.industry.slice(0, 2).join(', ') + (blueprint.industry.length > 2 ? '...' : '')
                      : 'Not specified'
                    }
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <StarIcon className="w-4 h-4 fill-current" />
                    <span className="ml-1 text-sm font-medium text-gray-900">{blueprint.successRate}%</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{blueprint.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{blueprint.description}</p>
                
                {/* Business Use Case Details */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div>
                    <div className="text-gray-500">Target Roles</div>
                    <div className="font-medium text-gray-900">
                      {blueprint.targetRoles && blueprint.targetRoles.length > 0 
                        ? blueprint.targetRoles.slice(0, 2).join(', ') + (blueprint.targetRoles.length > 2 ? '...' : '')
                        : 'Not specified'
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500">Company Size</div>
                    <div className="font-medium text-gray-900">
                      {blueprint.companySize && blueprint.companySize.length > 0 
                        ? blueprint.companySize.slice(0, 2).join(', ') + (blueprint.companySize.length > 2 ? '...' : '')
                        : 'Not specified'
                      }
                    </div>
                  </div>
                </div>
                
                {/* Company Revenue */}
                {blueprint.companyRevenue && blueprint.companyRevenue.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Company Revenue</div>
                    <div className="text-sm font-medium text-gray-900">
                      {blueprint.companyRevenue.slice(0, 2).join(', ') + (blueprint.companyRevenue.length > 2 ? '...' : '')}
                    </div>
                  </div>
                )}
                
                {/* Pain Points */}
                {blueprint.painPoints && blueprint.painPoints.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-1">Pain Points</div>
                    <div className="text-sm font-medium text-gray-900">
                      {blueprint.painPoints.slice(0, 2).join(', ') + (blueprint.painPoints.length > 2 ? '...' : '')}
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Automation</div>
                  <div className="text-sm font-medium text-gray-900">{blueprint.automation}</div>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Value Proposition</div>
                  <div className="text-sm text-gray-900">{blueprint.valueProposition}</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-4 gap-3 mb-4 text-xs">
              <div className="text-center">
                <div className="text-lg font-bold text-success-600">{blueprint.avgRoi}x</div>
                <div className="text-gray-500">Avg ROI</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary-600">{blueprint.avgMeetingsBooked}</div>
                <div className="text-gray-500">Avg Meetings</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-warning-600">${(blueprint.totalRevenue / 1000).toFixed(0)}k</div>
                <div className="text-gray-500">Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-danger-600">{blueprint.conversionRate}%</div>
                <div className="text-gray-500">Conv. Rate</div>
              </div>
            </div>

            {/* Related Experiments */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Successful Experiments:</h4>
              <div className="text-xs text-gray-600">
                {blueprint.relatedExperiments.length} experiments have successfully generated leads for this blueprint
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <ClockIcon className="w-3 h-3 mr-1" />
                  Last used {new Date(blueprint.lastUsed).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <UserGroupIcon className="w-3 h-3 mr-1" />
                  {blueprint.usageCount} times
                </div>
              </div>
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUseBlueprint(blueprint);
                }}
              >
                Use Blueprint
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredBlueprints.length === 0 && (
        <div className="text-center py-12">
          <BookOpenIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blueprints found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or industry filter'
              : 'Get started by creating your first business use case blueprint'
            }
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/blueprints/create')}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Blueprint
          </button>
        </div>
      )}
    </div>
  );
};

export default BlueprintLibrary; 