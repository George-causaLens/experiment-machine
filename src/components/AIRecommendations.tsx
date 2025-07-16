import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LightBulbIcon, ArrowRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { AIRecommendation, Experiment, Blueprint } from '../types';
import { RecommendationEngine } from '../services/recommendationEngine';

interface AIRecommendationsProps {
  experiments: Experiment[];
  blueprints: Blueprint[];
  onAddExperiment: (experiment: Experiment) => void;
  onAddBlueprint: (blueprint: Blueprint) => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ 
  experiments, 
  blueprints, 
  onAddExperiment, 
  onAddBlueprint 
}) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate dynamic recommendations based on current data
    const generateRecommendations = () => {
      setIsLoading(true);
      
      try {
        const recommendationEngine = new RecommendationEngine();
        const dynamicRecommendations = recommendationEngine.generateRecommendations(experiments, blueprints);
        setRecommendations(dynamicRecommendations);
      } catch (error) {
        // Handle error silently or show user-friendly message
        // Fallback to empty recommendations
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    generateRecommendations();
  }, [experiments, blueprints]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <LightBulbIcon className="w-6 h-6 text-warning-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
            <SparklesIcon className="w-3 h-3 mr-1" />
            AI Powered
          </span>
        </div>
        
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-3 animate-pulse">
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no recommendations
  if (recommendations.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <LightBulbIcon className="w-6 h-6 text-warning-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
          </div>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
            <SparklesIcon className="w-3 h-3 mr-1" />
            AI Powered
          </span>
        </div>
        
        <div className="text-center py-4">
          <LightBulbIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No recommendations available yet</p>
          <p className="text-xs text-gray-400">Create more experiments to get AI-powered suggestions</p>
        </div>
      </div>
    );
  }

  const handleCreateExperiment = (recommendation: AIRecommendation) => {
    // Navigate to create experiment with AI recommendation pre-filled
    navigate('/experiments/create', { 
      state: { 
        aiRecommendation: recommendation,
        mode: 'ai-suggestion'
      } 
    });
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <LightBulbIcon className="w-6 h-6 text-warning-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
          <SparklesIcon className="w-3 h-3 mr-1" />
          AI Powered
        </span>
      </div>
      
      <div className="space-y-4">
        {recommendations.map((recommendation, index) => (
          <div
            key={recommendation.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  recommendation.type === 'blueprint-match' ? 'bg-primary-100 text-primary-800' :
                  recommendation.type === 'experiment-replication' ? 'bg-success-100 text-success-800' :
                  recommendation.type === 'optimization' ? 'bg-warning-100 text-warning-800' :
                  'bg-danger-100 text-danger-800'
                }`}>
                  {recommendation.type === 'blueprint-match' ? 'Blueprint Match' :
                   recommendation.type === 'experiment-replication' ? 'Replicate Strategy' :
                   recommendation.type === 'optimization' ? 'Optimize' : 'New Blueprint'}
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  {recommendation.confidence}% confidence
                </span>
              </div>
            </div>
            
            <h4 className="font-medium text-gray-900 mb-1">{recommendation.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
            
            <div className="space-y-2">
              <div className="text-xs text-gray-500">
                <strong>Expected Outcome:</strong> {recommendation.expectedOutcome}
              </div>
              
              {recommendation.suggestedVariables.length > 0 && (
                <div className="text-xs">
                  <strong className="text-gray-700">Suggested Variables:</strong>
                  <div className="mt-1 space-y-1">
                    {recommendation.suggestedVariables.map((variable, idx) => (
                      <div key={idx} className="flex items-center text-gray-600">
                        <span className="font-medium">{variable.name}:</span>
                        <span className="ml-1">{variable.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                onClick={() => handleCreateExperiment(recommendation)}
              >
                Create Experiment
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button 
          className="w-full text-sm text-primary-600 hover:text-primary-700 font-medium"
          onClick={() => navigate('/ai-recommendations')}
        >
          View All Recommendations →
        </button>
      </div>
    </div>
  );
};

export default AIRecommendations; 