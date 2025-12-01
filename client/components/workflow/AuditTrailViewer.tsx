import React, { useState, useEffect } from 'react';
import { FileText, User, Calendar, Filter } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Card } from '../common/Card';
import type { AuditLogEntry } from '../../types/workflow-engine';

interface AuditTrailViewerProps {
  caseId?: string;
  entityType?: 'task' | 'stage' | 'workflow';
  entityId?: string;
  limit?: number;
}

export const AuditTrailViewer: React.FC<AuditTrailViewerProps> = ({
  caseId,
  entityType,
  entityId,
  limit = 50
}) => {
  const { getAuditLog, getCaseAuditLog } = useWorkflowEngine();
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAuditLog();
  }, [caseId, entityType, entityId, limit]);

  const loadAuditLog = async () => {
    setLoading(true);
    try {
      if (caseId) {
        const log = await getCaseAuditLog(caseId);
        if (log) setAuditLog(log);
      } else {
        const log = await getAuditLog(entityType, entityId, limit);
        if (log) setAuditLog(log);
      }
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    if (action.includes('created') || action.includes('approved')) return 'text-green-700';
    if (action.includes('deleted') || action.includes('rejected')) return 'text-red-700';
    if (action.includes('updated') || action.includes('modified')) return 'text-blue-700';
    return 'text-slate-700';
  };

  const getActionIcon = (entityType: string) => {
    switch (entityType) {
      case 'task':
        return <FileText className="h-4 w-4" />;
      case 'stage':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredLog = filterType === 'all'
    ? auditLog
    : auditLog.filter(entry => entry.entityType === filterType);

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-500" />
            <h3 className="font-semibold text-slate-900">Audit Trail</h3>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-slate-300 rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="task">Tasks</option>
              <option value="stage">Stages</option>
              <option value="workflow">Workflows</option>
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-200 max-h-96 overflow-y-auto">
        {loading && (
          <div className="p-8 text-center text-slate-500">
            <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-sm mt-2">Loading audit log...</p>
          </div>
        )}

        {!loading && filteredLog.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No audit entries found</p>
          </div>
        )}

        {!loading && filteredLog.map(entry => (
          <div key={entry.id} className="p-4 hover:bg-slate-50">
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                {getActionIcon(entry.entityType)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-sm font-medium ${getActionColor(entry.action)}`}>
                      {entry.action.replace(/_/g, ' ').toUpperCase()}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {entry.entityType} • {entry.entityId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    {entry.userName && (
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {entry.userName}
                      </p>
                    )}
                  </div>
                </div>

                {(entry.previousValue || entry.newValue) && (
                  <div className="mt-2 p-2 bg-slate-50 rounded text-xs">
                    {entry.previousValue && (
                      <div className="mb-1">
                        <span className="text-slate-500">Previous: </span>
                        <span className="text-slate-700">
                          {JSON.stringify(entry.previousValue)}
                        </span>
                      </div>
                    )}
                    {entry.newValue && (
                      <div>
                        <span className="text-slate-500">New: </span>
                        <span className="text-slate-700">
                          {JSON.stringify(entry.newValue)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                  <div className="mt-2 text-xs text-slate-600">
                    <details>
                      <summary className="cursor-pointer hover:text-slate-900">
                        Additional details
                      </summary>
                      <pre className="mt-1 p-2 bg-slate-50 rounded overflow-x-auto">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
