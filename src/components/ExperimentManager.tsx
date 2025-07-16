import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PlusIcon,
  ChartBarIcon,
  CalendarIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { Experiment, ExperimentFilters, Blueprint } from '../types';
import ExperimentCard from './ExperimentCard';
import ExperimentFiltersPanel from './ExperimentFiltersPanel';
import { calculateDaysRemaining } from '../utils/dateUtils';

interface ExperimentManagerProps {
  experiments: Experiment[];
  blueprints: Blueprint[];
  onAddExperiment: (experiment: Experiment) => void;
  onUpdateExperiment: (id: string, updates: Partial<Experiment>) => void;
  onDeleteExperiment: (id: string) => void;
}

const ExperimentManager: React.FC<ExperimentManagerProps> = ({ 
  experiments, 
  blueprints, 
  onAddExperiment, 
  onUpdateExperiment, 
  onDeleteExperiment 
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ExperimentFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');



  const filteredExperiments = experiments.filter(experiment => {
    // Search filter
    if (searchTerm && !experiment.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !experiment.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status && filters.status.length > 0 && !filters.status.includes(experiment.status)) {
      return false;
    }

    // ICP filter
    if (filters.icp && filters.icp.length > 0 && !filters.icp.includes(experiment.targetAudience)) {
      return false;
    }

    // Channel filter
    if (filters.channel && filters.channel.length > 0 && !filters.channel.includes(experiment.distributionChannel)) {
      return false;
    }

    // Performance filter
    if (filters.performance) {
      const score = experiment.successScore || 0;
      if (filters.performance === 'high' && score < 80) return false;
      if (filters.performance === 'medium' && (score < 60 || score >= 80)) return false;
      if (filters.performance === 'low' && score >= 60) return false;
    }

    return true;
  });

  const statusCounts = experiments.reduce((acc, exp) => {
    acc[exp.status] = (acc[exp.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count overdue experiments
  const overdueCount = experiments.filter(exp => 
    exp.status === 'active' && calculateDaysRemaining(exp.endDate) < 0
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Experiments</h1>
          <p className="text-gray-600">Manage and track your lead generation experiments</p>
        </div>
        <button 
          onClick={() => navigate('/experiments/create')}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create Experiment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total</div>
          <div className="text-2xl font-bold text-gray-900">{experiments.length}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-success-600">{statusCounts.active || 0}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Paused</div>
          <div className="text-2xl font-bold text-warning-600">{statusCounts.paused || 0}</div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-primary-600">{statusCounts.completed || 0}</div>
        </div>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Avg. Success Rate</div>
          <div className="text-2xl font-bold text-warning-600">
            {experiments.length > 0 
              ? Math.round(experiments.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / experiments.length)
              : 0}%
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Total Meetings</div>
          <div className="text-2xl font-bold text-blue-600">
            {experiments.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0)}
          </div>
        </div>
      </div>

      {/* Overdue Warning */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {overdueCount} experiment{overdueCount > 1 ? 's' : ''} overdue
              </h3>
              <div className="mt-1 text-sm text-red-700">
                <p>
                  {overdueCount} active experiment{overdueCount > 1 ? 's have' : ' has'} passed their end date. 
                  Please review and either complete or update the end dates.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center px-4 py-2 border rounded-lg transition-colors ${
            showFilters 
              ? 'border-primary-300 bg-primary-50 text-primary-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="w-5 h-5 mr-2" />
          Filters
        </button>
        <div className="flex border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm font-medium ${
              viewMode === 'grid' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium ${
              viewMode === 'list' 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ExperimentFiltersPanel filters={filters} setFilters={setFilters} />
        </motion.div>
      )}

      {/* Experiments Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredExperiments.map((experiment, index) => (
          <motion.div
            key={experiment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ExperimentCard 
              experiment={experiment} 
              viewMode={viewMode} 
              onUpdateExperiment={onUpdateExperiment}
            />
          </motion.div>
        ))}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="text-center py-12">
          <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.keys(filters).length > 0 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first experiment'
            }
          </p>
          <button className="btn-primary">
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Experiment
          </button>
        </div>
      )}
    </div>
  );
};

export default ExperimentManager; 