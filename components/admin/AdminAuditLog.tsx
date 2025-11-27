
import React from 'react';
import { AuditLogEntry } from '../../types';

interface AdminAuditLogProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">System Activity Audit</h3>
        <button className="text-xs bg-white border px-3 py-1 rounded hover:bg-slate-50">Export CSV</button>
      </div>
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">Timestamp</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">User</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">Action</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">Resource</th>
              <th className="px-6 py-3 text-left font-semibold text-slate-500">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 font-mono text-xs">
            {logs.map(l => (
              <tr key={l.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-slate-500">{l.timestamp}</td>
                <td className="px-6 py-3 font-medium text-slate-900">{l.user}</td>
                <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-1 rounded">{l.action}</span></td>
                <td className="px-6 py-3 text-slate-600">{l.resource}</td>
                <td className="px-6 py-3 text-slate-400">{l.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
