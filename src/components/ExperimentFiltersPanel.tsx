import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ExperimentFilters } from '../types';

interface ExperimentFiltersPanelProps {
  filters: ExperimentFilters;
  setFilters: (filters: ExperimentFilters) => void;
}

const ExperimentFiltersPanel: React.FC<ExperimentFiltersPanelProps> = ({ filters, setFilters }) => {
  const statusOptions = ['active', 'completed', 'paused', 'failed'];
  const icpOptions = ['SaaS CTOs', 'VP Engineering', 'SaaS Founders', 'Technical Decision Makers', 'Tech Leaders', 'Startup Founders'];
  const channelOptions = ['LinkedIn', 'Email', 'Content Marketing', 'Google Ads', 'Events', 'Social Media'];
  const performanceOptions = [
    { value: 'high', label: 'High (80%+)', color: 'text-success-600' },
    { value: 'medium', label: 'Medium (60-79%)', color: 'text-warning-600' },
    { value: 'low', label: 'Low (<60%)', color: 'text-danger-600' }
  ];

  const updateFilter = (key: keyof ExperimentFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof ExperimentFilters];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null;
  });

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <label key={status} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.status?.includes(status) || false}
                  onChange={(e) => {
                    const currentStatuses = filters.status || [];
                    if (e.target.checked) {
                      updateFilter('status', [...currentStatuses, status]);
                    } else {
                      updateFilter('status', currentStatuses.filter(s => s !== status));
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ICP Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Target ICP</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {icpOptions.map((icp) => (
              <label key={icp} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.icp?.includes(icp) || false}
                  onChange={(e) => {
                    const currentIcps = filters.icp || [];
                    if (e.target.checked) {
                      updateFilter('icp', [...currentIcps, icp]);
                    } else {
                      updateFilter('icp', currentIcps.filter(i => i !== icp));
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{icp}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Channel Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distribution Channel</label>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {channelOptions.map((channel) => (
              <label key={channel} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.channel?.includes(channel) || false}
                  onChange={(e) => {
                    const currentChannels = filters.channel || [];
                    if (e.target.checked) {
                      updateFilter('channel', [...currentChannels, channel]);
                    } else {
                      updateFilter('channel', currentChannels.filter(c => c !== channel));
                    }
                  }}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Performance Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Performance</label>
          <div className="space-y-2">
            {performanceOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="performance"
                  checked={filters.performance === option.value}
                  onChange={(e) => updateFilter('performance', e.target.value)}
                  className="border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className={`ml-2 text-sm ${option.color}`}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.status?.map((status) => (
              <span
                key={`status-${status}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
              >
                Status: {status}
                <button
                  onClick={() => {
                    const currentStatuses = filters.status || [];
                    updateFilter('status', currentStatuses.filter(s => s !== status));
                  }}
                  className="ml-1 hover:text-primary-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.icp?.map((icp) => (
              <span
                key={`icp-${icp}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800"
              >
                ICP: {icp}
                <button
                  onClick={() => {
                    const currentIcps = filters.icp || [];
                    updateFilter('icp', currentIcps.filter(i => i !== icp));
                  }}
                  className="ml-1 hover:text-success-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.channel?.map((channel) => (
              <span
                key={`channel-${channel}`}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800"
              >
                Channel: {channel}
                <button
                  onClick={() => {
                    const currentChannels = filters.channel || [];
                    updateFilter('channel', currentChannels.filter(c => c !== channel));
                  }}
                  className="ml-1 hover:text-warning-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            
            {filters.performance && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
                Performance: {filters.performance}
                <button
                  onClick={() => updateFilter('performance', undefined)}
                  className="ml-1 hover:text-danger-600"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentFiltersPanel; 