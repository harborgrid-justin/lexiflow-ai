import React, { useState } from 'react';
import {
  Mail,
  Calendar,
  Cloud,
  FileText,
  DollarSign,
  Check,
  X,
  Settings,
  ExternalLink,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import {
  useIntegrations,
  useConnectIntegration,
  useDisconnectIntegration,
} from '../api/settings.api';
import type { Integration, IntegrationType, IntegrationCategory } from '../api/settings.types';

export const IntegrationsPage: React.FC = () => {
  const { data: integrations, isLoading } = useIntegrations();
  const connectIntegration = useConnectIntegration();
  const disconnectIntegration = useDisconnectIntegration();

  const [selectedCategory, setSelectedCategory] = useState<IntegrationCategory | 'all'>('all');
  const [connectingIntegration, setConnectingIntegration] = useState<IntegrationType | null>(null);

  const categories = [
    { id: 'all' as const, label: 'All Integrations', icon: Settings },
    { id: 'email' as IntegrationCategory, label: 'Email', icon: Mail },
    { id: 'calendar' as IntegrationCategory, label: 'Calendar', icon: Calendar },
    { id: 'storage' as IntegrationCategory, label: 'Cloud Storage', icon: Cloud },
    { id: 'legal' as IntegrationCategory, label: 'Legal Tools', icon: FileText },
    { id: 'accounting' as IntegrationCategory, label: 'Accounting', icon: DollarSign },
  ];

  const filteredIntegrations = integrations?.filter(
    (integration) => selectedCategory === 'all' || integration.category === selectedCategory
  );

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check className="w-3 h-3" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <X className="w-3 h-3" />
            Error
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
            Available
          </span>
        );
    }
  };

  const handleConnect = (type: IntegrationType) => {
    setConnectingIntegration(type);
    // In a real app, this would open OAuth flow or configuration dialog
    // For now, we'll simulate a simple connection
    connectIntegration.mutate(
      { type, config: {} },
      {
        onSuccess: () => setConnectingIntegration(null),
        onError: () => setConnectingIntegration(null),
      }
    );
  };

  const handleDisconnect = (type: IntegrationType) => {
    if (confirm('Are you sure you want to disconnect this integration?')) {
      disconnectIntegration.mutate(type);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
        <p className="text-slate-600 mt-1">
          Connect LexiFlow with your favorite tools and services
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive =
            selectedCategory === category.id ||
            (selectedCategory === 'all' && category.id === 'all');

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors
                ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations?.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConnect={() => handleConnect(integration.type)}
            onDisconnect={() => handleDisconnect(integration.type)}
            isConnecting={connectingIntegration === integration.type}
          />
        ))}
      </div>

      {filteredIntegrations?.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <p className="text-slate-600">No integrations found in this category</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Integration Card Component
// ============================================================================

interface IntegrationCardProps {
  integration: Integration;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnecting: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  integration,
  onConnect,
  onDisconnect,
  isConnecting,
}) => {
  const [showConfig, setShowConfig] = useState(false);

  const getIcon = (type: IntegrationType) => {
    if (type.startsWith('email')) return <Mail className="w-8 h-8" />;
    if (type.startsWith('calendar')) return <Calendar className="w-8 h-8" />;
    if (type.startsWith('storage')) return <Cloud className="w-8 h-8" />;
    if (type.includes('pacer') || type.includes('efiling')) return <FileText className="w-8 h-8" />;
    if (type.startsWith('accounting')) return <DollarSign className="w-8 h-8" />;
    return <Settings className="w-8 h-8" />;
  };

  const getStatusBadge = () => {
    switch (integration.status) {
      case 'connected':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check className="w-3 h-3" />
            Connected
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">{getIcon(integration.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mb-4 line-clamp-2">{integration.description}</p>

      {/* Connected Info */}
      {integration.status === 'connected' && integration.connectedAt && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700">
            Connected on {new Date(integration.connectedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Error Info */}
      {integration.status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-700">
            Connection error. Please try reconnecting or check your settings.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {integration.status === 'connected' ? (
          <>
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configure
            </button>
            <button
              onClick={onDisconnect}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
              Disconnect
            </button>
          </>
        ) : (
          <button
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Connect
              </>
            )}
          </button>
        )}
      </div>

      {/* Configuration Panel */}
      {showConfig && integration.status === 'connected' && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Configuration</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <span>Sync Settings</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
              <span>Permissions</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <span>View Documentation</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Mock Integration Data (for demonstration)
// ============================================================================

export const mockIntegrations: Integration[] = [
  {
    id: '1',
    type: 'email_office365',
    name: 'Microsoft 365',
    description: 'Connect your Office 365 email account for seamless email integration',
    icon: '📧',
    status: 'available',
    category: 'email',
  },
  {
    id: '2',
    type: 'email_gmail',
    name: 'Gmail',
    description: 'Integrate with Gmail for email management and notifications',
    icon: '✉️',
    status: 'available',
    category: 'email',
  },
  {
    id: '3',
    type: 'calendar_office365',
    name: 'Outlook Calendar',
    description: 'Sync your Outlook calendar with LexiFlow deadlines and events',
    icon: '📅',
    status: 'connected',
    category: 'calendar',
    connectedAt: new Date().toISOString(),
  },
  {
    id: '4',
    type: 'calendar_google',
    name: 'Google Calendar',
    description: 'Connect Google Calendar for automatic event synchronization',
    icon: '📆',
    status: 'available',
    category: 'calendar',
  },
  {
    id: '5',
    type: 'storage_dropbox',
    name: 'Dropbox',
    description: 'Store and access case documents directly from Dropbox',
    icon: '📦',
    status: 'available',
    category: 'storage',
  },
  {
    id: '6',
    type: 'storage_box',
    name: 'Box',
    description: 'Enterprise-grade document storage and collaboration with Box',
    icon: '📁',
    status: 'available',
    category: 'storage',
  },
  {
    id: '7',
    type: 'storage_onedrive',
    name: 'OneDrive',
    description: 'Integrate with Microsoft OneDrive for document management',
    icon: '☁️',
    status: 'available',
    category: 'storage',
  },
  {
    id: '8',
    type: 'pacer',
    name: 'PACER',
    description: 'Access federal court records and filings directly in LexiFlow',
    icon: '⚖️',
    status: 'available',
    category: 'legal',
  },
  {
    id: '9',
    type: 'efiling',
    name: 'E-Filing Systems',
    description: 'File documents electronically with state and federal courts',
    icon: '📄',
    status: 'available',
    category: 'legal',
  },
  {
    id: '10',
    type: 'accounting_quickbooks',
    name: 'QuickBooks',
    description: 'Sync billing and invoicing with QuickBooks',
    icon: '💰',
    status: 'available',
    category: 'accounting',
  },
  {
    id: '11',
    type: 'accounting_xero',
    name: 'Xero',
    description: 'Connect Xero for automated accounting and financial reporting',
    icon: '💵',
    status: 'available',
    category: 'accounting',
  },
];
