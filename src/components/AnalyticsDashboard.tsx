import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  FunnelIcon, 
  TableCellsIcon, 
  ChartPieIcon,
  CalendarIcon,
  TagIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Experiment, Blueprint } from '../types';
import AnalyticsFilters from './AnalyticsFilters';
import AnalyticsTable from './AnalyticsTable';
import AnalyticsCharts from './AnalyticsCharts';
import { useAnalytics } from '../hooks/useAnalytics';

interface AnalyticsDashboardProps {
  experiments: Experiment[];
  blueprints: Blueprint[];
}

type ViewMode = 'table' | 'charts' | 'patterns';

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  experiments, 
  blueprints 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('charts');
  const [filters, setFilters] = useState({
    status: [] as string[],
    dateRange: null as { start: Date; end: Date } | null,
    blueprints: [] as string[],
    channels: [] as string[],
    tags: [] as string[],
    icpProfiles: [] as string[]
  });

  const { 
    filteredExperiments, 
    patternAnalysis, 
    channelAnalysis, 
    blueprintAnalysis,
    icpAnalysis,
    dateAnalysis 
  } = useAnalytics(experiments, filters);

  const totalExperiments = experiments.length;
  const filteredCount = filteredExperiments.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Analyze patterns and repeatability across {totalExperiments} experiments
          </p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('charts')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'charts' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Charts
          </button>
          <button
            onClick={() => setViewMode('patterns')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'patterns' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ChartPieIcon className="w-4 h-4 mr-2" />
            Patterns
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'table' 
                ? 'bg-white text-primary-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TableCellsIcon className="w-4 h-4 mr-2" />
            Table
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FunnelIcon className="w-5 h-5 text-gray-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          <span className="text-sm text-gray-500">
            {filteredCount} of {totalExperiments} experiments
          </span>
        </div>
        
        <AnalyticsFilters 
          filters={filters} 
          onFiltersChange={setFilters}
          experiments={experiments}
          blueprints={blueprints}
        />
      </div>

      {/* Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'charts' && (
          <AnalyticsCharts 
            experiments={filteredExperiments}
            patternAnalysis={patternAnalysis}
            channelAnalysis={channelAnalysis}
            blueprintAnalysis={blueprintAnalysis}
            icpAnalysis={icpAnalysis}
            dateAnalysis={dateAnalysis}
          />
        )}
        
        {viewMode === 'patterns' && (
          <div className="space-y-6">
            {/* Pattern Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center">
                  <BuildingOfficeIcon className="w-8 h-8 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Channel</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {channelAnalysis.topChannel?.channel || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {channelAnalysis.topChannel?.successRate.toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <UserGroupIcon className="w-8 h-8 text-success-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top ICP</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {icpAnalysis.topICP?.role || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {icpAnalysis.topICP?.successRate.toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <TagIcon className="w-8 h-8 text-warning-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Top Blueprint</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {blueprintAnalysis.topBlueprint?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {blueprintAnalysis.topBlueprint?.successRate.toFixed(1)}% success rate
                    </p>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center">
                  <CalendarIcon className="w-8 h-8 text-danger-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {patternAnalysis.avgDuration.toFixed(1)} days
                    </p>
                    <p className="text-xs text-gray-500">
                      {patternAnalysis.totalExperiments} experiments
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Patterns */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h4>
                <div className="space-y-3">
                  {channelAnalysis.channels.map((channel, index) => (
                    <div key={channel.channel} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3" 
                              style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></span>
                        <span className="font-medium text-gray-900">{channel.channel}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {channel.successRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {channel.experiments.length} experiments
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ICP Patterns */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">ICP Performance</h4>
                <div className="space-y-3">
                  {icpAnalysis.icps.map((icp, index) => (
                    <div key={icp.role} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 rounded-full mr-3" 
                              style={{ backgroundColor: `hsl(${index * 60 + 30}, 70%, 50%)` }}></span>
                        <span className="font-medium text-gray-900">{icp.role}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {icp.successRate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-gray-500">
                          {icp.experiments.length} experiments
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'table' && (
          <AnalyticsTable experiments={filteredExperiments} />
        )}
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard; 