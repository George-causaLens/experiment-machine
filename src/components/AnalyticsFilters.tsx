import React, { useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Experiment, Blueprint } from '../types';

interface AnalyticsFiltersProps {
  filters: {
    status: string[];
    dateRange: { start: Date; end: Date } | null;
    blueprints: string[];
    channels: string[];
    tags: string[];
    icpProfiles: string[];
  };
  onFiltersChange: (filters: any) => void;
  experiments: Experiment[];
  blueprints: Blueprint[];
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  experiments,
  blueprints
}) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  // Extract unique values from experiments
  const uniqueStatuses = Array.from(new Set(experiments.map(exp => exp.status)));
  const uniqueChannels = Array.from(new Set(experiments.map(exp => exp.distributionChannel)));
  const uniqueTags = Array.from(new Set(experiments.flatMap(exp => exp.tags)));

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const updateFilter = (filterName: string, value: any) => {
    onFiltersChange({
      ...filters,
      [filterName]: value
    });
  };

  const clearFilter = (filterName: string) => {
    updateFilter(filterName, filterName === 'dateRange' ? null : []);
  };

  // Add a type for filter keys
  const filterKeys = [
    'status',
    'blueprints',
    'channels',
    'tags',
    'icpProfiles',
  ] as const;
  type FilterKey = typeof filterKeys[number];

  const toggleArrayFilter = (filterName: string, value: string) => {
    if (!filterKeys.includes(filterName as FilterKey)) return;
    const key = filterName as FilterKey;
    const currentValues = filters[key];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const FilterDropdown = ({ 
    name, 
    label, 
    options, 
    selectedValues, 
    onToggle 
  }: {
    name: string;
    label: string;
    options: string[];
    selectedValues: string[];
    onToggle: (value: string) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() => toggleFilter(name)}
        className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md ${
          selectedValues.length > 0 
            ? 'border-primary-300 bg-primary-50 text-primary-700' 
            : 'border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <span>{label}</span>
        <div className="flex items-center">
          {selectedValues.length > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
              {selectedValues.length}
            </span>
          )}
          <ChevronDownIcon className="w-4 h-4" />
        </div>
      </button>

      {openFilter === name && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            {options.map(option => (
              <label key={option} className="flex items-center px-2 py-1 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => onToggle(option)}
                  className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const DateRangeFilter = () => {
    const [startDate, setStartDate] = useState(
      filters.dateRange?.start.toISOString().slice(0, 10) || ''
    );
    const [endDate, setEndDate] = useState(
      filters.dateRange?.end.toISOString().slice(0, 10) || ''
    );

    const applyDateFilter = () => {
      if (startDate && endDate) {
        updateFilter('dateRange', {
          start: new Date(startDate),
          end: new Date(endDate)
        });
      }
      setOpenFilter(null);
    };

    return (
      <div className="relative">
        <button
          onClick={() => toggleFilter('dateRange')}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-md ${
            filters.dateRange 
              ? 'border-primary-300 bg-primary-50 text-primary-700' 
              : 'border-gray-300 text-gray-700 hover:border-gray-400'
          }`}
        >
          <span>Date Range</span>
          <div className="flex items-center">
            {filters.dateRange && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                Set
              </span>
            )}
            <ChevronDownIcon className="w-4 h-4" />
          </div>
        </button>

        {openFilter === 'dateRange' && (
          <div className="absolute z-10 w-80 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={applyDateFilter}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      clearFilter('dateRange');
                      setStartDate('');
                      setEndDate('');
                      setOpenFilter(null);
                    }}
                    className="px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {(filters.status.length > 0 || 
        filters.blueprints.length > 0 || 
        filters.channels.length > 0 || 
        filters.tags.length > 0 || 
        filters.dateRange) && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map(status => (
            <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Status: {status}
              <button
                onClick={() => toggleArrayFilter('status', status)}
                className="ml-1 hover:bg-primary-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.blueprints.map(blueprintId => (
            <span key={blueprintId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800">
              Blueprint: {blueprintId}
              <button
                onClick={() => toggleArrayFilter('blueprints', blueprintId)}
                className="ml-1 hover:bg-success-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.channels.map(channel => (
            <span key={channel} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
              Channel: {channel}
              <button
                onClick={() => toggleArrayFilter('channels', channel)}
                className="ml-1 hover:bg-warning-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.tags.map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
              Tag: {tag}
              <button
                onClick={() => toggleArrayFilter('tags', tag)}
                className="ml-1 hover:bg-danger-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          {filters.dateRange && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Date Range: {filters.dateRange.start.toLocaleDateString()} - {filters.dateRange.end.toLocaleDateString()}
              <button
                onClick={() => clearFilter('dateRange')}
                className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <FilterDropdown
          name="status"
          label="Status"
          options={uniqueStatuses}
          selectedValues={filters.status}
          onToggle={(value) => toggleArrayFilter('status', value)}
        />

        <FilterDropdown
          name="channels"
          label="Channels"
          options={uniqueChannels}
          selectedValues={filters.channels}
          onToggle={(value) => toggleArrayFilter('channels', value)}
        />

        <FilterDropdown
          name="blueprints"
          label="Blueprints"
          options={blueprints.map(bp => bp.id)}
          selectedValues={filters.blueprints}
          onToggle={(value) => toggleArrayFilter('blueprints', value)}
        />

        <FilterDropdown
          name="tags"
          label="Tags"
          options={uniqueTags}
          selectedValues={filters.tags}
          onToggle={(value) => toggleArrayFilter('tags', value)}
        />

        <DateRangeFilter />

        <button
          onClick={() => {
            onFiltersChange({
              status: [],
              dateRange: null,
              blueprints: [],
              channels: [],
              tags: [],
              icpProfiles: []
            });
          }}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default AnalyticsFilters; 