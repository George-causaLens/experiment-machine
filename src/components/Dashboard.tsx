import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BeakerIcon, 
  ArrowTrendingUpIcon, 
  PauseIcon, 
  CheckCircleIcon, 
  CurrencyDollarIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Experiment, Blueprint, DashboardMetrics } from '../types';
import { calculateROI } from '../utils/successCalculator';
import MetricCard from './MetricCard';
import AIRecommendations from './AIRecommendations';
import RecentExperiments from './RecentExperiments';

interface DashboardProps {
  experiments: Experiment[];
  blueprints: Blueprint[];
}

const Dashboard: React.FC<DashboardProps> = ({ experiments, blueprints }) => {
  const navigate = useNavigate();
  
  // Calculate real metrics from experiments data
  const activeExperiments = experiments.filter(exp => exp.status === 'active');
  const pausedExperiments = experiments.filter(exp => exp.status === 'paused');
  const totalMeetingsBooked = experiments.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
  const avgRoi = experiments.length > 0 
    ? experiments.reduce((sum, exp) => sum + calculateROI(exp.metrics.meetingsBooked, exp.metrics.cost), 0) / experiments.length
    : 0;
  const successRate = experiments.length > 0 
    ? experiments.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / experiments.length
    : 0;
  
  // Calculate top performing channel and ICP from real data
  const calculateTopPerformingChannel = () => {
    const channelMap = new Map<string, number>();
    experiments.forEach(exp => {
      const channel = exp.distributionChannel;
      const meetings = exp.metrics?.meetingsBooked || 0;
      channelMap.set(channel, (channelMap.get(channel) || 0) + meetings);
    });
    
    let topChannel = 'None';
    let maxMeetings = 0;
    channelMap.forEach((meetings, channel) => {
      if (meetings > maxMeetings) {
        maxMeetings = meetings;
        topChannel = channel;
      }
    });
    return topChannel;
  };

  const calculateTopPerformingICP = () => {
    // Extract ICP from target audience (simplified approach)
    const icpMap = new Map<string, number>();
    experiments.forEach(exp => {
      const icp = exp.targetAudience.split(' at ')[0] || 'Unknown';
      const meetings = exp.metrics?.meetingsBooked || 0;
      icpMap.set(icp, (icpMap.get(icp) || 0) + meetings);
    });
    
    let topICP = 'None';
    let maxMeetings = 0;
    icpMap.forEach((meetings, icp) => {
      if (meetings > maxMeetings) {
        maxMeetings = meetings;
        topICP = icp;
      }
    });
    return topICP;
  };

  const dashboardMetrics: DashboardMetrics = {
    totalExperiments: experiments.length,
    activeExperiments: activeExperiments.length,
    successRate: Math.round(successRate),
    totalMeetingsBooked: totalMeetingsBooked,
    avgRoi: Math.round(avgRoi * 10) / 10,
    topPerformingChannel: calculateTopPerformingChannel(),
    topPerformingIcp: calculateTopPerformingICP()
  };

  // Generate performance data from real experiments
  const generatePerformanceData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthExperiments = experiments.filter(exp => {
        const expMonth = exp.createdAt.getMonth();
        const monthIndex = months.indexOf(month);
        return expMonth === monthIndex;
      });
      
      const totalMeetings = monthExperiments.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
      const avgRoi = monthExperiments.length > 0 
        ? monthExperiments.reduce((sum, exp) => sum + calculateROI(exp.metrics.meetingsBooked, exp.metrics.cost), 0) / monthExperiments.length
        : 0;
      
      return {
        month,
        experiments: monthExperiments.length,
        meetings: totalMeetings,
        roi: Math.round(avgRoi * 10) / 10
      };
    });
  };

  const performanceData = generatePerformanceData();

  // Generate channel performance from real experiments
  const generateChannelPerformance = () => {
    const channelMap = new Map<string, { meetings: number; roi: number; count: number }>();
    
    experiments.forEach(exp => {
      const channel = exp.distributionChannel;
      const meetings = exp.metrics?.meetingsBooked || 0;
      const roi = calculateROI(exp.metrics.meetingsBooked, exp.metrics.cost);
      
      if (channelMap.has(channel)) {
        const existing = channelMap.get(channel)!;
        existing.meetings += meetings;
        existing.roi += roi;
        existing.count += 1;
      } else {
        channelMap.set(channel, { meetings, roi, count: 1 });
      }
    });
    
    return Array.from(channelMap.entries()).map(([channel, data]) => ({
      channel,
      meetings: data.meetings,
      roi: Math.round((data.roi / data.count) * 10) / 10
    })).sort((a, b) => b.meetings - a.meetings);
  };

  const channelPerformance = generateChannelPerformance();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Your lead generation experimentation command center</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
            <CheckCircleIcon className="w-4 h-4 mr-1" />
            System Healthy
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Experiments"
          value={dashboardMetrics.totalExperiments.toString()}
          change="+12%"
          changeType="positive"
          icon={BeakerIcon}
          color="primary"
        />
        <MetricCard
          title="Active Experiments"
          value={dashboardMetrics.activeExperiments.toString()}
          change="+3"
          changeType="positive"
          icon={ArrowTrendingUpIcon}
          color="success"
        />
        <MetricCard
          title="Paused Experiments"
          value={pausedExperiments.length.toString()}
          change=""
          changeType="neutral"
          icon={PauseIcon}
          color="warning"
        />
        <MetricCard
          title="Avg. Success Rate"
          value={`${dashboardMetrics.successRate}%`}
          change="+5.2%"
          changeType="positive"
          icon={CheckCircleIcon}
          color="success"
        />
        <MetricCard
          title="Avg ROI"
          value={`${dashboardMetrics.avgRoi}x`}
          change="+0.3x"
          changeType="positive"
          icon={CurrencyDollarIcon}
          color="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Trend</h3>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="meetings" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="roi" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Performance */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
            <span className="text-sm text-gray-500">Meetings Booked</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="meetings" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Recommendations and Recent Experiments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIRecommendations 
          experiments={experiments}
          blueprints={blueprints}
          onAddExperiment={() => {}}
          onAddBlueprint={() => {}}
        />
        <RecentExperiments experiments={experiments} />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/experiments/create')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BeakerIcon className="w-6 h-6 text-primary-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">New Experiment</div>
              <div className="text-sm text-gray-500">Start a new lead generation test</div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/ai-recommendations')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LightBulbIcon className="w-6 h-6 text-warning-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">AI Suggestions</div>
              <div className="text-sm text-gray-500">Get intelligent recommendations</div>
            </div>
          </button>
          <button 
            onClick={() => navigate('/analytics')}
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="w-6 h-6 text-success-600 mr-3" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View Analytics</div>
              <div className="text-sm text-gray-500">Deep dive into performance</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 