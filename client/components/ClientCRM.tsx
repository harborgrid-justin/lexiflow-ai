/**
 * ClientCRM.tsx
 *
 * ENZYME MIGRATION: Complete
 * - Added usePageView for page tracking
 * - Added useTrackEvent for action tracking (new intake, view portal, 360 view)
 * - Wrapped client cards grid in LazyHydration for progressive loading
 * - Converted handlers to useLatestCallback for stable references
 *
 * @module ClientCRM
 */

import React, { useState } from 'react';
import { Client } from '../types';
import { UserPlus, PieChart, Lock } from 'lucide-react';
import { ClientIntakeModal } from './ClientIntakeModal';
import { ClientPortalModal } from './ClientPortalModal';
import { PageHeader, Button, Card, Avatar, Badge, EmptyState } from './common';
import { useClientCRM } from '../hooks/useClientCRM';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  LazyHydration
} from '../enzyme';

export const ClientCRM: React.FC = () => {
  const [showIntake, setShowIntake] = useState(false);
  const [selectedClientPortal, setSelectedClientPortal] = useState<Client | null>(null);
  const { clients, handleAddClient } = useClientCRM();

  // Enzyme: Page view tracking
  usePageView('client_crm');
  const trackEvent = useTrackEvent();

  // Enzyme: Stable callback for showing intake modal
  const handleShowIntake = useLatestCallback((show: boolean) => {
    setShowIntake(show);
    if (show) {
      trackEvent('client_crm_new_intake_opened');
    }
  });

  // Enzyme: Stable callback for selecting client portal
  const handleSelectClientPortal = useLatestCallback((client: Client | null) => {
    setSelectedClientPortal(client);
    if (client) {
      trackEvent('client_crm_portal_viewed', { clientId: client.id, clientName: client.name });
    }
  });

  // Enzyme: Stable callback for adding client with modal
  const handleAddClientWithModal = useLatestCallback((clientName: string) => {
    handleAddClient(clientName);
    setShowIntake(false);
    trackEvent('client_crm_client_added', { clientName });
  });

  // Enzyme: Stable callback for 360 view action
  const handle360View = useLatestCallback((client: Client) => {
    trackEvent('client_crm_360_view_clicked', { clientId: client.id, clientName: client.name });
  });

  return (
    <div className="space-y-6 relative animate-fade-in">
      {showIntake && (
        <ClientIntakeModal
          onClose={() => handleShowIntake(false)}
          onSave={handleAddClientWithModal}
        />
      )}

      {selectedClientPortal && (
        <ClientPortalModal
          client={selectedClientPortal}
          onClose={() => handleSelectClientPortal(null)}
        />
      )}

      <PageHeader
        title="Client Relationships"
        subtitle="CRM, Intake, and Client Portal Management."
        actions={
          <Button
            variant="primary"
            icon={UserPlus}
            onClick={() => handleShowIntake(true)}
          >
            New Intake
          </Button>
        }
      />

      {/* Enzyme: LazyHydration for progressive loading of client cards grid */}
      <LazyHydration
        id="client-crm-cards-grid"
        priority="normal"
        trigger="visible"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <Card key={client.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <Avatar name={client.name || 'Unknown Client'} size="lg" color="slate" />
                <Badge variant={client.status === 'Active' ? 'active' : 'inactive'}>
                  {client.status}
                </Badge>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-1">{client.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{client.industry}</p>
              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <p className="text-slate-400 text-xs">Lifetime Billed</p>
                  <p className="font-semibold">${(client.totalBilled || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs">Active Matters</p>
                  <p className="font-semibold">{(client.matters || []).length}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Lock}
                  onClick={() => handleSelectClientPortal(client)}
                  className="flex-1"
                >
                  Client Portal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={PieChart}
                  onClick={() => handle360View(client)}
                  className="flex-1"
                >
                  360 View
                </Button>
              </div>
            </Card>
          ))}
          <EmptyState
            icon={UserPlus}
            title="Add Prospect"
            onClick={() => handleShowIntake(true)}
          />
        </div>
      </LazyHydration>
    </div>
  );
};
