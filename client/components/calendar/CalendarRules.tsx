
import React from 'react';
import { Settings, Book, Check } from 'lucide-react';

export const CalendarRules: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Book className="h-5 w-5 mr-2 text-blue-600"/> Active Rule Sets</h3>
        <div className="space-y-3">
          {['Federal Rules of Civil Procedure (FRCP)', 'California Code of Civil Procedure', 'Los Angeles Superior Court Local Rules', 'NY Supreme Court Commercial Division'].map((rule, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-sm font-medium text-slate-700">{rule}</span>
              <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white"/>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">+ Add Jurisdiction</button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Settings className="h-5 w-5 mr-2 text-slate-600"/> Automation Triggers</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" defaultChecked readOnly/>
            <div>
              <p className="text-sm font-bold text-slate-800">Trial Date Set</p>
              <p className="text-xs text-slate-500">Auto-calculate discovery cutoff (30 days prior) and expert disclosure (50 days prior).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" defaultChecked readOnly/>
            <div>
              <p className="text-sm font-bold text-slate-800">Motion Filed</p>
              <p className="text-xs text-slate-500">Auto-schedule Opposition Due (14 days before hearing) and Reply Due (5 days before).</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" defaultChecked readOnly/>
            <div>
              <p className="text-sm font-bold text-slate-800">Deposition Scheduled</p>
              <p className="text-xs text-slate-500">Remind court reporter 24h prior.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
