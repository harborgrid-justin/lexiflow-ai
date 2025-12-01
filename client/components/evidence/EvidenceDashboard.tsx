
import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { StatCard } from '../common/Stats';
import { ApiService } from '../../services/apiService';
import { EvidenceItem } from '../../types';
import { ShieldCheck, AlertTriangle, HardDrive, Box, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface EvidenceDashboardProps {
  onNavigate: (view: string) => void;
}

export const EvidenceDashboard: React.FC<EvidenceDashboardProps> = ({ onNavigate }) => {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

  useEffect(() => {
    const fetchEvidence = async () => {
        try {
            const data = await ApiService.getEvidence();
            setEvidence(data || []);
        } catch (e) {
            console.error("Failed to fetch evidence", e);
            setEvidence([]);
        }
    };
    fetchEvidence();
  }, []);

  const totalItems = evidence.length;
  const digitalItems = evidence.filter(e => e.type === 'Digital').length;
  const physicalItems = evidence.filter(e => e.type === 'Physical').length;
  const challengedItems = evidence.filter(e => e.admissibility === 'Challenged').length;

  const data = [
    { name: 'Physical', value: physicalItems, color: '#d97706' }, // amber-600
    { name: 'Digital', value: digitalItems, color: '#2563eb' }, // blue-600
    { name: 'Document', value: totalItems - digitalItems - physicalItems, color: '#475569' }, // slate-600
  ];

  const recentCustodyEvents = evidence.flatMap(e =>
    (e.chainOfCustody || []).map(c => ({ ...c, itemTitle: e.title, itemId: e.id }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Evidence"
          value={totalItems}
          icon={Box}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Digital Assets"
          value={digitalItems}
          icon={HardDrive}
          color="text-purple-600"
          bg="bg-purple-50"
        />
        <StatCard
          label="Admissibility Risk"
          value={challengedItems}
          icon={AlertTriangle}
          color="text-amber-600"
          bg="bg-amber-50"
        />
        <StatCard
          label="Chain Integrity"
          value="100%"
          icon={ShieldCheck}
          color="text-green-600"
          bg="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card title="Evidence Type Distribution">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Custody Transfers">
          <div className="space-y-4">
            {recentCustodyEvents.map((evt, idx) => (
              <div key={idx} className="flex items-start pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="bg-blue-50 p-2 rounded-full mr-3 shrink-0">
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{evt.action}</p>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{evt.itemTitle}</span> • {evt.actor}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{evt.date}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full text-blue-600" onClick={() => onNavigate('custody')}>
              View Full Chain of Custody Log
            </Button>
          </div>
        </Card>
      </div>

      {/* Storage Status */}
      <div className="bg-slate-900 rounded-lg p-6 text-white flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 className="font-bold text-lg mb-1">Secure Evidence Storage</h3>
          <p className="text-slate-400 text-sm">All digital assets are encrypted at rest (AES-256) and anchored to the Ethereum blockchain.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
            <div className="text-center">
                <p className="text-xs text-slate-500 uppercase">Storage Used</p>
                <p className="text-xl font-mono font-bold text-emerald-400">4.2 TB</p>
            </div>
             <div className="text-center">
                <p className="text-xs text-slate-500 uppercase">Retention Policy</p>
                <p className="text-xl font-mono font-bold text-blue-400">7 Years</p>
            </div>
        </div>
      </div>
    </div>
  );
};
