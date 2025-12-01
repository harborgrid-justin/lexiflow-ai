
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Download, Users, Briefcase } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { Client } from '../types';
import { PageHeader, Button, Card, Avatar, Badge } from './common';
import { StatCard } from './common/Stats';

interface BillingDashboardProps {
  navigateTo?: (view: string) => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({ navigateTo }) => {
  const [wipData, setWipData] = useState<any[]>([]);
  const [realizationData, setRealizationData] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [stats, c] = await Promise.all([
                ApiService.getBillingStats(),
                ApiService.getClients()
            ]);
            if (stats && stats.wip) {
              setWipData(stats.wip.map((w: any) => ({ month: w.month, wip: w.amount })));
            }
            if (stats && stats.realization) {
              setRealizationData(stats.realization);
            }
            setClients(c || []);
        } catch (e) {
            console.error("Failed to fetch billing data", e);
            setWipData([]);
            setRealizationData([]);
            setClients([]);
        }
    };
    fetchData();
  }, []);

  const totalWip = wipData.reduce((acc, curr) => acc + curr.wip, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Financial Performance" 
        subtitle="WIP, Realization, and Collections Dashboard"
        actions={
          <Button variant="secondary" icon={Download}>LEDES Export</Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total WIP"
          value={`$${totalWip.toLocaleString()}`}
          icon={DollarSign}
          color="text-blue-600"
          bg="bg-blue-50"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Realization Rate"
          value="92.4%"
          icon={TrendingUp}
          color="text-emerald-600"
          bg="bg-emerald-50"
        />
        <StatCard
          label="Outstanding (60+ days)"
          value="$12,450"
          icon={AlertCircle}
          color="text-red-600"
          bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="WIP vs Billed (Top Clients)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wipData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12}/>
                <YAxis axisLine={false} tickLine={false} fontSize={12}/>
                <Tooltip/>
                <Bar dataKey="billed" stackId="a" fill="#cbd5e1" name="Billed"/>
                <Bar dataKey="wip" stackId="a" fill="#3b82f6" name="WIP"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Realization Breakdown">
            <div className="h-64 flex justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={realizationData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {realizationData.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                </PieChart>
             </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm mt-4">
                <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div> Collected</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Write-off</div>
            </div>
        </Card>
      </div>

      <Card noPadding>
        <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-bold text-slate-800 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600"/> Client Portfolio
            </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* My Clients Section */}
            <div className="p-4">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">My Portfolio (Attorney)</h4>
                <div className="space-y-3">
                    {clients.slice(0, 1).map(client => (
                         <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => navigateTo && navigateTo('crm')}>
                            <div className="flex items-center space-x-3">
                                <Avatar name={client.name || 'Unknown Client'} size="sm" color="blue" />
                                <div>
                                    <p className="font-bold text-sm text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500">{client.industry}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-mono font-bold text-sm">${client.totalBilled.toLocaleString()}</p>
                                <p className="text-xs text-green-600">Active</p>
                            </div>
                         </div>
                    ))}
                </div>
            </div>

            {/* Firm Clients Section */}
            <div className="p-4 bg-slate-50/30">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Firm Wide</h4>
                 <div className="space-y-3">
                    {clients.map(client => (
                         <div key={`firm-${client.id}`} className="flex items-center justify-between p-3 border border-slate-200 bg-white rounded-lg hover:border-blue-400 cursor-pointer" onClick={() => navigateTo && navigateTo('crm')}>
                            <div className="flex items-center space-x-3">
                                <Avatar name={client.name || 'Unknown Client'} size="sm" color="slate" />
                                <div>
                                    <p className="font-medium text-sm text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center"><Briefcase className="h-3 w-3 mr-1"/> {(client.matters || []).length} Matters</p>
                                </div>
                            </div>
                             <div className="text-right">
                                <Badge variant={client.status === 'Active' ? 'active' : 'inactive'} size="sm">
                                  {client.status}
                                </Badge>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};
