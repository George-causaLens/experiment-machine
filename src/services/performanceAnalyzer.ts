import { Experiment, Blueprint } from '../types';
import { calculateROI } from '../utils/successCalculator';

export interface PerformanceMetrics {
  totalExperiments: number;
  successRate: number;
  avgROI: number;
  avgMeetingsBooked: number;
  avgResponseRate: number;
  totalMeetingsBooked: number;
  totalCost: number;
}

export interface ChannelPerformance {
  channel: string;
  experiments: Experiment[];
  metrics: PerformanceMetrics;
  successRate: number;
  avgROI: number;
  totalMeetings: number;
}

export interface ICPPerformance {
  icp: string;
  role: string;
  industry: string;
  companySize: string;
  experiments: Experiment[];
  metrics: PerformanceMetrics;
  successRate: number;
  avgROI: number;
  totalMeetings: number;
}

export interface StrategyPerformance {
  strategy: string;
  experiments: Experiment[];
  metrics: PerformanceMetrics;
  successRate: number;
  avgROI: number;
  totalMeetings: number;
}

export class PerformanceAnalyzer {
  /**
   * Analyze performance by distribution channel
   */
  analyzeChannelPerformance(experiments: Experiment[]): ChannelPerformance[] {
    const channelMap = new Map<string, Experiment[]>();
    
    // Group experiments by distribution channel
    experiments.forEach(exp => {
      const channel = exp.distributionChannels[0] || '';
      if (!channelMap.has(channel)) {
        channelMap.set(channel, []);
      }
      channelMap.get(channel)!.push(exp);
    });
    
    // Calculate metrics for each channel
    return Array.from(channelMap.entries()).map(([channel, exps]) => {
      const metrics = this.calculatePerformanceMetrics(exps);
      const successRate = this.calculateSuccessRate(exps);
      const avgROI = this.calculateAverageROI(exps);
      const totalMeetings = exps.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
      
      return {
        channel,
        experiments: exps,
        metrics,
        successRate,
        avgROI,
        totalMeetings
      };
    }).sort((a, b) => b.successRate - a.successRate); // Sort by success rate
  }
  
  /**
   * Analyze performance by ICP (target audience)
   */
  analyzeICPPerformance(experiments: Experiment[]): ICPPerformance[] {
    const icpMap = new Map<string, Experiment[]>();
    
    // Group experiments by ICP (extract from target audience)
    experiments.forEach(exp => {
      const icp = this.extractICPFromTargetAudience(exp.targetAudience);
      if (!icpMap.has(icp)) {
        icpMap.set(icp, []);
      }
      icpMap.get(icp)!.push(exp);
    });
    
    // Calculate metrics for each ICP
    return Array.from(icpMap.entries()).map(([icp, exps]) => {
      const metrics = this.calculatePerformanceMetrics(exps);
      const successRate = this.calculateSuccessRate(exps);
      const avgROI = this.calculateAverageROI(exps);
      const totalMeetings = exps.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
      
      // Parse ICP components
      const { role, industry, companySize } = this.parseICPComponents(icp);
      
      return {
        icp,
        role,
        industry,
        companySize,
        experiments: exps,
        metrics,
        successRate,
        avgROI,
        totalMeetings
      };
    }).sort((a, b) => b.successRate - a.successRate); // Sort by success rate
  }
  
  /**
   * Analyze performance by outreach strategy
   */
  analyzeStrategyPerformance(experiments: Experiment[]): StrategyPerformance[] {
    const strategyMap = new Map<string, Experiment[]>();
    
    // Group experiments by outreach strategy
    experiments.forEach(exp => {
      const strategy = exp.outreachStrategies[0] || '';
      if (!strategyMap.has(strategy)) {
        strategyMap.set(strategy, []);
      }
      strategyMap.get(strategy)!.push(exp);
    });
    
    // Calculate metrics for each strategy
    return Array.from(strategyMap.entries()).map(([strategy, exps]) => {
      const metrics = this.calculatePerformanceMetrics(exps);
      const successRate = this.calculateSuccessRate(exps);
      const avgROI = this.calculateAverageROI(exps);
      const totalMeetings = exps.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
      
      return {
        strategy,
        experiments: exps,
        metrics,
        successRate,
        avgROI,
        totalMeetings
      };
    }).sort((a, b) => b.successRate - a.successRate); // Sort by success rate
  }
  
  /**
   * Find top-performing experiments
   */
  findTopPerformingExperiments(experiments: Experiment[], limit: number = 5): Experiment[] {
    return experiments
      .filter(exp => exp.successScore && exp.successScore > 70) // Only successful experiments
      .sort((a, b) => (b.successScore || 0) - (a.successScore || 0))
      .slice(0, limit);
  }
  
  /**
   * Find underperforming experiments
   */
  findUnderperformingExperiments(experiments: Experiment[], limit: number = 5): Experiment[] {
    return experiments
      .filter(exp => exp.successScore && exp.successScore < 50) // Underperforming experiments
      .sort((a, b) => (a.successScore || 0) - (b.successScore || 0))
      .slice(0, limit);
  }
  
  /**
   * Find untapped ICPs (ICPs not yet targeted)
   */
  findUntappedICPs(experiments: Experiment[], blueprints: Blueprint[]): string[] {
    const targetedICPs = new Set<string>();
    
    // Get all currently targeted ICPs
    experiments.forEach(exp => {
      const icp = this.extractICPFromTargetAudience(exp.targetAudience);
      targetedICPs.add(icp);
    });
    
    // Find blueprints with ICPs not yet targeted
    const untappedICPs: string[] = [];
    blueprints.forEach(bp => {
      // Use the first target role for ICP generation
      const targetRole = bp.targetRoles.length > 0 ? bp.targetRoles[0] : 'Unknown Role';
      const blueprintICP = `${targetRole} at ${bp.companySize} companies in ${bp.industry}`;
      if (!targetedICPs.has(blueprintICP)) {
        untappedICPs.push(blueprintICP);
      }
    });
    return untappedICPs;
  }
  
  /**
   * Calculate overall performance metrics for a set of experiments
   */
  private calculatePerformanceMetrics(experiments: Experiment[]): PerformanceMetrics {
    if (experiments.length === 0) {
      return {
        totalExperiments: 0,
        successRate: 0,
        avgROI: 0,
        avgMeetingsBooked: 0,
        avgResponseRate: 0,
        totalMeetingsBooked: 0,
        totalCost: 0
      };
    }
    
    const totalExperiments = experiments.length;
    const successRate = this.calculateSuccessRate(experiments);
    const avgROI = this.calculateAverageROI(experiments);
    const avgMeetingsBooked = experiments.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0) / totalExperiments;
    const avgResponseRate = experiments.reduce((sum, exp) => sum + (exp.metrics?.conversionRate || 0), 0) / totalExperiments;
    const totalMeetingsBooked = experiments.reduce((sum, exp) => sum + (exp.metrics?.meetingsBooked || 0), 0);
    const totalCost = experiments.reduce((sum, exp) => sum + (exp.metrics?.cost || 0), 0);
    
    return {
      totalExperiments,
      successRate,
      avgROI,
      avgMeetingsBooked,
      avgResponseRate,
      totalMeetingsBooked,
      totalCost
    };
  }
  
  /**
   * Calculate success rate (percentage of experiments with success score >= 70)
   */
  private calculateSuccessRate(experiments: Experiment[]): number {
    if (experiments.length === 0) return 0;
    
    const successfulExperiments = experiments.filter(exp => exp.successScore && exp.successScore >= 70);
    return (successfulExperiments.length / experiments.length) * 100;
  }
  
  /**
   * Calculate average ROI
   */
  private calculateAverageROI(experiments: Experiment[]): number {
    if (experiments.length === 0) return 0;
    
    const totalROI = experiments.reduce((sum, exp) => {
      const roi = calculateROI(exp.metrics.meetingsBooked, exp.metrics.cost);
      return sum + roi;
    }, 0);
    
    return totalROI / experiments.length;
  }
  
  /**
   * Extract ICP from target audience string
   */
  private extractICPFromTargetAudience(targetAudience: string): string {
    // Handle cases where target audience might be empty or malformed
    if (!targetAudience || targetAudience.trim() === '') {
      return 'Unknown ICP';
    }
    
    // Return the target audience as is, or extract key components
    return targetAudience;
  }
  
  /**
   * Parse ICP components from target audience string
   */
  private parseICPComponents(icp: string): { role: string; industry: string; companySize: string } {
    // Default parsing logic - can be enhanced based on actual data format
    const parts = icp.split(' at ');
    const role = parts[0] || 'Unknown Role';
    const companyInfo = parts[1] || 'Unknown Company';
    
    // Extract industry and company size from "companies in Industry" format
    const companyParts = companyInfo.split(' companies in ');
    const companySize = companyParts[0] || 'Unknown Size';
    const industry = companyParts[1] || 'Unknown Industry';
    
    return { role, industry, companySize };
  }
} 