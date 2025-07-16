import { useMemo } from 'react';
import { Experiment, Blueprint } from '../types';
import { calculateROI } from '../utils/successCalculator';

interface AnalyticsFilters {
  status: string[];
  dateRange: { start: Date; end: Date } | null;
  blueprints: string[];
  channels: string[];
  tags: string[];
  icpProfiles: string[];
}

interface ChannelAnalysis {
  channel: string;
  experiments: Experiment[];
  successRate: number;
  avgROI: number;
  totalMeetings: number;
  avgMeetings: number;
  totalCost: number;
}

interface ICPAnalysis {
  role: string;
  industry: string;
  companySize: string;
  experiments: Experiment[];
  successRate: number;
  avgROI: number;
  totalMeetings: number;
  avgMeetings: number;
}

interface BlueprintAnalysis {
  id: string;
  name: string;
  experiments: Experiment[];
  successRate: number;
  avgROI: number;
  totalMeetings: number;
  avgMeetings: number;
  repeatability: number; // How many times this blueprint was used successfully
}

interface PatternAnalysis {
  totalExperiments: number;
  avgSuccessRate: number;
  avgROI: number;
  avgDuration: number;
  avgMeetingsBooked: number;
  totalMeetingsBooked: number;
  totalCost: number;
  successDistribution: {
    high: number; // 80%+
    medium: number; // 50-79%
    low: number; // <50%
  };
}

interface DateAnalysis {
  experimentsByMonth: Array<{
    month: string;
    count: number;
    successRate: number;
    avgROI: number;
  }>;
  experimentsByStatus: Array<{
    status: string;
    count: number;
    successRate: number;
  }>;
}

interface AnalyticsResult {
  filteredExperiments: Experiment[];
  patternAnalysis: PatternAnalysis;
  channelAnalysis: {
    channels: ChannelAnalysis[];
    topChannel: ChannelAnalysis | null;
  };
  icpAnalysis: {
    icps: ICPAnalysis[];
    topICP: ICPAnalysis | null;
  };
  blueprintAnalysis: {
    blueprints: BlueprintAnalysis[];
    topBlueprint: BlueprintAnalysis | null;
  };
  dateAnalysis: DateAnalysis;
}

export const useAnalytics = (
  experiments: Experiment[], 
  filters: AnalyticsFilters
): AnalyticsResult => {
  return useMemo(() => {
    // Apply filters
    let filteredExperiments = experiments.filter(exp => {
      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(exp.status)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const expDate = exp.createdAt;
        if (expDate < filters.dateRange.start || expDate > filters.dateRange.end) {
          return false;
        }
      }

      // Blueprint filter
      if (filters.blueprints.length > 0 && !filters.blueprints.includes(exp.blueprintId)) {
        return false;
      }

      // Channel filter
      if (filters.channels.length > 0 && !filters.channels.includes(exp.distributionChannel)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => exp.tags.includes(tag))) {
        return false;
      }

      return true;
    });

    // Pattern Analysis
    const patternAnalysis: PatternAnalysis = {
      totalExperiments: filteredExperiments.length,
      avgSuccessRate: filteredExperiments.length > 0 
        ? filteredExperiments.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / filteredExperiments.length 
        : 0,
      avgROI: filteredExperiments.length > 0 
        ? filteredExperiments.reduce((sum, exp) => sum + exp.metrics.roi, 0) / filteredExperiments.length 
        : 0,
      avgDuration: filteredExperiments.length > 0 
        ? filteredExperiments.reduce((sum, exp) => {
            const duration = Math.ceil((exp.endDate.getTime() - exp.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return sum + duration;
          }, 0) / filteredExperiments.length 
        : 0,
      avgMeetingsBooked: filteredExperiments.length > 0 
        ? filteredExperiments.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0) / filteredExperiments.length 
        : 0,
      totalMeetingsBooked: filteredExperiments.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0),
      totalCost: filteredExperiments.reduce((sum, exp) => sum + exp.metrics.cost, 0),
      successDistribution: {
        high: filteredExperiments.filter(exp => (exp.successScore || 0) >= 80).length,
        medium: filteredExperiments.filter(exp => (exp.successScore || 0) >= 50 && (exp.successScore || 0) < 80).length,
        low: filteredExperiments.filter(exp => (exp.successScore || 0) < 50).length
      }
    };

    // Channel Analysis
    const channelMap = new Map<string, Experiment[]>();
    filteredExperiments.forEach(exp => {
      const channel = exp.distributionChannel;
      if (!channelMap.has(channel)) {
        channelMap.set(channel, []);
      }
      channelMap.get(channel)!.push(exp);
    });

    const channelAnalysis: ChannelAnalysis[] = Array.from(channelMap.entries()).map(([channel, exps]) => ({
      channel,
      experiments: exps,
      successRate: exps.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / exps.length,
      avgROI: exps.reduce((sum, exp) => sum + exp.metrics.roi, 0) / exps.length,
      totalMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0),
      avgMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0) / exps.length,
      totalCost: exps.reduce((sum, exp) => sum + exp.metrics.cost, 0)
    })).sort((a, b) => b.successRate - a.successRate);

    // ICP Analysis
    const icpMap = new Map<string, Experiment[]>();
    filteredExperiments.forEach(exp => {
      // Extract role from target audience
      const role = exp.targetAudience.split(' at ')[0] || 'Unknown';
      if (!icpMap.has(role)) {
        icpMap.set(role, []);
      }
      icpMap.get(role)!.push(exp);
    });

    const icpAnalysis: ICPAnalysis[] = Array.from(icpMap.entries()).map(([role, exps]) => ({
      role,
      industry: 'Mixed', // Could be enhanced to extract from target audience
      companySize: 'Mixed', // Could be enhanced to extract from target audience
      experiments: exps,
      successRate: exps.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / exps.length,
      avgROI: exps.reduce((sum, exp) => sum + exp.metrics.roi, 0) / exps.length,
      totalMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0),
      avgMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0) / exps.length
    })).sort((a, b) => b.successRate - a.successRate);

    // Blueprint Analysis
    const blueprintMap = new Map<string, Experiment[]>();
    filteredExperiments.forEach(exp => {
      const blueprintId = exp.blueprintId;
      if (!blueprintMap.has(blueprintId)) {
        blueprintMap.set(blueprintId, []);
      }
      blueprintMap.get(blueprintId)!.push(exp);
    });

    const blueprintAnalysis: BlueprintAnalysis[] = Array.from(blueprintMap.entries()).map(([blueprintId, exps]) => ({
      id: blueprintId,
      name: `Blueprint ${blueprintId}`, // Could be enhanced to get actual blueprint name
      experiments: exps,
      successRate: exps.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / exps.length,
      avgROI: exps.reduce((sum, exp) => sum + exp.metrics.roi, 0) / exps.length,
      totalMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0),
      avgMeetings: exps.reduce((sum, exp) => sum + exp.metrics.meetingsBooked, 0) / exps.length,
      repeatability: exps.filter(exp => (exp.successScore || 0) >= 70).length
    })).sort((a, b) => b.successRate - a.successRate);

    // Date Analysis
    const monthMap = new Map<string, Experiment[]>();
    const statusMap = new Map<string, Experiment[]>();

    filteredExperiments.forEach(exp => {
      // Group by month
      const month = exp.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }
      monthMap.get(month)!.push(exp);

      // Group by status
      const status = exp.status;
      if (!statusMap.has(status)) {
        statusMap.set(status, []);
      }
      statusMap.get(status)!.push(exp);
    });

    const experimentsByMonth = Array.from(monthMap.entries()).map(([month, exps]) => ({
      month,
      count: exps.length,
      successRate: exps.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / exps.length,
      avgROI: exps.reduce((sum, exp) => sum + exp.metrics.roi, 0) / exps.length
    })).sort((a, b) => a.month.localeCompare(b.month));

    const experimentsByStatus = Array.from(statusMap.entries()).map(([status, exps]) => ({
      status,
      count: exps.length,
      successRate: exps.reduce((sum, exp) => sum + (exp.successScore || 0), 0) / exps.length
    }));

    return {
      filteredExperiments,
      patternAnalysis,
      channelAnalysis: {
        channels: channelAnalysis,
        topChannel: channelAnalysis[0] || null
      },
      icpAnalysis: {
        icps: icpAnalysis,
        topICP: icpAnalysis[0] || null
      },
      blueprintAnalysis: {
        blueprints: blueprintAnalysis,
        topBlueprint: blueprintAnalysis[0] || null
      },
      dateAnalysis: {
        experimentsByMonth,
        experimentsByStatus
      }
    };
  }, [experiments, filters]);
}; 