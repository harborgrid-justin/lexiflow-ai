
import React from 'react';
import { UserAvatar } from '../common/UserAvatar';
import { ProgressBar } from '../common/ProgressBar';

export const CaseListResources: React.FC = () => {
  const resources = [
    { name: 'Alexandra H.', role: 'Senior Partner', utilization: 92, cases: 12 },
    { name: 'James Doe', role: 'Associate', utilization: 85, cases: 8 },
    { name: 'Sarah Jenkins', role: 'Paralegal', utilization: 45, cases: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((res, i) => (
          <div key={i} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-all">
            <div className="flex items-center gap-4 mb-4">
              <UserAvatar name={res.name} size="lg"/>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{res.name}</h3>
                <p className="text-sm text-slate-500">{res.role}</p>
              </div>
            </div>
            <div className="space-y-4">
              <ProgressBar label="Utilization" value={res.utilization} colorClass={res.utilization > 90 ? 'bg-red-500' : 'bg-blue-600'} />
              <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-500">Active Matters</span>
                <span className="font-bold text-slate-900">{res.cases}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
