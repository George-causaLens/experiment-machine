import { Experiment, Blueprint, AIRecommendation, ExperimentVariable } from '../types';
import { PerformanceAnalyzer, ICPPerformance } from './performanceAnalyzer';

export class RecommendationEngine {
  private analyzer: PerformanceAnalyzer;

  constructor() {
    this.analyzer = new PerformanceAnalyzer();
  }

  /**
   * Generate all types of recommendations
   */
  generateRecommendations(experiments: Experiment[], blueprints: Blueprint[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];

    // Generate different types of recommendations
    const blueprintMatches = this.generateBlueprintMatches(experiments, blueprints);
    const replications = this.generateReplications(experiments);
    const optimizations = this.generateOptimizations(experiments);
    const newBlueprints = this.generateNewBlueprints(experiments, blueprints);

    recommendations.push(...blueprintMatches);
    recommendations.push(...replications);
    recommendations.push(...optimizations);
    recommendations.push(...newBlueprints);

    // Sort by confidence and return top recommendations
    const sortedRecommendations = recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Return top 5 recommendations

    return sortedRecommendations;
  }

  /**
   * Generate blueprint match recommendations
   * Find successful experiments and suggest applying similar strategies to new ICPs
   */
  generateBlueprintMatches(experiments: Experiment[], blueprints: Blueprint[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    if (experiments.length === 0 || blueprints.length === 0) {
      return recommendations;
    }

    const topPerformingExperiments = this.analyzer.findTopPerformingExperiments(experiments, 3);
    const icpPerformance = this.analyzer.analyzeICPPerformance(experiments);
    const untappedICPs = this.analyzer.findUntappedICPs(experiments, blueprints);

    // For each top-performing experiment, suggest applying to untapped ICPs
    topPerformingExperiments.forEach((topExp, index) => {
      if (untappedICPs.length === 0) {
        // If no untapped ICPs, suggest scaling the successful strategy to new channels
        const confidence = Math.min(95, (topExp.successScore || 0) + 10);
        
        recommendations.push({
          id: `blueprint-scale-${Date.now()}-${index}`,
          type: 'blueprint-match',
          title: `Scale ${topExp.outreachStrategies[0] || 'Strategy'} Success`,
          description: `Your ${topExp.outreachStrategies[0] || 'strategy'} shows ${Math.round(topExp.successScore || 0)}% success rate. Consider scaling this approach to new channels or content variations.`,
          confidence,
          reasoning: `Historical data shows ${topExp.outreachStrategies[0] || 'strategy'} performs well with ${topExp.targetAudience}. Scaling to new channels could increase reach.`,
          suggestedVariables: this.extractVariablesFromExperiment(topExp),
          expectedOutcome: `Expected ${Math.round(topExp.successScore || 0) * 0.8}-${Math.round(topExp.successScore || 0) * 1.2}% success rate with similar ROI patterns`,
          relatedBlueprints: [topExp.blueprintId],
          relatedExperiments: [topExp.id]
        });
        return;
      }

      // Find the best untapped ICP to target
      const targetICP = untappedICPs[0]; // Could be enhanced with more sophisticated matching
      
      const confidence = this.calculateBlueprintMatchConfidence(topExp, targetICP, icpPerformance);
      
      if (confidence > 60) { // Only recommend if confidence is reasonable
        recommendations.push({
          id: `blueprint-match-${Date.now()}-${index}`,
          type: 'blueprint-match',
          title: `Apply ${topExp.outreachStrategies[0] || 'Strategy'} to ${targetICP}`,
          description: `Your ${topExp.outreachStrategies[0] || 'strategy'} shows ${Math.round(topExp.successScore || 0)}% success rate. Apply similar approach to ${targetICP} for potential high performance.`,
          confidence,
          reasoning: `Historical data shows ${topExp.outreachStrategies[0] || 'strategy'} performs well with ${topExp.targetAudience}. Similar approach should work for ${targetICP}.`,
          suggestedVariables: this.extractVariablesFromExperiment(topExp),
          expectedOutcome: `Expected ${Math.round(topExp.successScore || 0) * 0.8}-${Math.round(topExp.successScore || 0) * 1.2}% success rate with similar ROI patterns`,
          relatedBlueprints: [topExp.blueprintId],
          relatedExperiments: [topExp.id]
        });
      }
    });

    return recommendations;
  }

  /**
   * Generate experiment replication recommendations
   * Find successful patterns and suggest replicating them
   */
  generateReplications(experiments: Experiment[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    if (experiments.length === 0) {
      return recommendations;
    }

    const channelPerformance = this.analyzer.analyzeChannelPerformance(experiments);
    const strategyPerformance = this.analyzer.analyzeStrategyPerformance(experiments);
    const topPerformingExperiments = this.analyzer.findTopPerformingExperiments(experiments, 3);

    // Find best performing channels and strategies
    const bestChannel = channelPerformance[0];
    const bestStrategy = strategyPerformance[0];

    if (bestChannel && bestChannel.successRate > 70) {
      const confidence = Math.min(95, bestChannel.successRate + 10);
      
      recommendations.push({
        id: `replication-channel-${Date.now()}`,
        type: 'experiment-replication',
        title: `Scale ${bestChannel.channel} Success`,
        description: `Your ${bestChannel.channel} campaigns show ${Math.round(bestChannel.successRate)}% success rate. Consider scaling this channel with new ICPs or content variations.`,
        confidence,
        reasoning: `${bestChannel.channel} has consistently high performance with ${bestChannel.totalMeetings} total meetings booked and ${Math.round(bestChannel.avgROI)}x average ROI.`,
        suggestedVariables: [
          { name: 'Distribution Channel', value: bestChannel.channel, type: 'channel' },
          { name: 'Scale Strategy', value: 'Expand to new ICPs with same channel', type: 'other' }
        ],
        expectedOutcome: `Expected ${Math.round(bestChannel.successRate * 0.8)}-${Math.round(bestChannel.successRate * 1.2)}% success rate with similar ROI`,
        relatedBlueprints: bestChannel.experiments.map(exp => exp.blueprintId),
        relatedExperiments: bestChannel.experiments.map(exp => exp.id)
      });
    }

    if (bestStrategy && bestStrategy.successRate > 70) {
      const confidence = Math.min(95, bestStrategy.successRate + 10);
      
      recommendations.push({
        id: `replication-strategy-${Date.now()}`,
        type: 'experiment-replication',
        title: `Replicate ${bestStrategy.strategy} Success`,
        description: `Your ${bestStrategy.strategy} approach shows ${Math.round(bestStrategy.successRate)}% success rate. Apply this strategy to new channels or ICPs.`,
        confidence,
        reasoning: `${bestStrategy.strategy} has proven effective with ${bestStrategy.totalMeetings} meetings booked and ${Math.round(bestStrategy.avgROI)}x average ROI.`,
        suggestedVariables: [
          { name: 'Outreach Strategy', value: bestStrategy.strategy, type: 'other' },
          { name: 'Replication Focus', value: 'Apply to new channels/ICPs', type: 'other' }
        ],
        expectedOutcome: `Expected ${Math.round(bestStrategy.successRate * 0.8)}-${Math.round(bestStrategy.successRate * 1.2)}% success rate with similar performance`,
        relatedBlueprints: bestStrategy.experiments.map(exp => exp.blueprintId),
        relatedExperiments: bestStrategy.experiments.map(exp => exp.id)
      });
    }

    return recommendations;
  }

  /**
   * Generate optimization recommendations
   * Find underperforming experiments and suggest improvements
   */
  generateOptimizations(experiments: Experiment[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    if (experiments.length === 0) {
      return recommendations;
    }

    const underperformingExperiments = this.analyzer.findUnderperformingExperiments(experiments, 3);
    const topPerformingExperiments = this.analyzer.findTopPerformingExperiments(experiments, 3);
    const channelPerformance = this.analyzer.analyzeChannelPerformance(experiments);

    underperformingExperiments.forEach((underExp, index) => {
      // Find what's working for similar experiments
      const similarSuccessfulExp = this.findSimilarSuccessfulExperiment(underExp, topPerformingExperiments);
      
      if (similarSuccessfulExp) {
        const confidence = this.calculateOptimizationConfidence(underExp, similarSuccessfulExp);
        
        if (confidence > 50) {
          recommendations.push({
            id: `optimization-${Date.now()}-${index}`,
            type: 'optimization',
            title: `Optimize ${underExp.name}`,
            description: `Your experiment "${underExp.name}" is underperforming (${Math.round(underExp.successScore || 0)}% success). Apply successful patterns from similar experiments.`,
            confidence,
            reasoning: `Similar experiments using ${similarSuccessfulExp.outreachStrategies[0] || 'strategy'} show ${Math.round(similarSuccessfulExp.successScore || 0)}% success rate. Consider adopting similar approach.`,
            suggestedVariables: this.generateOptimizationVariables(underExp, similarSuccessfulExp),
            expectedOutcome: `Expected improvement from ${Math.round(underExp.successScore || 0)}% to ${Math.round(similarSuccessfulExp.successScore || 0) * 0.8}% success rate`,
            relatedBlueprints: [underExp.blueprintId, similarSuccessfulExp.blueprintId],
            relatedExperiments: [underExp.id, similarSuccessfulExp.id]
          });
        }
      }
    });

    return recommendations;
  }

  /**
   * Generate new blueprint recommendations
   * Identify untapped opportunities
   */
  generateNewBlueprints(experiments: Experiment[], blueprints: Blueprint[]): AIRecommendation[] {
    const recommendations: AIRecommendation[] = [];
    
    if (experiments.length === 0) {
      return recommendations;
    }

    const untappedICPs = this.analyzer.findUntappedICPs(experiments, blueprints);
    const channelPerformance = this.analyzer.analyzeChannelPerformance(experiments);
    const strategyPerformance = this.analyzer.analyzeStrategyPerformance(experiments);

    // Find best performing channel and strategy for new ICPs
    const bestChannel = channelPerformance[0];
    const bestStrategy = strategyPerformance[0];

    untappedICPs.slice(0, 2).forEach((icp, index) => {
      if (bestChannel && bestStrategy) {
        const confidence = Math.min(85, (bestChannel.successRate + bestStrategy.successRate) / 2);
        
        recommendations.push({
          id: `new-blueprint-${Date.now()}-${index}`,
          type: 'new-blueprint',
          title: `Create Blueprint for ${icp}`,
          description: `You haven't targeted ${icp} yet. Create a new blueprint using your best-performing ${bestChannel.channel} and ${bestStrategy.strategy} approaches.`,
          confidence,
          reasoning: `Your ${bestChannel.channel} campaigns show ${Math.round(bestChannel.successRate)}% success and ${bestStrategy.strategy} shows ${Math.round(bestStrategy.successRate)}% success. Combining these for ${icp} could be effective.`,
          suggestedVariables: [
            { name: 'Target ICP', value: icp, type: 'icp' },
            { name: 'Distribution Channel', value: bestChannel.channel, type: 'channel' },
            { name: 'Outreach Strategy', value: bestStrategy.strategy, type: 'other' }
          ],
          expectedOutcome: `Expected ${Math.round(confidence * 0.8)}-${Math.round(confidence * 1.2)}% success rate based on similar approaches`,
          relatedBlueprints: [],
          relatedExperiments: [...bestChannel.experiments.map(exp => exp.id), ...bestStrategy.experiments.map(exp => exp.id)]
        });
      }
    });

    return recommendations;
  }

  /**
   * Calculate confidence for blueprint match recommendations
   */
  private calculateBlueprintMatchConfidence(
    topExperiment: Experiment, 
    targetICP: string, 
    icpPerformance: ICPPerformance[]
  ): number {
    let confidence = 70; // Base confidence
    
    // Boost confidence if the experiment has high success score
    if (topExperiment.successScore && topExperiment.successScore > 80) {
      confidence += 10;
    }
    
    // Boost confidence if similar ICPs perform well
    const similarICP = icpPerformance.find(icp => 
      icp.role === this.extractRoleFromICP(targetICP) || 
      icp.industry === this.extractIndustryFromICP(targetICP)
    );
    
    if (similarICP && similarICP.successRate > 70) {
      confidence += 15;
    }
    
    return Math.min(95, confidence);
  }

  /**
   * Calculate confidence for optimization recommendations
   */
  private calculateOptimizationConfidence(
    underperformingExp: Experiment, 
    successfulExp: Experiment
  ): number {
    let confidence = 60; // Base confidence
    
    // Boost confidence if successful experiment has much higher success score
    const successGap = (successfulExp.successScore || 0) - (underperformingExp.successScore || 0);
    if (successGap > 30) {
      confidence += 20;
    }
    
    // Boost confidence if they target similar ICPs
    if (this.areSimilarICPs(underperformingExp.targetAudience, successfulExp.targetAudience)) {
      confidence += 15;
    }
    
    return Math.min(95, confidence);
  }

  /**
   * Extract variables from an experiment for recommendations
   */
  private extractVariablesFromExperiment(experiment: Experiment): ExperimentVariable[] {
    const variables: ExperimentVariable[] = [
              { name: 'Outreach Strategy', value: experiment.outreachStrategies[0] || '', type: 'other' },
              { name: 'Distribution Channel', value: experiment.distributionChannels[0] || '', type: 'channel' }
    ];

    if (experiment.messaging) {
      variables.push({ name: 'Messaging Focus', value: experiment.messaging, type: 'messaging' });
    }

    if (experiment.content) {
      variables.push({ name: 'Content Type', value: experiment.content, type: 'content' });
    }

    return variables;
  }

  /**
   * Generate optimization variables based on successful experiment
   */
  private generateOptimizationVariables(
    underperformingExp: Experiment, 
    successfulExp: Experiment
  ): ExperimentVariable[] {
    const variables: ExperimentVariable[] = [];

    // Suggest adopting successful strategy if different
          if (underperformingExp.outreachStrategies[0] !== successfulExp.outreachStrategies[0]) {
        variables.push({
          name: 'Outreach Strategy',
          value: successfulExp.outreachStrategies[0] || '', 
        type: 'other' 
      });
    }

    // Suggest adopting successful channel if different
          if (underperformingExp.distributionChannels[0] !== successfulExp.distributionChannels[0]) {
        variables.push({
          name: 'Distribution Channel',
          value: successfulExp.distributionChannels[0] || '', 
        type: 'channel' 
      });
    }

    // Suggest adopting successful messaging if different
    if (successfulExp.messaging && underperformingExp.messaging !== successfulExp.messaging) {
      variables.push({ 
        name: 'Messaging Focus', 
        value: successfulExp.messaging, 
        type: 'messaging' 
      });
    }

    return variables;
  }

  /**
   * Find similar successful experiment for optimization
   */
  private findSimilarSuccessfulExperiment(
    underperformingExp: Experiment, 
    successfulExperiments: Experiment[]
  ): Experiment | null {
    // Find experiment with same ICP but different strategy
    return successfulExperiments.find(exp => 
      this.areSimilarICPs(exp.targetAudience, underperformingExp.targetAudience) &&
              exp.outreachStrategies[0] !== underperformingExp.outreachStrategies[0]
    ) || null;
  }

  /**
   * Check if two ICPs are similar
   */
  private areSimilarICPs(icp1: string, icp2: string): boolean {
    const role1 = this.extractRoleFromICP(icp1);
    const role2 = this.extractRoleFromICP(icp2);
    const industry1 = this.extractIndustryFromICP(icp1);
    const industry2 = this.extractIndustryFromICP(icp2);
    
    return role1 === role2 || industry1 === industry2;
  }

  /**
   * Extract role from ICP string
   */
  private extractRoleFromICP(icp: string): string {
    const parts = icp.split(' at ');
    return parts[0] || '';
  }

  /**
   * Extract industry from ICP string
   */
  private extractIndustryFromICP(icp: string): string {
    const parts = icp.split(' companies in ');
    return parts[1] || '';
  }
} 