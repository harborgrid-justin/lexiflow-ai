
import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ShieldAlert, CheckCircle, Scale } from 'lucide-react';
import { EvidenceItem } from '../../types';

interface EvidenceAdmissibilityProps {
  selectedItem: EvidenceItem;
}

export const EvidenceAdmissibility: React.FC<EvidenceAdmissibilityProps> = ({ selectedItem }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Admissibility Assessment">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-start">
          <ShieldAlert className="h-5 w-5 text-amber-600 mr-3 mt-0.5 shrink-0"/>
          <div>
            <h5 className="text-sm font-bold text-amber-800">Current Status: {selectedItem.admissibility}</h5>
            <p className="text-xs text-amber-700 mt-1">
              {selectedItem.admissibility === 'Challenged' 
                ? 'Opposing counsel has filed a Motion in Limine based on FRE 901 (Authentication).' 
                : 'Standard foundation required. No current challenges.'}
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-900">Federal Rules of Evidence Checklist</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded bg-slate-50">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center mr-3"><CheckCircle className="h-3 w-3 text-green-500"/></div>
                <span className="text-sm">FRE 401 (Relevance)</span>
              </div>
              <Badge variant="success">Pass</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded bg-slate-50">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center mr-3 text-xs font-bold text-amber-600">?</div>
                <span className="text-sm">FRE 901 (Authentication)</span>
              </div>
              <Badge variant="warning">Pending</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded bg-slate-50">
              <div className="flex items-center">
                <div className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center mr-3"><CheckCircle className="h-3 w-3 text-green-500"/></div>
                <span className="text-sm">FRE 803 (Hearsay Exception)</span>
              </div>
              <Badge variant="success">Applicable</Badge>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Motions & Challenges">
        <div className="text-center py-8 text-slate-400">
          <Scale className="h-12 w-12 mx-auto mb-3 opacity-20"/>
          <p>No active motions filed against this evidence ID.</p>
          <Button variant="outline" size="sm" className="mt-4">Log Anticipated Challenge</Button>
        </div>
      </Card>
    </div>
  );
};
