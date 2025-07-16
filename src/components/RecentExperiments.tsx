import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BeakerIcon, EyeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Experiment } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface RecentExperimentsProps {
  experiments?: Experiment[];
}

const RecentExperiments: React.FC<RecentExperimentsProps> = ({ experiments = [] }) => {
  const navigate = useNavigate();

  // Use provided experiments
  const recentExperiments: Experiment[] = experiments;

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

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BeakerIcon className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Experiments</h3>
        </div>
        <button 
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          onClick={() => navigate('/experiments')}
        >
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {recentExperiments.map((experiment, index) => (
          <motion.div
            key={experiment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
            onClick={() => navigate(`/experiments/${experiment.id}`)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{experiment.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{experiment.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(experiment.createdAt, { addSuffix: true })}
                  </div>
                  <div className="flex items-center">
                    <EyeIcon className="w-3 h-3 mr-1" />
                    {experiment.metrics.impressions.toLocaleString()} impressions
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                <span className={`status-badge ${getStatusColor(experiment.status)}`}>
                  {experiment.status}
                </span>
                {experiment.successScore && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {experiment.successScore}%
                    </div>
                    <div className="text-xs text-gray-500">Success Score</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <div className="text-gray-500">Meetings</div>
                <div className="font-medium text-gray-900">{experiment.metrics.meetingsBooked}</div>
              </div>
              <div>
                <div className="text-gray-500">ROI</div>
                <div className="font-medium text-gray-900">{experiment.metrics.roi}x</div>
              </div>
              <div>
                <div className="text-gray-500">Conv. Rate</div>
                <div className="font-medium text-gray-900">{experiment.metrics.conversionRate}%</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {experiment.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {experiment.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{experiment.tags.length - 3} more</span>
                )}
              </div>
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentExperiments; 