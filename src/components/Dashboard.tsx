import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  BeakerIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { Experiment, Blueprint } from '../types';
import MetricCard from './MetricCard';
import RecentExperiments from './RecentExperiments';
import { seedSampleData } from '../utils/seedData';

interface DashboardProps {
  experiments: Experiment[];
  blueprints: Blueprint[];
}

const Dashboard: React.FC<DashboardProps> = ({ experiments, blueprints }) => {
  const activeExperiments = experiments.filter(exp => exp.status === 'active').length;
  const successRate = experiments.length > 0 
    ? experiments.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / experiments.length 
    : 0;
  const totalMeetingsBooked = experiments.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0);
  const avgRoi = experiments.length > 0 
    ? experiments.reduce((sum, exp) => sum + exp.metrics.roi, 0) / experiments.length 
    : 0;

  const calculateTopPerformingChannel = () => {
    if (experiments.length === 0) return 'N/A';
    
    const channelStats = experiments.reduce((acc, exp) => {
      const channel = exp.distributionChannel;
      if (!acc[channel]) {
        acc[channel] = { count: 0, totalScore: 0 };
      }
      acc[channel].count++;
      acc[channel].totalScore += exp.successScore || 0;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const topChannel = Object.entries(channelStats)
      .map(([channel, stats]) => ({
        channel,
        avgScore: stats.totalScore / stats.count
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0];

    return topChannel?.channel || 'N/A';
  };

  const calculateTopPerformingICP = () => {
    if (experiments.length === 0) return 'N/A';
    
    const icpStats = experiments.reduce((acc, exp) => {
      const icp = exp.targetAudience.split(' at ')[0]; // Extract role from target audience
      if (!acc[icp]) {
        acc[icp] = { count: 0, totalScore: 0 };
      }
      acc[icp].count++;
      acc[icp].totalScore += exp.successScore || 0;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const topICP = Object.entries(icpStats)
      .map(([icp, stats]) => ({
        icp,
        avgScore: stats.totalScore / stats.count
      }))
      .sort((a, b) => b.avgScore - a.avgScore)[0];

    return topICP?.icp || 'N/A';
  };

  const topPerformingChannel = calculateTopPerformingChannel();
  const topPerformingICP = calculateTopPerformingICP();

  const handleSeedData = async () => {
    try {
      await seedSampleData();
      // Reload the page to show the new data
      window.location.reload();
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your experimentation progress and performance</p>
        </div>
        <div className="flex space-x-3">
          {experiments.length === 0 && (
            <button
              onClick={handleSeedData}
              className="btn-secondary"
            >
              Seed Sample Data
            </button>
          )}
          <button
            onClick={() => window.location.href = '/experiments/create'}
            className="btn-primary"
          >
            Create Experiment
          </button>
          <button
            onClick={() => window.location.href = '/analytics'}
            className="btn-secondary"
          >
            View Analytics
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Experiments"
          value={experiments.length.toString()}
          icon={BeakerIcon}
          color="primary"
        />
        <MetricCard
          title="Active Experiments"
          value={activeExperiments.toString()}
          icon={ArrowTrendingUpIcon}
          color="success"
        />
        <MetricCard
          title="Success Rate"
          value={`${successRate.toFixed(1)}%`}
          icon={ChartBarIcon}
          color="warning"
        />
        <MetricCard
          title="Total Meetings"
          value={totalMeetingsBooked.toString()}
          icon={CalendarIcon}
          color="danger"
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average ROI</span>
              <span className="font-semibold text-gray-900">{avgRoi.toFixed(1)}x</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Top Channel</span>
              <span className="font-semibold text-gray-900">{topPerformingChannel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Top ICP</span>
              <span className="font-semibold text-gray-900">{topPerformingICP}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/blueprints'}
              className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <BookOpenIcon className="w-5 h-5 text-primary-600 mr-3" />
                <span className="font-medium text-gray-900">Blueprint Library</span>
              </div>
              <span className="text-sm text-gray-500">{blueprints.length} blueprints</span>
            </button>
            <button
              onClick={() => window.location.href = '/ai-recommendations'}
              className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <LightBulbIcon className="w-5 h-5 text-warning-600 mr-3" />
                <span className="font-medium text-gray-900">AI Recommendations</span>
              </div>
              <span className="text-sm text-gray-500">Get insights</span>
            </button>
            <button
              onClick={() => window.location.href = '/icp-profiles'}
              className="w-full flex items-center justify-between p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center">
                <UserGroupIcon className="w-5 h-5 text-success-600 mr-3" />
                <span className="font-medium text-gray-900">ICP Profiles</span>
              </div>
              <span className="text-sm text-gray-500">Manage profiles</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Experiments */}
      <RecentExperiments experiments={experiments} />
    </div>
  );
};

export default Dashboard; 