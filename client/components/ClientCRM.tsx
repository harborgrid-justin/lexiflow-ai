
import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { ApiService } from '../services/apiService';
import { UserPlus, PieChart, Lock } from 'lucide-react';
import { ClientIntakeModal } from './ClientIntakeModal';
import { ClientPortalModal } from './ClientPortalModal';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';

export const ClientCRM: React.FC = () => {
  const [showIntake, setShowIntake] = useState(false);
  const [selectedClientPortal, setSelectedClientPortal] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
        try {
            const data = await ApiService.getClients();
            setClients(data);
        } catch (e) {
            console.error("Failed to fetch clients", e);
        }
    };
    fetchClients();
  }, []);

  const handleAddClient = (clientName: string) => {
      const newClient: Client = {
          id: `cli-${Date.now()}`,
          name: clientName,
          industry: 'General',
          status: 'Prospect',
          totalBilled: 0,
          matters: []
      };
      setClients([...clients, newClient]);
      setShowIntake(false);
  };

  return (
    <div className="space-y-6 relative animate-fade-in">
      {showIntake && <ClientIntakeModal onClose={() => setShowIntake(false)} onSave={handleAddClient}/>}
      
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
          <div key={client.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xl text-slate-600">{client.name.substring(0, 2)}</div>
              <span className={`px-2 py-1 text-xs font-bold rounded-full ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>{client.status}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-1">{client.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{client.industry}</p>
            <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
              <div><p className="text-slate-400 text-xs">Lifetime Billed</p><p className="font-semibold">${client.totalBilled.toLocaleString()}</p></div>
              <div><p className="text-slate-400 text-xs">Active Matters</p><p className="font-semibold">{client.matters.length}</p></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedClientPortal(client)}
                className="flex-1 py-2 border rounded hover:bg-slate-50 text-sm flex justify-center items-center bg-blue-50 text-blue-700 border-blue-100"
              >
                <Lock className="h-3 w-3 mr-1" /> Client Portal
              </button>
              <button className="flex-1 py-2 border rounded hover:bg-slate-50 text-sm flex justify-center items-center"><PieChart className="h-3 w-3 mr-1" /> 360 View</button>
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setShowIntake(true)}>
          <UserPlus className="h-12 w-12 mb-2 opacity-50" />
          <span className="font-medium">Add Prospect</span>
        </div>
      </div>
    </div>
  );
};
