
import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CheckSquare, FileText, Scale, ArrowRight } from 'lucide-react';
import { MOCK_DISCOVERY, MOCK_LEGAL_HOLDS, MOCK_PRIVILEGE_LOG } from '../../data/mockDiscovery';

interface DiscoveryDashboardProps {
    onNavigate: (view: any, id?: string) => void;
}

export const DiscoveryDashboard: React.FC<DiscoveryDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card noPadding className="border-l-4 border-l-blue-600">
          <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onNavigate('requests')}>
            <p className="text-xs font-bold text-slate-500 uppercase">Pending Requests</p>
            <p className="text-2xl font-bold text-slate-900">{MOCK_DISCOVERY.filter(r => r.status === 'Served').length}</p>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-amber-500">
          <div className="p-4">
            <p className="text-xs font-bold text-slate-500 uppercase">Upcoming Deadlines (7d)</p>
            <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-red-600">
          <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onNavigate('holds')}>
            <p className="text-xs font-bold text-slate-500 uppercase">Legal Hold Pending</p>
            <p className="text-2xl font-bold text-slate-900">{MOCK_LEGAL_HOLDS.filter(h => h.status === 'Pending').length}</p>
          </div>
        </Card>
        <Card noPadding className="border-l-4 border-l-purple-600">
          <div className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => onNavigate('privilege')}>
            <p className="text-xs font-bold text-slate-500 uppercase">Privileged Items</p>
            <p className="text-2xl font-bold text-slate-900">{MOCK_PRIVILEGE_LOG.length}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="FRCP 26(f) Conference Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-100">
              <div className="flex items-center">
                <CheckSquare className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Conference Held</p>
                  <p className="text-xs text-slate-500">Date: Oct 15, 2023</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onNavigate('doc_viewer', 'minutes')}>View Minutes</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Discovery Plan (Form 52)</p>
                  <p className="text-xs text-slate-500">Filed with Court: Nov 01, 2023</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onNavigate('doc_viewer', 'filing')}>View Filing</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center">
                <Scale className="h-5 w-5 text-slate-500 mr-3" />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Initial Disclosures (26(a))</p>
                  <p className="text-xs text-slate-500">Exchanged: Nov 14, 2023</p>
                </div>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
          </div>
        </Card>

        <Card title="Production Progress">
           <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                   <span>Responsive Documents Review</span>
                   <span className="font-bold">78%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-blue-600 h-2 rounded-full w-[78%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                   <span>Privilege Redactions</span>
                   <span className="font-bold">45%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                   <div className="bg-amber-500 h-2 rounded-full w-[45%]"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                 <span className="text-xs text-slate-500">Next Production Volume Due: March 31</span>
                 <Button size="sm" variant="outline" icon={ArrowRight} onClick={() => onNavigate('production')}>Create Production Set</Button>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
};
