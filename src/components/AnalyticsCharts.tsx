import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Experiment } from '../types';

interface AnalyticsChartsProps {
  experiments: Experiment[];
  patternAnalysis: any;
  channelAnalysis: any;
  blueprintAnalysis: any;
  icpAnalysis: any;
  dateAnalysis: any;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  experiments,
  patternAnalysis,
  channelAnalysis,
  blueprintAnalysis,
  icpAnalysis,
  dateAnalysis
}) => {
  // Prepare data for charts
  const successDistributionData = [
    { name: 'High (80%+)', value: patternAnalysis.successDistribution.high, color: '#10B981' },
    { name: 'Medium (50-79%)', value: patternAnalysis.successDistribution.medium, color: '#F59E0B' },
    { name: 'Low (<50%)', value: patternAnalysis.successDistribution.low, color: '#EF4444' }
  ];

  const channelData = channelAnalysis.channels.map((channel: any) => ({
    name: channel.channel,
    'Success Rate (%)': channel.successRate,
    'Avg ROI': channel.avgROI,
    'Total Meetings': channel.totalMeetings,
    'Experiments': channel.experiments.length
  }));

  const icpData = icpAnalysis.icps.map((icp: any) => ({
    name: icp.role,
    'Success Rate (%)': icp.successRate,
    'Avg ROI': icp.avgROI,
    'Total Meetings': icp.totalMeetings,
    'Experiments': icp.experiments.length
  }));

  const monthlyData = dateAnalysis.experimentsByMonth.map((month: any) => ({
    name: month.month,
    'Experiments': month.count,
    'Success Rate (%)': month.successRate,
    'Avg ROI': month.avgROI
  }));

  const statusData = dateAnalysis.experimentsByStatus.map((status: any) => ({
    name: status.status,
    'Count': status.count,
    'Success Rate (%)': status.successRate
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Experiments</p>
            <p className="text-2xl font-bold text-gray-900">{patternAnalysis.totalExperiments}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Avg Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">{patternAnalysis.avgSuccessRate.toFixed(1)}%</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Avg ROI</p>
            <p className="text-2xl font-bold text-gray-900">{patternAnalysis.avgROI.toFixed(1)}x</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Meetings</p>
            <p className="text-2xl font-bold text-gray-900">{patternAnalysis.totalMeetingsBooked}</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Success Distribution Pie Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Success Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={successDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {successDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Channel Performance Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={channelData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Success Rate (%)" fill="#3B82F6" />
              <Bar dataKey="Avg ROI" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ICP Performance Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ICP Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={icpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Success Rate (%)" fill="#F59E0B" />
              <Bar dataKey="Total Meetings" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trends Line Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="Experiments" stroke="#3B82F6" />
              <Line yAxisId="right" type="monotone" dataKey="Success Rate (%)" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Count" fill="#06B6D4" />
            <Bar dataKey="Success Rate (%)" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Performers Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Channels</h3>
          <div className="space-y-3">
            {channelAnalysis.channels.slice(0, 5).map((channel: any, index: number) => (
              <div key={channel.channel} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
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

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing ICPs</h3>
          <div className="space-y-3">
            {icpAnalysis.icps.slice(0, 5).map((icp: any, index: number) => (
              <div key={icp.role} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-3" 
                        style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }}></span>
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
  );
};

export default AnalyticsCharts; 