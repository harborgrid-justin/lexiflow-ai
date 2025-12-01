import React from 'react';
import { Link, FileText } from 'lucide-react';
import { Badge } from '../common/Badge';

interface ConsolidatedCase {
  caseNumber: string;
  caseName: string;
  court: string;
  status: string;
  relationship: string;
}

interface ConsolidatedCasesPreviewProps {
  cases: ConsolidatedCase[];
  title?: string;
  className?: string;
}

export const ConsolidatedCasesPreview: React.FC<ConsolidatedCasesPreviewProps> = ({
  cases,
  title = "Consolidated Cases",
  className = ""
}) => {
  const getRelationshipColor = (relationship: string) => {
    const relationshipColors: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-800',
      member: 'bg-green-100 text-green-800',
      related: 'bg-yellow-100 text-yellow-800'
    };
    return relationshipColors[relationship.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      dismissed: 'bg-gray-100 text-gray-800'
    };
    return statusColors[status.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Link className="w-5 h-5" />
        {title}
        <Badge variant="secondary" className="text-xs">
          {cases.length} cases
        </Badge>
      </h3>

      {cases.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Link className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No consolidated cases found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map((case_, index) => (
            <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <div>
                    <h4 className="font-medium text-slate-900">{case_.caseNumber}</h4>
                    <p className="text-sm text-slate-600 mt-1">{case_.caseName}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={`text-xs ${getRelationshipColor(case_.relationship)}`}>
                    {case_.relationship}
                  </Badge>
                  <Badge className={`text-xs ${getStatusColor(case_.status)}`}>
                    {case_.status}
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <span className="font-medium">Court:</span> {case_.court}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};