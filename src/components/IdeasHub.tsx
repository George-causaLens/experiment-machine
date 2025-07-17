import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  TrashIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Idea } from '../types';
import { DataService } from '../services/dataService';

interface IdeasHubProps {
  onAddExperiment: (experiment: any) => void;
}

const IdeasHub: React.FC<IdeasHubProps> = ({ onAddExperiment }) => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    setLoading(true);
    const ideasData = await DataService.getIdeas();
    setIdeas(ideasData);
    setLoading(false);
  };

  const handleDeleteIdea = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      const success = await DataService.deleteIdea(id);
      if (success) {
        setIdeas(ideas.filter(idea => idea.id !== id));
      }
    }
  };

  const handleCreateExperiment = (idea: Idea) => {
    // Navigate to create experiment with idea data pre-filled
    navigate('/experiments/create', {
      state: {
        selectedIdea: idea,
        mode: 'from-idea'
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high': return 'bg-purple-100 text-purple-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-emerald-100 text-emerald-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredIdeas = ideas.filter(idea =>
    idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (idea.description && idea.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading ideas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ideas Hub</h1>
          <p className="text-gray-600">Capture and organize experiment ideas before turning them into reality</p>
        </div>
        <button 
          onClick={() => navigate('/ideas/create')}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Idea
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search ideas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIdeas.map((idea, index) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.name}</h3>
                {idea.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {truncateDescription(idea.description)}
                  </p>
                )}
                
                {/* Priority, Effort, Impact badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(idea.priority)}`}>
                    Priority: {idea.priority}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEffortColor(idea.effort)}`}>
                    Effort: {idea.effort}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(idea.impact)}`}>
                    Impact: {idea.impact}
                  </span>
                </div>

                {/* URLs */}
                {idea.urls && idea.urls.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-500 mb-2">Links:</div>
                    <div className="space-y-1">
                      {idea.urls.slice(0, 2).map((url, urlIndex) => (
                        <a
                          key={urlIndex}
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-xs text-primary-600 hover:text-primary-800"
                        >
                          <ArrowTopRightOnSquareIcon className="w-3 h-3 mr-1" />
                          {url.title || 'Link'}
                        </a>
                      ))}
                      {idea.urls.length > 2 && (
                        <span className="text-xs text-gray-500">+{idea.urls.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Criteria summary */}
                <div className="text-xs text-gray-500 mb-4">
                  {idea.targetRoles.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium">Target:</span> {idea.targetRoles.slice(0, 2).join(', ')}
                      {idea.targetRoles.length > 2 && '...'}
                    </div>
                  )}
                  {idea.industries.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium">Industries:</span> {idea.industries.slice(0, 2).join(', ')}
                      {idea.industries.length > 2 && '...'}
                    </div>
                  )}
                  {idea.distributionChannels.length > 0 && (
                    <div>
                      <span className="font-medium">Channels:</span> {idea.distributionChannels.slice(0, 2).join(', ')}
                      {idea.distributionChannels.length > 2 && '...'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {new Date(idea.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleCreateExperiment(idea)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Create Experiment
                </button>
                <button
                  onClick={() => navigate(`/ideas/${idea.id}/edit`)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteIdea(idea.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first experiment idea'
            }
          </p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/ideas/create')}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Idea
          </button>
        </div>
      )}
    </div>
  );
};

export default IdeasHub; 