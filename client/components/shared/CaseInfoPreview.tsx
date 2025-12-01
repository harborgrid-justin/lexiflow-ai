import React from 'react';
import { FileText, Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '../common/Badge';

interface CaseInfo {
  caseNumber?: string;
  caseName?: string;
  court?: string;
  filedDate?: string;
  caseType?: string;
  jurisdiction?: string;
  status?: string;
  judge?: string;
}

interface CaseInfoPreviewProps {
  caseInfo: CaseInfo;
  title?: string;
  className?: string;
}

export const CaseInfoPreview: React.FC<CaseInfoPreviewProps> = ({
  caseInfo,
  title = "Case Information",
  className = ""
}) => {
  const infoItems = [
    {
      icon: FileText,
      label: "Case Number",
      value: caseInfo.caseNumber,
      badge: caseInfo.caseNumber ? "primary" : "secondary"
    },
    {
      icon: FileText,
      label: "Case Name",
      value: caseInfo.caseName,
      badge: "secondary"
    },
    {
      icon: MapPin,
      label: "Court",
      value: caseInfo.court,
      badge: "secondary"
    },
    {
      icon: Calendar,
      label: "Filed Date",
      value: caseInfo.filedDate,
      badge: "secondary"
    },
    {
      icon: FileText,
      label: "Case Type",
      value: caseInfo.caseType,
      badge: "secondary"
    },
    {
      icon: MapPin,
      label: "Jurisdiction",
      value: caseInfo.jurisdiction,
      badge: "secondary"
    },
    {
      icon: Users,
      label: "Judge",
      value: caseInfo.judge,
      badge: "secondary"
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        {title}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{item.label}:</span>
            </div>
            <div className="flex-1 ml-3">
              {item.value ? (
                <Badge variant={item.badge as any} className="text-xs">
                  {item.value}
                </Badge>
              ) : (
                <span className="text-sm text-slate-500 italic">Not available</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {caseInfo.status && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">Status:</span>
          </div>
          <Badge variant="primary" className="text-xs">
            {caseInfo.status}
          </Badge>
        </div>
      )}
    </div>
  );
};