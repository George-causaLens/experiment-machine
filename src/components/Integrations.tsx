import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PlusIcon,
  LinkIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Integration } from '../types';

const Integrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      type: 'hubspot',
      status: 'connected',
      lastSync: new Date('2024-01-25T10:30:00'),
      capabilities: {
        canTrackImpressions: false,
        canTrackClicks: true,
        canTrackConversions: true,
        canTrackMeetings: true,
        canTrackLeads: true,
        canTrackRevenue: true,
        canCreateCampaigns: true,
        canSyncContacts: true
      },
      config: {
        apiKey: '***',
        accountId: '123456',
        syncFrequency: '5min'
      }
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      type: 'google-analytics',
      status: 'connected',
      lastSync: new Date('2024-01-25T10:25:00'),
      capabilities: {
        canTrackImpressions: true,
        canTrackClicks: true,
        canTrackConversions: true,
        canTrackMeetings: false,
        canTrackLeads: false,
        canTrackRevenue: false,
        canCreateCampaigns: false,
        canSyncContacts: false
      },
      config: {
        propertyId: 'GA4-123456789',
        viewId: '123456789',
        syncFrequency: '1hour'
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Campaign Manager',
      type: 'linkedin',
      status: 'connected',
      lastSync: new Date('2024-01-25T09:45:00'),
      capabilities: {
        canTrackImpressions: true,
        canTrackClicks: true,
        canTrackConversions: false,
        canTrackMeetings: false,
        canTrackLeads: false,
        canTrackRevenue: false,
        canCreateCampaigns: true,
        canSyncContacts: false
      },
      config: {
        accountId: '123456789',
        accessToken: '***',
        syncFrequency: '15min'
      }
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      type: 'email',
      status: 'connected',
      lastSync: new Date('2024-01-25T08:15:00'),
      capabilities: {
        canTrackImpressions: true,
        canTrackClicks: true,
        canTrackConversions: true,
        canTrackMeetings: false,
        canTrackLeads: true,
        canTrackRevenue: false,
        canCreateCampaigns: true,
        canSyncContacts: true
      },
      config: {
        apiKey: '***',
        listId: 'abc123def456',
        syncFrequency: '30min'
      }
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'zapier',
      status: 'error',
      lastSync: new Date('2024-01-24T16:20:00'),
      capabilities: {
        canTrackImpressions: false,
        canTrackClicks: false,
        canTrackConversions: true,
        canTrackMeetings: true,
        canTrackLeads: true,
        canTrackRevenue: true,
        canCreateCampaigns: false,
        canSyncContacts: true
      },
      config: {
        webhookUrl: 'https://hooks.zapier.com/...',
        syncFrequency: 'realtime'
      }
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      type: 'other',
      status: 'disconnected',
      lastSync: new Date('2024-01-20T14:30:00'),
      capabilities: {
        canTrackImpressions: false,
        canTrackClicks: false,
        canTrackConversions: true,
        canTrackMeetings: true,
        canTrackLeads: true,
        canTrackRevenue: true,
        canCreateCampaigns: false,
        canSyncContacts: true
      },
      config: {}
    }
  ]);

  const availableIntegrations = [
    {
      id: 'hubspot',
      name: 'HubSpot CRM',
      description: 'Sync contacts, deals, and marketing data',
      icon: '🔵',
      category: 'CRM'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Track website traffic and conversion data',
      icon: '📊',
      category: 'Analytics'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Campaign Manager',
      description: 'Import campaign performance and audience data',
      icon: '💼',
      category: 'Advertising'
    },
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      description: 'Sync email campaign metrics and subscriber data',
      icon: '📧',
      category: 'Email'
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps and automate workflows',
      icon: '⚡',
      category: 'Automation'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'Sync leads, opportunities, and account data',
      icon: '☁️',
      category: 'CRM'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="w-5 h-5 text-success-600" />;
      case 'disconnected':
        return <XMarkIcon className="w-5 h-5 text-gray-400" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-danger-600" />;
      default:
        return <XMarkIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'status-active';
      case 'disconnected':
        return 'status-paused';
      case 'error':
        return 'status-failed';
      default:
        return 'status-paused';
    }
  };

  const formatLastSync = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleSync = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, lastSync: new Date() }
        : integration
    ));
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'disconnected' as const }
        : integration
    ));
  };

  const handleConnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === integrationId 
        ? { ...integration, status: 'connected' as const, lastSync: new Date() }
        : integration
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600">Connect your data sources for automated experiment tracking</p>
        </div>
        <button className="btn-primary flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Integration
        </button>
      </div>

      {/* Connection Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="text-sm text-gray-600">Connected</div>
          <div className="text-2xl font-bold text-success-600">
            {integrations.filter(i => i.status === 'connected').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Disconnected</div>
          <div className="text-2xl font-bold text-gray-600">
            {integrations.filter(i => i.status === 'disconnected').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Errors</div>
          <div className="text-2xl font-bold text-danger-600">
            {integrations.filter(i => i.status === 'error').length}
          </div>
        </div>
        <div className="metric-card">
          <div className="text-sm text-gray-600">Last Sync</div>
          <div className="text-2xl font-bold text-primary-600">
            {formatLastSync(integrations.reduce((latest, integration) => 
              integration.lastSync > latest ? integration.lastSync : latest, 
              new Date(0)
            ))}
          </div>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected Integrations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {integrations.filter(i => i.status === 'connected').map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(integration.status)}
                  <div>
                    <h3 className="font-medium text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-500">Last sync: {formatLastSync(integration.lastSync)}</p>
                  </div>
                </div>
                <span className={`status-badge ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Sync Frequency:</span>
                  <span className="font-medium text-gray-900">{integration.config.syncFrequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Account ID:</span>
                  <span className="font-medium text-gray-900">{integration.config.accountId || integration.config.propertyId || '***'}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSync(integration.id)}
                  className="btn-secondary text-sm flex items-center"
                >
                  <ArrowPathIcon className="w-4 h-4 mr-1" />
                  Sync Now
                </button>
                <button
                  onClick={() => handleDisconnect(integration.id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disconnected Integrations */}
      {integrations.filter(i => i.status === 'disconnected').length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Disconnected Integrations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'disconnected').map((integration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-2 border-dashed border-gray-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleConnect(integration.id)}
                  className="btn-primary text-sm flex items-center"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  Connect
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Errors */}
      {integrations.filter(i => i.status === 'error').length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Integration Errors</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {integrations.filter(i => i.status === 'error').map((integration) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-2 border-danger-200 bg-danger-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(integration.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-danger-600">Connection error detected</p>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-danger-700">
                    <strong>Error:</strong> API authentication failed. Please check your credentials.
                  </div>
                  <div className="text-sm text-gray-600">
                    Last sync: {formatLastSync(integration.lastSync)}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="btn-secondary text-sm">
                    Fix Connection
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Disconnect
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Available Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableIntegrations.map((integration) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900">{integration.name}</h3>
                  <span className="text-xs text-gray-500">{integration.category}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
              
              <button className="btn-secondary text-sm w-full">
                <LinkIcon className="w-4 h-4 mr-1" />
                Connect
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations; 