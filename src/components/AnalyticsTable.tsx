import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Experiment } from '../types';

interface AnalyticsTableProps {
  experiments: Experiment[];
}

type SortField = 'name' | 'status' | 'successScore' | 'roi' | 'meetingsBooked' | 'createdAt' | 'channel' | 'blueprintId';
type SortDirection = 'asc' | 'desc';

const AnalyticsTable: React.FC<AnalyticsTableProps> = ({ experiments }) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedExperiments = [...experiments].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'successScore':
        aValue = a.successScore || 0;
        bValue = b.successScore || 0;
        break;
      case 'roi':
        aValue = a.metrics.roi;
        bValue = b.metrics.roi;
        break;
      case 'meetingsBooked':
        aValue = a.metrics.meetingsBooked;
        bValue = b.metrics.meetingsBooked;
        break;
      case 'createdAt':
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
        break;
      case 'channel':
        aValue = a.distributionChannels[0]?.toLowerCase() || '';
        bValue = b.distributionChannels[0]?.toLowerCase() || '';
        break;
      case 'blueprintId':
        aValue = a.blueprintId;
        bValue = b.blueprintId;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-700"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />
      )}
    </button>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800';
      case 'completed':
        return 'bg-primary-100 text-primary-800';
      case 'paused':
        return 'bg-warning-100 text-warning-800';
      case 'failed':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuccessScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <div className="card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="name">Experiment</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="status">Status</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="channel">Channel</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="blueprintId">Blueprint</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="successScore">Success Score</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="roi">ROI</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="meetingsBooked">Meetings</SortableHeader>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <SortableHeader field="createdAt">Created</SortableHeader>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExperiments.map((experiment) => (
              <tr key={experiment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{experiment.name}</div>
                    <div className="text-sm text-gray-500">{experiment.targetAudience}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(experiment.status)}`}>
                    {experiment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {experiment.distributionChannels.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {experiment.blueprintId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-semibold ${getSuccessScoreColor(experiment.successScore || 0)}`}>
                    {experiment.successScore ? `${experiment.successScore.toFixed(1)}%` : 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {experiment.metrics.roi.toFixed(1)}x
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {experiment.metrics.meetingsBooked}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {experiment.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedExperiments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No experiments match the current filters.</p>
        </div>
      )}

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Showing {sortedExperiments.length} of {experiments.length} experiments
        </p>
      </div>
    </div>
  );
};

export default AnalyticsTable; 