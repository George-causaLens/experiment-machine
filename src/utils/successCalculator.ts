import { Experiment, SuccessScoreCalculation } from '../types';

export const calculateSuccessScore = (experiment: Experiment): SuccessScoreCalculation => {
  
  // Calculate target achievement (60% weight)
  const primaryGoalScore = calculatePrimaryGoalScore(experiment);
  
  // Calculate secondary goals achievement (30% weight)
  const secondaryGoalsScore = calculateSecondaryGoalsScore(experiment);
  
  // Calculate efficiency score (10% weight)
  const efficiencyScore = calculateEfficiencyScore(experiment);
  
  // Weighted average
  const totalScore = Math.round(
    (primaryGoalScore * 0.6) + 
    (secondaryGoalsScore * 0.3) + 
    (efficiencyScore * 0.1)
  );
  
  return {
    experimentId: experiment.id,
    calculatedAt: new Date(),
    score: Math.max(0, Math.min(100, totalScore)), // Ensure score is between 0-100
    breakdown: {
      primaryGoal: primaryGoalScore,
      secondaryGoals: secondaryGoalsScore,
      efficiency: efficiencyScore
    },
    details: {
      targetAchievement: calculateTargetAchievement(experiment),
      timeEfficiency: calculateTimeEfficiency(experiment),
      costEfficiency: calculateCostEfficiency(experiment),
      qualityScore: calculateQualityScore(experiment)
    }
  };
};

const calculatePrimaryGoalScore = (experiment: Experiment): number => {
  const { successCriteria, metrics } = experiment;
  const { primaryGoal, targetMetrics, successThreshold } = successCriteria;
  
  let actualValue = 0;
  let targetValue = 0;
  
  switch (primaryGoal) {
    case 'meetings':
      actualValue = metrics.meetingsBooked;
      targetValue = targetMetrics.meetingsBooked || 0;
      break;
    case 'leads':
      actualValue = metrics.conversions; // Using conversions as leads
      targetValue = targetMetrics.leadsGenerated || 0;
      break;
    case 'revenue':
      actualValue = metrics.roi * metrics.cost; // Approximate revenue
      targetValue = targetMetrics.revenueGenerated || 0;
      break;
    case 'engagement':
      actualValue = metrics.conversionRate;
      targetValue = targetMetrics.responseRate || 0;
      break;
    case 'awareness':
      actualValue = metrics.impressions;
      targetValue = targetMetrics.clickThroughRate || 0;
      break;
  }
  
  if (targetValue === 0) return 0;
  
  const achievementPercentage = (actualValue / targetValue) * 100;
  return Math.min(100, (achievementPercentage / successThreshold) * 100);
};

const calculateSecondaryGoalsScore = (experiment: Experiment): number => {
  const { successCriteria } = experiment;
  const { metrics } = experiment;
  const { secondaryGoals, targetMetrics } = successCriteria;
  
  if (!secondaryGoals || secondaryGoals.length === 0) return 0; // No secondary goals = 0 score
  
  let totalScore = 0;
  let goalCount = 0;
  
  // Check each secondary goal against available metrics
  secondaryGoals.forEach(goal => {
    let goalScore = 0;
    
    if (goal.toLowerCase().includes('response') || goal.toLowerCase().includes('engagement')) {
      goalScore = Math.min(100, (metrics.conversionRate / (targetMetrics.responseRate || 1)) * 100);
    } else if (goal.toLowerCase().includes('cost') || goal.toLowerCase().includes('efficiency')) {
      const targetCPL = targetMetrics.costPerLead || 100;
      const actualCPL = metrics.cost / Math.max(1, metrics.conversions);
      goalScore = Math.min(100, (targetCPL / actualCPL) * 100);
    } else if (goal.toLowerCase().includes('roi')) {
      goalScore = Math.min(100, (metrics.roi / (targetMetrics.roi || 1)) * 100);
    } else if (goal.toLowerCase().includes('reach') || goal.toLowerCase().includes('impressions')) {
      goalScore = Math.min(100, (metrics.impressions / 1000) * 10); // Normalize to reasonable scale
    } else {
      // Default scoring for undefined goals
      goalScore = 50; // Neutral score
    }
    
    totalScore += goalScore;
    goalCount++;
  });
  
  return goalCount > 0 ? totalScore / goalCount : 100;
};

const calculateEfficiencyScore = (experiment: Experiment): number => {
  // Time efficiency (how quickly goals were achieved)
  const timeEfficiency = calculateTimeEfficiency(experiment);
  
  // Cost efficiency (ROI vs expected)
  const costEfficiency = calculateCostEfficiency(experiment);
  
  // Quality efficiency (conversion quality)
  const qualityEfficiency = calculateQualityScore(experiment);
  
  return (timeEfficiency + costEfficiency + qualityEfficiency) / 3;
};

const calculateTargetAchievement = (experiment: Experiment): number => {
  const { successCriteria, metrics } = experiment;
  const { primaryGoal, targetMetrics } = successCriteria;
  
  let actualValue = 0;
  let targetValue = 0;
  
  switch (primaryGoal) {
    case 'meetings':
      actualValue = metrics.meetingsBooked;
      targetValue = targetMetrics.meetingsBooked || 0;
      break;
    case 'leads':
      actualValue = metrics.conversions;
      targetValue = targetMetrics.leadsGenerated || 0;
      break;
    case 'revenue':
      actualValue = metrics.roi * metrics.cost;
      targetValue = targetMetrics.revenueGenerated || 0;
      break;
    case 'engagement':
      actualValue = metrics.conversionRate;
      targetValue = targetMetrics.responseRate || 0;
      break;
    case 'awareness':
      actualValue = metrics.impressions;
      targetValue = targetMetrics.clickThroughRate || 0;
      break;
  }
  
  if (targetValue === 0) return 0;
  return Math.min(100, (actualValue / targetValue) * 100);
};

const calculateTimeEfficiency = (experiment: Experiment): number => {
  // This would be more sophisticated in a real implementation
  // For now, we'll use a simple heuristic based on experiment age
  const now = new Date();
  const startDate = experiment.startedAt || experiment.createdAt;
  const daysRunning = Math.max(1, Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  
  const targetDays = experiment.successCriteria.timeFrame;
  const achievement = calculateTargetAchievement(experiment);
  
  // If we've achieved our goal in less time than expected, that's efficient
  if (achievement >= 100 && daysRunning < targetDays) {
    return 100;
  }
  
  // If we're behind schedule, penalize
  if (daysRunning > targetDays && achievement < 100) {
    return Math.max(0, 100 - ((daysRunning - targetDays) / targetDays) * 50);
  }
  
  // Otherwise, neutral score
  return 70;
};

const calculateCostEfficiency = (experiment: Experiment): number => {
  const { metrics, successCriteria } = experiment;
  const { targetMetrics } = successCriteria;
  
  const targetROI = targetMetrics.roi || 1;
  const actualROI = metrics.roi;
  
  if (targetROI === 0) return 50;
  
  const roiRatio = actualROI / targetROI;
  return Math.min(100, roiRatio * 100);
};

const calculateQualityScore = (experiment: Experiment): number => {
  const { metrics } = experiment;
  
  // Calculate quality based on conversion rate and click-through rate
  const conversionQuality = Math.min(100, metrics.conversionRate * 10); // Scale up conversion rate
  const clickQuality = Math.min(100, metrics.ctr * 5); // Scale up CTR
  
  // If we have meetings booked, that's a quality indicator
  const meetingQuality = metrics.meetingsBooked > 0 ? 80 : 40;
  
  return (conversionQuality + clickQuality + meetingQuality) / 3;
};

// Helper function to calculate ROI based on meetings and cost
export const calculateROI = (meetingsBooked: number, cost: number): number => {
  if (cost === 0) return 0;
  
  const valuePerMeeting = 240000 * 0.03; // $7,200 per meeting
  const totalValue = meetingsBooked * valuePerMeeting;
  const roi = ((totalValue - cost) / cost) * 100;
  
  return Math.max(0, roi); // ROI cannot be negative
};

// Helper function to determine if an experiment is successful
export const isExperimentSuccessful = (experiment: Experiment): boolean => {
  const successScore = calculateSuccessScore(experiment);
  return successScore.score >= 70; // 70% threshold for success
};

// Helper function to get success status
export const getSuccessStatus = (experiment: Experiment): 'excellent' | 'good' | 'fair' | 'poor' => {
  const successScore = calculateSuccessScore(experiment);
  
  if (successScore.score >= 85) return 'excellent';
  if (successScore.score >= 70) return 'good';
  if (successScore.score >= 50) return 'fair';
  return 'poor';
}; 