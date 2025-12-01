
import React, { useState } from 'react';
import { Activity, Shield, Link, Database, Network } from 'lucide-react';
import { PageHeader, Card, Button, SidebarNavigation } from './common';
import { useAdminPanel } from '../hooks/useAdminPanel';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hierarchy');
  const { logs } = useAdminPanel(activeTab);

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader 
        title="Admin Console" 
        subtitle="System settings, security audits, and data management."
      />
      
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <SidebarNavigation
          items={navigationItems}
          activeItem={activeTab}
          onItemChange={setActiveTab}
        />

        <Card className="flex-1 overflow-hidden flex flex-col p-0">
            {activeTab === 'hierarchy' && <AdminHierarchy />}
            {activeTab === 'logs' && <AdminAuditLog logs={logs} />}
            {activeTab === 'data' && <AdminPlatformManager />}

            {activeTab === 'integrations' && (
            <div className="p-8 space-y-6 overflow-auto">
                <h3 className="font-bold text-lg mb-4">Connected Platforms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">O</div>
                        <div><h4 className="font-bold">Outlook / Exchange</h4><p className="text-xs text-green-600">Connected (Sync Active)</p></div>
                    </div>
                    <Button variant="ghost" size="sm">Config</Button>
                </div>
                <div className="border p-4 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold">iM</div>
                        <div><h4 className="font-bold">iManage</h4><p className="text-xs text-green-600">Connected (DMS)</p></div>
                    </div>
                    <Button variant="ghost" size="sm">Config</Button>
                </div>
                <div className="border p-4 rounded-lg flex items-center justify-between opacity-60">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-400 rounded flex items-center justify-center text-white font-bold">Doc</div>
                        <div><h4 className="font-bold">DocuSign</h4><p className="text-xs text-slate-500">Not Connected</p></div>
                    </div>
                    <Button variant="primary" size="sm">Connect</Button>
                </div>
                </div>
            </div>
            )}

            {activeTab === 'security' && (
                <div className="p-8 overflow-auto">
                    <h3 className="font-bold text-lg mb-6">Policy Enforcement</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded bg-slate-50">
                            <div>
                                <h4 className="font-bold text-sm">Two-Factor Authentication (2FA)</h4>
                                <p className="text-xs text-slate-500">Enforce for all roles except 'Guest'</p>
                            </div>
                            <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded bg-slate-50">
                            <div>
                                <h4 className="font-bold text-sm">Data Loss Prevention (DLP)</h4>
                                <p className="text-xs text-slate-500">Block downloads of documents tagged 'Strict Confidential' on mobile</p>
                            </div>
                            <div className="h-6 w-11 bg-green-500 rounded-full relative"><div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div></div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
      </div>
    </div>
  );
};
