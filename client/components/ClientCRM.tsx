
import React, { useState } from 'react';
import { Client } from '../types';
import { UserPlus, PieChart, Lock } from 'lucide-react';
import { ClientIntakeModal } from './ClientIntakeModal';
import { ClientPortalModal } from './ClientPortalModal';
import { PageHeader, Button, Card, Avatar, Badge, EmptyState } from './common';
import { useClientCRM } from '../hooks/useClientCRM';

export const ClientCRM: React.FC = () => {
  const [showIntake, setShowIntake] = useState(false);
  const [selectedClientPortal, setSelectedClientPortal] = useState<Client | null>(null);
  const { clients, handleAddClient } = useClientCRM();

  const handleAddClientWithModal = (clientName: string) => {
    handleAddClient(clientName);
    setShowIntake(false);
  };

  return (
    <div className="space-y-6 relative animate-fade-in">
      {showIntake && <ClientIntakeModal onClose={() => setShowIntake(false)} onSave={handleAddClientWithModal}/>}
      
      {selectedClientPortal && (
        <ClientPortalModal client={selectedClientPortal} onClose={() => setSelectedClientPortal(null)} />
      )}

      <PageHeader 
        title="Client Relationships" 
        subtitle="CRM, Intake, and Client Portal Management."
        actions={
          <Button variant="primary" icon={UserPlus} onClick={() => setShowIntake(true)}>New Intake</Button>
        }
      />

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
              <div><p className="text-slate-400 text-xs">Lifetime Billed</p><p className="font-semibold">${(client.totalBilled || 0).toLocaleString()}</p></div>
              <div><p className="text-slate-400 text-xs">Active Matters</p><p className="font-semibold">{(client.matters || []).length}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                icon={Lock}
                onClick={() => setSelectedClientPortal(client)}
                className="flex-1"
              >
                Client Portal
              </Button>
              <Button variant="ghost" size="sm" icon={PieChart} className="flex-1">360 View</Button>
            </div>
          </Card>
        ))}
        <EmptyState
          icon={UserPlus}
          title="Add Prospect"
          onClick={() => setShowIntake(true)}
        />
      </div>
    </div>
  );
};
