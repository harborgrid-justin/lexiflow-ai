
import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { Scale, AlertTriangle, FileText } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { Jurisdiction } from '../../types';

export const JurisdictionRegulatory: React.FC = () => {
  const [agencies, setAgencies] = useState<Jurisdiction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await ApiService.getJurisdictions('Regulatory');
        setAgencies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-4">Loading regulatory bodies...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card title="Administrative Bodies">
        <div className="space-y-4">
          {agencies.map((agency) => (
            <div key={agency.id} className="flex items-start p-3 border rounded-lg bg-slate-50">
              <Scale className={`h-6 w-6 mr-3 mt-1 ${agency.metadata.iconColor === 'green' ? 'text-green-600' : 'text-blue-600'}`}/>
              <div>
                <h4 className="font-bold text-slate-900">{agency.name}</h4>
                <p className="text-sm text-slate-500">{agency.metadata.description}</p>
                <div className="mt-2 text-xs font-mono bg-white border px-2 py-1 rounded inline-block">Ref: {agency.metadata.reference}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Recent Regulatory Actions">
        <div className="space-y-4">
          <div className="flex items-center text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-100">
            <AlertTriangle className="h-4 w-4 mr-2"/>
            <span>FTC Proposed Rule on Non-Competes (Pending)</span>
          </div>
          <div className="flex items-center text-sm text-blue-700 bg-blue-50 p-3 rounded border border-blue-100">
            <FileText className="h-4 w-4 mr-2"/>
            <span>SEC Climate Disclosure Guidelines (Adopted)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
