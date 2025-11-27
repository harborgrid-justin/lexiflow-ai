
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, AlertCircle, Download, Users, Briefcase } from 'lucide-react';
import { MOCK_WIP_DATA, MOCK_REALIZATION_DATA } from '../data/mockBilling';
import { MOCK_CLIENTS } from '../data/mockClients';
import { PageHeader } from './common/PageHeader';
import { Button } from './common/Button';

interface BillingDashboardProps {
  navigateTo?: (view: string) => void;
}

export const BillingDashboard: React.FC<BillingDashboardProps> = ({ navigateTo }) => {
  const wipData = MOCK_WIP_DATA;
  const realizationData = MOCK_REALIZATION_DATA;
  const clients = MOCK_CLIENTS;

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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4"><span className="text-slate-500 text-sm font-medium">Total WIP</span><DollarSign className="h-5 w-5 text-blue-500"/></div>
          <div className="text-3xl font-bold text-slate-900">${totalWip.toLocaleString()}</div>
          <div className="mt-2 text-xs text-green-600 flex items-center"><TrendingUp className="h-3 w-3 mr-1"/> +12% from last month</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4"><span className="text-slate-500 text-sm font-medium">Realization Rate</span><TrendingUp className="h-5 w-5 text-emerald-500"/></div>
          <div className="text-3xl font-bold text-slate-900">92.4%</div>
          <div className="mt-2 text-xs text-slate-500">Firm target: 90%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4"><span className="text-slate-500 text-sm font-medium">Outstanding (60+ days)</span><AlertCircle className="h-5 w-5 text-red-500"/></div>
          <div className="text-3xl font-bold text-slate-900">$12,450</div>
          <div className="mt-2 text-xs text-red-600">3 Invoices overdue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">WIP vs Billed (Top Clients)</h3>
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
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-6">Realization Breakdown</h3>
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
            <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center"><div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div> Collected</div>
                <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Write-off</div>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
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
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">{client.name.substring(0, 2)}</div>
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
                                <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">{client.name.substring(0, 2)}</div>
                                <div>
                                    <p className="font-medium text-sm text-slate-900">{client.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center"><Briefcase className="h-3 w-3 mr-1"/> {client.matters.length} Matters</p>
                                </div>
                            </div>
                             <div className="text-right">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{client.status}</span>
                            </div>
                         </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
