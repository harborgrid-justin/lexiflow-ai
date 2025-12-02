
/**
 * AdminAuditLog Component
 *
 * ENZYME MIGRATION:
 * - useTrackEvent for analytics tracking
 * - useLatestCallback for stable export button handler
 * - LazyHydration for audit table (priority="normal", trigger="visible")
 *
 * Analytics Events:
 * - admin_audit_export_clicked: When user clicks Export CSV button
 *
 * Hydration Strategy:
 * - Audit table (NORMAL/VISIBLE): Large data table lazy-hydrates when scrolled into view
 *
 * Performance:
 * - Deferred hydration reduces initial load time for admin dashboard
 * - Export tracking helps understand audit data usage patterns
 */

import React from 'react';
import { AuditLogEntry } from '../../types';
import { Clock, User, Activity } from 'lucide-react';
import { useTrackEvent, useLatestCallback, LazyHydration } from '../../enzyme';

interface AdminAuditLogProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  const trackEvent = useTrackEvent();

  const handleExportClick = useLatestCallback(() => {
    trackEvent('admin_audit_export_clicked', { logCount: logs.length });
    // TODO: Implement CSV export logic
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">System Activity Audit</h3>
        <button
          onClick={handleExportClick}
          className="text-xs bg-white border px-3 py-1 rounded hover:bg-slate-50 shadow-sm text-slate-600"
        >
          Export CSV
        </button>
      </div>

      <LazyHydration priority="normal" trigger="visible">
        <div className="overflow-auto flex-1 bg-slate-50 md:bg-white">

          {/* Desktop Table */}
          <table className="hidden md:table min-w-full divide-y divide-slate-200 text-sm">
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
                  <td className="px-6 py-3"><span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{l.action}</span></td>
                  <td className="px-6 py-3 text-slate-600">{l.resource}</td>
                  <td className="px-6 py-3 text-slate-400">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 p-4">
              {logs.map(l => (
                  <div key={l.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                          <span className="font-mono text-xs text-slate-500 flex items-center">
                              <Clock className="h-3 w-3 mr-1"/> {l.timestamp}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{l.ip}</span>
                      </div>
                      <div className="flex items-center mb-3">
                          <User className="h-4 w-4 text-slate-400 mr-2"/>
                          <span className="font-bold text-sm text-slate-900">{l.user}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                          <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-blue-500"/>
                              <span className="text-xs font-bold text-slate-700">{l.action}</span>
                          </div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 break-all pl-1">
                          Res: {l.resource}
                      </p>
                  </div>
              ))}
          </div>
        </div>
      </LazyHydration>
    </div>
  );
};
