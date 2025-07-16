import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { ICPProfile } from '../types';

interface ICPProfileManagerProps {
  icpProfiles: ICPProfile[];
  onAddICPProfile: (profile: ICPProfile) => void;
  onUpdateICPProfile: (id: string, updates: Partial<ICPProfile>) => void;
  onDeleteICPProfile: (id: string) => void;
}

const ICPProfileManager: React.FC<ICPProfileManagerProps> = ({ 
  icpProfiles, 
  onAddICPProfile, 
  onUpdateICPProfile, 
  onDeleteICPProfile 
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedJobTitle, setSelectedJobTitle] = useState('');

  // Filter profiles based on search and filters
  const filteredProfiles = icpProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.jobTitles.some(title => title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         profile.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = !selectedIndustry || profile.industries.includes(selectedIndustry);
    const matchesJobTitle = !selectedJobTitle || profile.jobTitles.includes(selectedJobTitle);
    
    return matchesSearch && matchesIndustry && matchesJobTitle;
  });

  // Get unique values for filters
  const allIndustries = Array.from(new Set(icpProfiles.flatMap(profile => profile.industries)));
  const allJobTitles = Array.from(new Set(icpProfiles.flatMap(profile => profile.jobTitles)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <UserGroupIcon className="w-8 h-8 text-primary-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ICP Profiles</h1>
            <p className="text-gray-600">Manage your Ideal Customer Profiles</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'grid' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'list' 
                ? 'bg-primary-100 text-primary-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List
          </button>
          <button
            onClick={() => navigate('/icp-profiles/create')}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create ICP Profile
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ICP profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            showFilters 
              ? 'bg-primary-100 text-primary-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FunnelIcon className="w-4 h-4 mr-2" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Industries</option>
                {allIndustries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <select
                value={selectedJobTitle}
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Job Titles</option>
                {allJobTitles.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ICP Profiles Content */}
      {viewMode === 'list' ? (
        /* List View */
        <div className="space-y-4">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <UserGroupIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {profile.usageCount} uses
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{profile.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-1">
                        <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.industries.slice(0, 2).join(', ')}</span>
                        {profile.industries.length > 2 && (
                          <span className="text-gray-400">+{profile.industries.length - 2}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.geographies.slice(0, 2).join(', ')}</span>
                        {profile.geographies.length > 2 && (
                          <span className="text-gray-400">+{profile.geographies.length - 2}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <CurrencyDollarIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.companyRevenue.slice(0, 2).join(', ')}</span>
                        {profile.companyRevenue.length > 2 && (
                          <span className="text-gray-400">+{profile.companyRevenue.length - 2}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/icp-profiles/${profile.id}/edit`)}
                    className="btn-secondary text-sm"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteICPProfile(profile.id)}
                    className="btn-danger text-sm"
                  >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <div key={profile.id} className="card hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {profile.usageCount} uses
                </span>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{profile.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{profile.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-1 text-xs">
                  <BuildingOfficeIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{profile.industries.slice(0, 2).join(', ')}</span>
                  {profile.industries.length > 2 && (
                    <span className="text-gray-400">+{profile.industries.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-xs">
                  <GlobeAltIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-600">{profile.geographies.slice(0, 2).join(', ')}</span>
                  {profile.geographies.length > 2 && (
                    <span className="text-gray-400">+{profile.geographies.length - 2}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                  Last used: {formatDate(profile.lastUsed)}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/icp-profiles/${profile.id}/edit`);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteICPProfile(profile.id);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ICP profiles found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedIndustry || selectedJobTitle 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first ICP profile'
            }
          </p>
          <button 
            onClick={() => navigate('/icp-profiles/create')}
            className="btn-primary"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Create ICP Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ICPProfileManager; 