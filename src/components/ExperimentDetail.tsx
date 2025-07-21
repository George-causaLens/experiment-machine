import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  BeakerIcon, 
  CalendarIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  PauseIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  EyeIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { Experiment, ICPProfile } from '../types';
import { calculateSuccessScore, getSuccessStatus, calculateROI } from '../utils/successCalculator';
import CountdownTimer from './CountdownTimer';
import { formatDate, calculateDaysRemaining } from '../utils/dateUtils';

interface ExperimentDetailProps {
  experiments: Experiment[];
  icpProfiles: ICPProfile[];
  onUpdateExperiment: (id: string, updates: Partial<Experiment>) => void;
  onDeleteExperiment: (id: string) => void;
}

const ExperimentDetail: React.FC<ExperimentDetailProps> = ({ 
  experiments, 
  icpProfiles,
  onUpdateExperiment, 
  onDeleteExperiment 
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [metricsForm, setMetricsForm] = useState<any>(null);
  
  const experiment = experiments.find(exp => exp.id === id);
  
  if (!experiment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <BeakerIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Experiment not found</h3>
          <p className="text-gray-600 mb-4">The experiment you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/experiments')}
            className="btn-primary"
          >
            Back to Experiments
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <ClockIcon className="w-5 h-5" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'paused':
        return <PauseIcon className="w-5 h-5" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
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

  const successCalculation = calculateSuccessScore(experiment);
  const successStatus = getSuccessStatus(experiment);
  
  // Check if experiment is overdue
  const isOverdue = experiment.status === 'active' && calculateDaysRemaining(experiment.endDate) < 0;

  // Function to get targeting information display
  const getTargetingDisplay = () => {
    if (experiment.icpProfileId) {
      const icpProfile = icpProfiles.find(profile => profile.id === experiment.icpProfileId);
      if (icpProfile) {
        return (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-600">ICP Profile: {icpProfile.name}</span>
            </div>
            <div className="text-sm text-gray-600 ml-6">
              <div>Job Titles: {icpProfile.jobTitles.join(', ')}</div>
              <div>Industries: {icpProfile.industries.join(', ')}</div>
              <div>Company Sizes: {icpProfile.companySizes.join(', ')}</div>
              {icpProfile.painPoints.length > 0 && (
                <div>Pain Points: {icpProfile.painPoints.join(', ')}</div>
              )}
            </div>
          </div>
        );
      }
    } else if (experiment.customTargeting) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-600">Custom Targeting</span>
          </div>
          <div className="text-sm text-gray-600 ml-6">
            <div>Job Titles: {experiment.customTargeting.jobTitles.join(', ')}</div>
            <div>Industries: {experiment.customTargeting.industries.join(', ')}</div>
            <div>Company Sizes: {experiment.customTargeting.companySizes.join(', ')}</div>
            {experiment.customTargeting.painPoints && experiment.customTargeting.painPoints.length > 0 && (
              <div>Pain Points: {experiment.customTargeting.painPoints.join(', ')}</div>
            )}
          </div>
        </div>
      );
    }
    
    // Fallback to legacy targetAudience
    return (
      <div className="font-medium text-gray-900">{experiment.targetAudience}</div>
    );
  };

  const handleStatusChange = (newStatus: Experiment['status']) => {
    onUpdateExperiment(experiment.id, { status: newStatus });
  };

  const handleCompleteExperiment = () => {
    onUpdateExperiment(experiment.id, { 
      status: 'completed',
      completedAt: new Date()
    });
  };

  const handleDelete = () => {
    onDeleteExperiment(experiment.id);
    navigate('/experiments');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/experiments')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Experiments
        </button>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BeakerIcon className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{experiment.name}</h1>
              <p className="text-gray-600">{experiment.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`status-badge ${getStatusColor(experiment.status)} flex items-center`}>
              {getStatusIcon(experiment.status)}
              <span className="ml-1">{experiment.status}</span>
            </span>
            <CountdownTimer endDate={experiment.endDate} />
            {(experiment.status === 'active' || experiment.status === 'paused') && (
              <button
                onClick={() => handleStatusChange(experiment.status === 'active' ? 'paused' : 'active')}
                className={`px-4 py-2 rounded-md font-medium ${
                  experiment.status === 'active' 
                    ? 'bg-warning-100 text-warning-700 hover:bg-warning-200' 
                    : 'bg-success-100 text-success-700 hover:bg-success-200'
                }`}
              >
                {experiment.status === 'active' ? 'Pause Experiment' : 'Resume Experiment'}
              </button>
            )}
            <button
              onClick={() => {
                setMetricsForm({ ...experiment.metrics });
                setShowMetricsModal(true);
              }}
              className="btn-primary"
            >
              Update Metrics
            </button>
            <button
              onClick={() => navigate(`/experiments/${experiment.id}/edit`)}
              className="btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Warning */}
      {isOverdue && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Experiment Overdue
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  This experiment was scheduled to end on {formatDate(experiment.endDate)}, but is still marked as active. 
                  Please either complete the experiment or update the end date.
                </p>
              </div>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={handleCompleteExperiment}
                  className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Complete Experiment
                </button>
                <button
                  onClick={() => navigate(`/experiments/${experiment.id}/edit`)}
                  className="bg-white text-red-700 px-3 py-2 rounded-md text-sm font-medium border border-red-300 hover:bg-red-50"
                >
                  Update End Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Success Criteria */}
          <div className="card">
            <div className="flex items-center mb-4">
              <FlagIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Success Criteria</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
                  <div className="text-lg font-semibold text-gray-900 capitalize">
                    {experiment.successCriteria.primaryGoal}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time Frame</label>
                  <div className="text-lg font-semibold text-gray-900">
                    {experiment.successCriteria.timeFrame} days
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Metrics</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {experiment.successCriteria.targetMetrics.meetingsBooked && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {experiment.successCriteria.targetMetrics.meetingsBooked}
                      </div>
                      <div className="text-sm text-gray-600">Target Meetings</div>
                    </div>
                  )}
                  {experiment.successCriteria.targetMetrics.leadsGenerated && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {experiment.successCriteria.targetMetrics.leadsGenerated}
                      </div>
                      <div className="text-sm text-gray-600">Target Leads</div>
                    </div>
                  )}
                  {experiment.successCriteria.targetMetrics.responseRate && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {experiment.successCriteria.targetMetrics.responseRate}%
                      </div>
                      <div className="text-sm text-gray-600">Target Response Rate</div>
                    </div>
                  )}
                  {experiment.successCriteria.targetMetrics.roi && (
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-900">
                        {experiment.successCriteria.targetMetrics.roi}x
                      </div>
                      <div className="text-sm text-gray-600">Target ROI</div>
                    </div>
                  )}
                </div>
              </div>

              {experiment.successCriteria.secondaryGoals && experiment.successCriteria.secondaryGoals.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Goals</label>
                  <div className="flex flex-wrap gap-2">
                    {experiment.successCriteria.secondaryGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Success Threshold</label>
                <div className="text-lg font-semibold text-gray-900">
                  {experiment.successCriteria.successThreshold}% of target
                </div>
              </div>
            </div>
          </div>



          {/* Experiment Variables */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiment Variables</h2>
            <div className="space-y-3">
              {experiment.variables.map((variable, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">{variable.name}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">{variable.value}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{variable.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Links */}
          {experiment.urls && experiment.urls.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Links</h2>
              <div className="space-y-3">
                {experiment.urls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      {url.title && (
                        <div className="text-sm font-medium text-gray-700 mb-1">{url.title}</div>
                      )}
                      <a
                        href={url.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-600 hover:text-primary-800 break-all"
                      >
                        {url.url}
                      </a>
                    </div>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 p-2 text-gray-400 hover:text-gray-600"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Success Score */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Score</h3>
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${
                successStatus === 'excellent' ? 'text-green-600' :
                successStatus === 'good' ? 'text-blue-600' :
                successStatus === 'fair' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {successCalculation.score}%
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                successStatus === 'excellent' ? 'bg-green-100 text-green-800' :
                successStatus === 'good' ? 'bg-blue-100 text-blue-800' :
                successStatus === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {successStatus}
              </div>
            </div>
            
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Primary Goal</span>
                  <span>{Math.round(successCalculation.breakdown.primaryGoal)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${successCalculation.breakdown.primaryGoal}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Secondary Goals</span>
                  <span>{Math.round(successCalculation.breakdown.secondaryGoals)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-600 h-2 rounded-full" 
                    style={{ width: `${successCalculation.breakdown.secondaryGoals}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Efficiency</span>
                  <span>{Math.round(successCalculation.breakdown.efficiency)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-warning-600 h-2 rounded-full" 
                    style={{ width: `${successCalculation.breakdown.efficiency}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Experiment Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Created:</span>
                <span className="text-sm font-medium text-gray-900">
                  {experiment.createdAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Started:</span>
                <span className="text-sm font-medium text-gray-900">
                  {experiment.startedAt?.toLocaleDateString() || 'Not started'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">End Date:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(experiment.endDate)}
                </span>
              </div>
              {experiment.completedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {experiment.completedAt.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{experiment.metrics.meetingsBooked}</div>
                  <div className="text-sm text-gray-600">Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{experiment.metrics.roi}x</div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{experiment.metrics.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conv. Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">${experiment.metrics.cost}</div>
                  <div className="text-sm text-gray-600">Cost</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experiment Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Info</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Created:</span>
                <div className="font-medium text-gray-900">
                  {experiment.createdAt.toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Started:</span>
                <div className="font-medium text-gray-900">
                  {experiment.startedAt?.toLocaleDateString() || 'Not started'}
                </div>
              </div>
              {experiment.completedAt && (
                <div>
                  <span className="text-sm text-gray-600">Completed:</span>
                  <div className="font-medium text-gray-900">
                    {experiment.completedAt.toLocaleDateString()}
                  </div>
                </div>
              )}
              <div>
                <span className="text-sm text-gray-600">Strategy:</span>
                <div className="font-medium text-gray-900">{experiment.outreachStrategy}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Channel:</span>
                <div className="font-medium text-gray-900">{experiment.distributionChannel}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Target Audience:</span>
                {getTargetingDisplay()}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {experiment.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Experiment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{experiment.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Metrics Modal */}
      {showMetricsModal && metricsForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Update Performance Metrics</h3>
              <p className="text-sm text-gray-600 mt-1">Track your experiment's progress against success criteria</p>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  onUpdateExperiment(experiment.id, { metrics: { ...metricsForm } });
                  setShowMetricsModal(false);
                  setMetricsForm(null);
                }}
                className="p-6 space-y-6"
              >
                {/* Success Criteria Metrics */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <FlagIcon className="w-4 h-4 mr-2 text-primary-600" />
                    Success Criteria Metrics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const successMetrics: string[] = [];
                      const primaryGoal = experiment.successCriteria.primaryGoal;
                      const targetMetrics = experiment.successCriteria.targetMetrics;
                      
                      // Add metrics based on primary goal
                      if (primaryGoal === 'meetings' && targetMetrics.meetingsBooked !== undefined) {
                        successMetrics.push('meetingsBooked');
                      }
                      if (primaryGoal === 'leads' && targetMetrics.leadsGenerated !== undefined) {
                        successMetrics.push('leadsGenerated');
                      }
                      if (primaryGoal === 'revenue' && targetMetrics.revenueGenerated !== undefined) {
                        successMetrics.push('revenueGenerated');
                      }
                      if (primaryGoal === 'engagement' && targetMetrics.responseRate !== undefined) {
                        successMetrics.push('responseRate');
                      }
                      if (primaryGoal === 'awareness' && (targetMetrics as any).impressions !== undefined) {
                        successMetrics.push('impressions');
                      }
                      
                      // Add other target metrics that are set
                      Object.keys(targetMetrics).forEach(key => {
                        if (targetMetrics[key as keyof typeof targetMetrics] !== undefined && !successMetrics.includes(key)) {
                          successMetrics.push(key);
                        }
                      });
                      
                      return successMetrics.map(key => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={metricsForm[key] as string | number}
                            onChange={e => {
                              const newValue = Number(e.target.value);
                              const updatedForm = { ...metricsForm, [key]: newValue };
                              
                              // Auto-calculate ROI when meetings or cost changes
                              if (key === 'meetingsBooked' || key === 'cost') {
                                const calculatedROI = calculateROI(
                                  key === 'meetingsBooked' ? newValue : updatedForm.meetingsBooked,
                                  key === 'cost' ? newValue : updatedForm.cost
                                );
                                updatedForm.roi = calculatedROI;
                              }
                              
                              setMetricsForm(updatedForm);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Channel-Specific Metrics */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                    <ChartBarIcon className="w-4 h-4 mr-2 text-gray-600" />
                    Channel Performance Metrics
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(() => {
                      const channel = experiment.distributionChannel.toLowerCase();
                      const channelMetrics: string[] = [];
                      
                      // Define channel-specific metrics
                      if (channel.includes('linkedin') || channel.includes('social') || channel.includes('paid')) {
                        channelMetrics.push('impressions', 'clicks', 'ctr', 'cpc', 'cpm', 'conversions');
                      }
                      if (channel.includes('email')) {
                        channelMetrics.push('clicks', 'ctr', 'conversions', 'openRate', 'bounceRate');
                      }
                      if (channel.includes('landing') || channel.includes('website')) {
                        channelMetrics.push('clicks', 'ctr', 'conversionRate', 'timeOnPage');
                      }
                      if (channel.includes('webinar')) {
                        channelMetrics.push('registrations', 'attendanceRate', 'engagement');
                      }
                      if (channel.includes('content') || channel.includes('blog')) {
                        channelMetrics.push('impressions', 'clicks', 'ctr', 'timeOnPage');
                      }
                      
                      // Add general metrics that apply to most channels
                      channelMetrics.push('cost');
                      
                      // Remove duplicates and filter out success criteria metrics
                      const uniqueChannelMetrics = Array.from(new Set(channelMetrics));
                      const successMetrics = Object.keys(experiment.successCriteria.targetMetrics);
                      const filteredMetrics = uniqueChannelMetrics.filter(metric => 
                        !successMetrics.includes(metric) && metricsForm.hasOwnProperty(metric)
                      );
                      
                      return filteredMetrics.map(key => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={metricsForm[key] as string | number}
                            onChange={e => {
                              const newValue = Number(e.target.value);
                              const updatedForm = { ...metricsForm, [key]: newValue };
                              
                              // Auto-calculate ROI when meetings or cost changes
                              if (key === 'meetingsBooked' || key === 'cost') {
                                const calculatedROI = calculateROI(
                                  key === 'meetingsBooked' ? newValue : updatedForm.meetingsBooked,
                                  key === 'cost' ? newValue : updatedForm.cost
                                );
                                updatedForm.roi = calculatedROI;
                              }
                              
                              setMetricsForm(updatedForm);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      ));
                    })()}
                    
                    {/* Calculated ROI Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ROI (Calculated)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={calculateROI(metricsForm.meetingsBooked, metricsForm.cost).toFixed(1)}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Based on {metricsForm.meetingsBooked} meetings × $7,200 value per meeting
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => { setShowMetricsModal(false); setMetricsForm(null); }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={() => {
                    onUpdateExperiment(experiment.id, { metrics: { ...metricsForm } });
                    setShowMetricsModal(false);
                    setMetricsForm(null);
                  }}
                  className="btn-primary"
                >
                  Save Metrics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperimentDetail; 