
import React, { useState, useEffect } from 'react';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';
import { TabNavigation, TabItem } from './common/TabNavigation';
import { DiscoveryRequest } from '../types';
import { ApiService } from '../services/apiService';
import { 
  MessageCircle, Plus, Scale, Shield, Users, Lock, Clock
} from 'lucide-react';

import { DiscoveryDashboard } from './discovery/DiscoveryDashboard';
import { DiscoveryRequests } from './discovery/DiscoveryRequests';
import { PrivilegeLog } from './discovery/PrivilegeLog';
import { LegalHolds } from './discovery/LegalHolds';
import { DiscoveryDocumentViewer } from './discovery/DiscoveryDocumentViewer';
import { DiscoveryResponse } from './discovery/DiscoveryResponse';
import { DiscoveryProduction } from './discovery/DiscoveryProduction';

type DiscoveryView = 'dashboard' | 'requests' | 'privilege' | 'holds' | 'plan' | 'doc_viewer' | 'response' | 'production';

export const DiscoveryPlatform: React.FC = () => {
  const [view, setView] = useState<DiscoveryView>('dashboard');
  const [contextId, setContextId] = useState<string | null>(null); // To store ID of doc or request being viewed/edited
  const [requests, setRequests] = useState<DiscoveryRequest[]>([]);
  const primaryTabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Scale },
    { id: 'requests', label: 'Requests & Responses', icon: MessageCircle },
    { id: 'privilege', label: 'Privilege Log', icon: Shield },
    { id: 'holds', label: 'Legal Holds', icon: Lock },
    { id: 'plan', label: 'Discovery Plan (26(f))', icon: Users },
  ];

  useEffect(() => {
    const fetchDiscovery = async () => {
        try {
            const data = await ApiService.getDiscovery();
            setRequests(data || []);
        } catch (e) {
            console.error("Failed to fetch discovery", e);
            setRequests([]);
        }
    };
    fetchDiscovery();
  }, []);

  const handleNavigate = (targetView: DiscoveryView, id?: string) => {
    if (id) setContextId(id);
    setView(targetView);
  };

  const handleBack = () => {
    setView('dashboard');
    setContextId(null);
  };

  const handleSaveResponse = async (reqId: string, text: string) => {
      try {
        await ApiService.updateDiscoveryRequest(reqId, { status: 'Responded', responsePreview: text });
        const updatedRequests = requests.map(r => r.id === reqId ? { ...r, status: 'Responded' as const, responsePreview: text } : r);
        setRequests(updatedRequests);
        alert(`Response saved for ${reqId}. Status updated to Responded.`);
        setView('requests');
      } catch (error) {
        console.error("Failed to save response", error);
        alert("Failed to save response.");
      }
  };

  const renderContent = () => {
    switch (view) {
        case 'dashboard':
            return <DiscoveryDashboard onNavigate={handleNavigate} />;
        case 'requests':
            return <DiscoveryRequests items={requests} onNavigate={handleNavigate} />;
        case 'privilege':
            return <PrivilegeLog />;
        case 'holds':
            return <LegalHolds />;
        case 'doc_viewer':
            return <DiscoveryDocumentViewer docId={contextId || ''} onBack={() => setView('dashboard')} />;
        case 'response': {
            const reqToDraft = requests.find(r => r.id === contextId);
            return <DiscoveryResponse request={reqToDraft || null} onBack={() => setView('requests')} onSave={handleSaveResponse} />;
        }
        case 'production': {
            const reqToProduce = requests.find(r => r.id === contextId);
            return <DiscoveryProduction request={reqToProduce || null} onBack={() => setView('requests')} />;
        }
        case 'plan':
            return (
                <div className="flex flex-col items-center justify-center h-96 text-slate-400 bg-white rounded-lg border border-slate-200 border-dashed">
                    <Users className="h-16 w-16 mb-4 opacity-20"/>
                    <p className="font-medium text-lg">Rule 26(f) Discovery Plan Builder</p>
                    <p className="text-sm mb-6">Collaborative editor for joint discovery plans.</p>
                    <Button variant="outline" onClick={handleBack}>Return to Dashboard</Button>
                </div>
            );
        default:
            return <DiscoveryDashboard onNavigate={handleNavigate} />;
    }
  };

  // Main Render
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header varies based on view depth */}
      {['dashboard', 'requests', 'privilege', 'holds', 'plan'].includes(view) ? (
          <>
            <PageHeader 
                title="Discovery Center" 
                subtitle="Manage Requests, Legal Holds, and FRCP Compliance."
                actions={
                <div className="flex gap-2">
                    <Button variant="secondary" icon={Clock} onClick={() => alert("Syncing Court Deadlines...")}>Sync Deadlines</Button>
                    <Button variant="primary" icon={Plus} onClick={() => alert("New Request Wizard")}>Create Request</Button>
                </div>
                }
            />
            <TabNavigation 
              tabs={primaryTabs}
              activeTab={view}
              onTabChange={(id) => setView(id as DiscoveryView)}
              className="bg-white rounded-t-lg"
            />
          </>
      ) : null}

      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};
