import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  EyeIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  PauseIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Experiment } from '../types';
import { formatDistanceToNow } from 'date-fns';
import CountdownTimer from './CountdownTimer';
import { formatDate, calculateDaysRemaining } from '../utils/dateUtils';

interface ExperimentCardProps {
  experiment: Experiment;
  viewMode: 'grid' | 'list';
  onUpdateExperiment?: (id: string, updates: Partial<Experiment>) => void;
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ experiment, viewMode, onUpdateExperiment }) => {
  const navigate = useNavigate();
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="w-4 h-4" />;
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'paused':
        return <PauseIcon className="w-4 h-4" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'paused':
        return 'status-paused';
      case 'failed':
        return 'status-failed';
      default:
        return 'status-paused';
    }
  };

  const handlePauseResume = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateExperiment) {
      const newStatus = experiment.status === 'active' ? 'paused' : 'active';
      onUpdateExperiment(experiment.id, { status: newStatus });
    }
  };

  // Check if experiment is overdue
  const isOverdue = experiment.status === 'active' && calculateDaysRemaining(experiment.endDate) < 0;

  // Function to get targeting display
  const getTargetingDisplay = () => {
    if (experiment.icpProfileId) {
      return `ICP Profile (${experiment.icpProfileId.slice(0, 8)}...)`;
    } else if (experiment.customTargeting) {
      const jobTitles = experiment.customTargeting.jobTitles.slice(0, 2).join(', ');
      const industries = experiment.customTargeting.industries.slice(0, 1).join(', ');
      return `${jobTitles} in ${industries}`;
    }
    return experiment.targetAudience;
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="card hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => navigate(`/experiments/${experiment.id}`)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <BeakerIcon className="w-6 h-6 text-primary-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">{experiment.name}</h3>
                <span className={`status-badge ${getStatusColor(experiment.status)} flex items-center`}>
                  {getStatusIcon(experiment.status)}
                  <span className="ml-1">{experiment.status}</span>
                </span>
                {isOverdue && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Overdue
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{experiment.description}</p>
              
              <div className="flex items-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <CalendarIcon className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(experiment.createdAt, { addSuffix: true })}
                </div>
                <div className="flex items-center">
                  <EyeIcon className="w-3 h-3 mr-1" />
                  {experiment.metrics.impressions.toLocaleString()} impressions
                </div>
                <div className="flex items-center">
                  <ChartBarIcon className="w-3 h-3 mr-1" />
                  {experiment.metrics.meetingsBooked} meetings
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">Ends: {formatDate(experiment.endDate)}</span>
                </div>
              </div>
              <CountdownTimer endDate={experiment.endDate} className="mt-2" />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{getTargetingDisplay()}</div>
              <div className="text-xs text-gray-500">Target Audience</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{experiment.distributionChannel}</div>
              <div className="text-xs text-gray-500">Channel</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{experiment.metrics.roi}x</div>
              <div className="text-xs text-gray-500">ROI</div>
            </div>
            {experiment.successScore && (
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{experiment.successScore}%</div>
                <div className="text-xs text-gray-500">Success</div>
              </div>
            )}
            {(experiment.status === 'active' || experiment.status === 'paused') && onUpdateExperiment && (
              <button 
                className={`text-sm px-3 py-1 rounded-md mr-2 ${
                  experiment.status === 'active' 
                    ? 'bg-warning-100 text-warning-700 hover:bg-warning-200' 
                    : 'bg-success-100 text-success-700 hover:bg-success-200'
                }`}
                onClick={handlePauseResume}
              >
                {experiment.status === 'active' ? 'Pause' : 'Resume'}
              </button>
            )}
            <button 
              className="btn-secondary text-sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/experiments/${experiment.id}`);
              }}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/experiments/${experiment.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
            <BeakerIcon className="w-5 h-5 text-primary-600" />
          </div>
          <span className={`status-badge ${getStatusColor(experiment.status)} flex items-center`}>
            {getStatusIcon(experiment.status)}
            <span className="ml-1">{experiment.status}</span>
          </span>
          {isOverdue && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Overdue
            </span>
          )}
        </div>
        {experiment.successScore && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">{experiment.successScore}%</div>
            <div className="text-xs text-gray-500">Success</div>
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{experiment.name}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{experiment.description}</p>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Target Audience:</span>
          <span className="font-medium text-gray-900">{getTargetingDisplay()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Channel:</span>
          <span className="font-medium text-gray-900">{experiment.distributionChannel}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Created:</span>
          <span className="text-gray-900">{formatDistanceToNow(experiment.createdAt, { addSuffix: true })}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Ends:</span>
          <span className="text-gray-900">{formatDate(experiment.endDate)}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
        <div className="text-center">
          <div className="text-gray-500">Meetings</div>
          <div className="font-medium text-gray-900">{experiment.metrics.meetingsBooked}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">ROI</div>
          <div className="font-medium text-gray-900">{experiment.metrics.roi}x</div>
        </div>
        <div className="text-center">
          <div className="text-gray-500">Conv. Rate</div>
          <div className="font-medium text-gray-900">{experiment.metrics.conversionRate}%</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-wrap gap-1">
            {experiment.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {experiment.tags.length > 2 && (
              <span className="text-xs text-gray-500">+{experiment.tags.length - 2}</span>
            )}
          </div>
          <CountdownTimer endDate={experiment.endDate} />
        </div>
        <div className="flex items-center space-x-2">
          {(experiment.status === 'active' || experiment.status === 'paused') && onUpdateExperiment && (
            <button 
              className={`text-xs px-2 py-1 rounded-md ${
                experiment.status === 'active' 
                  ? 'bg-warning-100 text-warning-700 hover:bg-warning-200' 
                  : 'bg-success-100 text-success-700 hover:bg-success-200'
              }`}
              onClick={handlePauseResume}
            >
              {experiment.status === 'active' ? 'Pause' : 'Resume'}
            </button>
          )}
          <button 
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/experiments/${experiment.id}`);
            }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCard; 