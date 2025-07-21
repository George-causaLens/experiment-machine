import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpenIcon, 
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  XMarkIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Blueprint } from '../types';

interface CreateBlueprintProps {
  onAddBlueprint: (blueprint: Omit<Blueprint, 'id' | 'createdAt' | 'lastUsed'>) => Promise<boolean>;
}

const CreateBlueprint: React.FC<CreateBlueprintProps> = ({ onAddBlueprint }) => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: [] as string[],
    targetRoles: [] as string[],
    companySize: [] as string[],
    companyRevenue: [] as string[],
    painPoints: [] as string[],
    automation: '',
    valueProposition: ''
  });

  const [newTargetRole, setNewTargetRole] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [newCompanySize, setNewCompanySize] = useState('');
  const [newCompanyRevenue, setNewCompanyRevenue] = useState('');
  const [newPainPoint, setNewPainPoint] = useState('');

  // Predefined options for dropdowns (same as ICP profile creation)
  const predefinedJobTitles = [
    // CROSS-INDUSTRY (Operational + Analytical Titles)
    { group: 'CROSS-INDUSTRY (Operational + Analytical Titles)', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Operating Officer (COO)',
    'Chief Transformation Officer (CTO)',
    'Chief Supply Chain Officer (CSCO)',
    'Chief Commercial Officer (CCO)',
    'Chief Financial Officer (CFO)',
    'Chief Analytics Officer (CAO)',
    'Chief Data Officer (CDO)',
    'Chief Technology Officer (CTO)',
    'Chief Information Officer (CIO)',
    { group: 'C-1 to C-3 (Operational Leadership)', type: 'subheader' },
    'VP / SVP / Director of Operations',
    'VP / Director of Supply Chain',
    'VP / Director of Process Excellence / Operational Excellence',
    'VP / Director of Commercial Operations',
    'VP / Director of Shared Services / Business Services',
    'VP / Director of Global Business Services (GBS)',
    'VP / Director of Digital Transformation',
    'VP / Director of Procurement Operations',
    'Head of Business Process Automation / Intelligent Automation',
    { group: 'C-1 to C-3 (Analytical Leadership)', type: 'subheader' },
    'VP / Director of Analytics & Insights',
    'VP / Director of Data Science',
    'VP / Director of Reporting & BI',
    'VP / Director of Forecasting / Planning & Analysis',
    'Head of Advanced Analytics',
    'Head of Data Platforms / Engineering',
    { group: 'RETAIL / CPG', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Merchandising Officer',
    'Chief Supply Chain Officer',
    'Chief Marketing Officer (for campaign analytics ops)',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Demand Planning',
    'VP / Director of Inventory & Logistics',
    'Director of Retail Operations',
    'Director of Marketing Analytics',
    'Head of Category Insights',
    'Director of Trade Promotion Effectiveness',
    'Head of Sales & Channel Performance',
    { group: 'PHARMACEUTICALS', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Commercial Officer',
    'Chief Medical Officer (for clinical ops)',
    'Chief Scientific Officer',
    'Chief Operating Officer (often covers both R&D and Commercial Ops)',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Clinical Operations',
    'VP / Director of R&D Operations',
    'VP / Director of Commercial Excellence',
    'VP / Director of Medical Affairs Operations',
    'Director of Field Force Effectiveness',
    { group: 'FINANCIAL SERVICES', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Risk Officer (CRO)',
    'Chief Underwriting Officer (Insurance)',
    'Chief Operating Officer',
    'Chief Analytics Officer',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Risk & Compliance Operations',
    'VP / Director of Credit Analytics',
    'Director of Fraud & Financial Crime Analytics',
    'VP / Director of Claims Operations (Insurance)',
    'Director of Customer Intelligence',
    'Head of Financial Planning & Analysis (FP&A)',
    'Head of Regulatory Reporting Automation',
    { group: 'MANUFACTURING / INDUSTRIALS', type: 'header' },
    { group: 'C-suite', type: 'subheader' },
    'Chief Supply Chain Officer',
    'Chief Operations Officer',
    'Chief Manufacturing Officer',
    'Chief Digital Officer / CIO',
    { group: 'C-1 to C-3', type: 'subheader' },
    'VP / Director of Supply Chain Analytics',
    'VP / Director of Manufacturing Excellence',
    'Director of Quality Analytics'
  ];

  const predefinedCompanyRevenue = [
    'Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', '$100M - $500M',
    '$500M - $1B', '$1B - $5B', '$5B - $10B', '$10B+'
  ];

  const predefinedPainPoints = [
    // General Pain Points (Operational + Analytical)
    { group: 'General Pain Points (Operational + Analytical)', type: 'header' },
    'Operational efficiency',
    'Process automation',
    'Manual reporting',
    'Forecasting inaccuracy',
    'Delayed insights',
    'Siloed data',
    'Decision latency',
    'High labor costs',
    'Workflow bottlenecks',
    'Repetitive tasks',
    'Tool sprawl',
    'Poor data quality',
    'Slow time-to-value',
    'Legacy systems',
    'Resource constraints',
    'Insight inactionability',
    'Compliance risk',
    'Scaling limitations',
    'Human error',
    'Audit complexity',
    'Change resistance',
    'Demand unpredictability',
    'Data overload',
    'Underused analytics',
    'Inefficient handoffs',
    'Analyst dependency',
    { group: 'Retail / CPG Pain Points', type: 'header' },
    'Demand volatility',
    'Inventory imbalances',
    'Trade inefficiency',
    'Merchandising delays',
    'Pricing complexity',
    'Promotion performance',
    'Supply disruptions',
    'Channel misalignment',
    'Sales forecasting gaps',
    'Planogram inefficiency',
    'SKU proliferation',
    'Store execution gaps',
    { group: 'Pharmaceuticals Pain Points', type: 'header' },
    'Trial enrollment delays',
    'Field force inefficiency',
    'Commercial waste',
    'Market access complexity',
    'Regulatory overhead',
    'R&D cycle time',
    'Site activation delays',
    'HCP targeting issues',
    'Data integration issues',
    'Launch forecasting gaps',
    'Medical affairs backlog',
    'Compliance documentation',
    { group: 'Financial Services Pain Points', type: 'header' },
    'Risk exposure',
    'Manual underwriting',
    'Claims backlog',
    'Fraud detection delays',
    'Credit scoring gaps',
    'KYC inefficiency',
    'Regulatory reporting',
    'Policy churn analysis',
    'Customer attrition risk',
    'Branch performance gaps',
    'Audit trail gaps',
    'Pricing inconsistency',
    { group: 'Manufacturing / Industrials Pain Points', type: 'header' },
    'Downtime prediction',
    'Root cause delay',
    'Quality variation',
    'Maintenance inefficiency',
    'Throughput stagnation',
    'Supply planning errors',
    'Parts inventory bloat',
    'Procurement delays',
    'Schedule variability',
    'Energy inefficiency',
    'Waste identification',
    'Equipment failure'
  ];

  const addItem = (field: 'targetRoles' | 'companyRevenue' | 'painPoints' | 'industry' | 'companySize', value: string, setter: (value: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: 'targetRoles' | 'companyRevenue' | 'painPoints' | 'industry' | 'companySize', itemToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== itemToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (formData.industry.length === 0) {
      alert('Please select at least one industry');
      return;
    }
    
    if (formData.companySize.length === 0) {
      alert('Please select at least one company size');
      return;
    }
    
    const newBlueprint = {
      name: formData.name,
      description: formData.description,
      industry: formData.industry,
      targetRoles: formData.targetRoles,
      companySize: formData.companySize,
      companyRevenue: formData.companyRevenue,
      painPoints: formData.painPoints,
      automation: formData.automation,
      valueProposition: formData.valueProposition,
      successRate: 0,
      avgRoi: 0,
      avgMeetingsBooked: 0,
      totalRevenue: 0,
      conversionRate: 0,
      tags: [],
      usageCount: 0,
      relatedExperiments: []
    };

    const result = await onAddBlueprint(newBlueprint);
    if (!result) {
      alert('Failed to create blueprint. Please check your input or try again.');
      return;
    }
    navigate('/blueprints');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/blueprints')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Blueprints
        </button>
        <div className="flex items-center">
          <BookOpenIcon className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Create New Blueprint</h1>
        </div>
        <p className="text-gray-600 mt-2">Create a new business use case blueprint</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blueprint Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Manufacturing COO Document Automation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={newIndustry}
                onChange={(e) => setNewIndustry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Industry</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Technology">Technology</option>
                <option value="Retail">Retail</option>
                <option value="Education">Education</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </select>
              <button
                type="button"
                onClick={() => addItem('industry', newIndustry, setNewIndustry)}
                className="btn-secondary mt-2"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Size *
              </label>
              <select
                value={newCompanySize}
                onChange={(e) => setNewCompanySize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Company Size</option>
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="501-1000 employees">501-1000 employees</option>
                <option value="1001-5000 employees">1001-5000 employees</option>
                <option value="5001-10000 employees">5001-10000 employees</option>
                <option value="10000+ employees">10000+ employees</option>
              </select>
              <button
                type="button"
                onClick={() => addItem('companySize', newCompanySize, setNewCompanySize)}
                className="btn-secondary mt-2"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe the business use case and value proposition..."
            />
          </div>
        </div>

        {/* Selected Industries */}
        {formData.industry.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
              Selected Industries
            </h2>
            <div className="flex flex-wrap gap-2">
              {formData.industry.map((industry, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {industry}
                  <button
                    type="button"
                    onClick={() => removeItem('industry', industry)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Selected Company Sizes */}
        {formData.companySize.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UsersIcon className="w-5 h-5 mr-2 text-primary-600" />
              Selected Company Sizes
            </h2>
            <div className="flex flex-wrap gap-2">
              {formData.companySize.map((size, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeItem('companySize', size)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Target Roles */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2 text-primary-600" />
            Target Roles
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newTargetRole}
                onChange={(e) => setNewTargetRole(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select from predefined options</option>
                {predefinedJobTitles.map((item, index) => {
                  if (typeof item === 'string') {
                    return <option key={index} value={item}>{item}</option>;
                  } else if (item.type === 'header') {
                    return <optgroup key={index} label={item.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                  } else if (item.type === 'subheader') {
                    return <optgroup key={index} label={item.group} className="font-semibold text-gray-700 bg-gray-50"></optgroup>;
                  }
                  return null;
                })}
              </select>
              <button
                type="button"
                onClick={() => addItem('targetRoles', newTargetRole, setNewTargetRole)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.targetRoles.map((role, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                >
                  {role}
                  <button
                    type="button"
                    onClick={() => removeItem('targetRoles', role)}
                    className="ml-2 text-primary-600 hover:text-primary-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Company Revenue */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2 text-primary-600" />
            Company Revenue
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newCompanyRevenue}
                onChange={(e) => setNewCompanyRevenue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select revenue range</option>
                {predefinedCompanyRevenue.map(revenue => (
                  <option key={revenue} value={revenue}>{revenue}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => addItem('companyRevenue', newCompanyRevenue, setNewCompanyRevenue)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.companyRevenue.map((revenue, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                >
                  {revenue}
                  <button
                    type="button"
                    onClick={() => removeItem('companyRevenue', revenue)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pain Points */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-primary-600" />
            Pain Points
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <select
                value={newPainPoint}
                onChange={(e) => setNewPainPoint(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select pain point</option>
                {predefinedPainPoints.map(pain => {
                  if (typeof pain === 'string') {
                    return <option key={pain} value={pain}>{pain}</option>;
                  } else if (pain.type === 'header') {
                    return <optgroup key={pain.group} label={pain.group} className="font-bold text-gray-900 bg-gray-100"></optgroup>;
                  } else if (pain.type === 'subheader') {
                    return <optgroup key={pain.group} label={pain.group} className="font-semibold text-gray-700 bg-gray-50"></optgroup>;
                  }
                  return null;
                })}
              </select>
              <button
                type="button"
                onClick={() => addItem('painPoints', newPainPoint, setNewPainPoint)}
                className="btn-secondary"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.painPoints.map((pain, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {pain}
                  <button
                    type="button"
                    onClick={() => removeItem('painPoints', pain)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Automation & Value */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Automation & Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Automation Process *
              </label>
              <input
                type="text"
                required
                value={formData.automation}
                onChange={(e) => setFormData(prev => ({ ...prev, automation: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., PDF → Categorization automation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value Proposition *
              </label>
              <input
                type="text"
                required
                value={formData.valueProposition}
                onChange={(e) => setFormData(prev => ({ ...prev, valueProposition: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., $50M annual value through streamlined processing"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/blueprints')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Create Blueprint
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlueprint; 