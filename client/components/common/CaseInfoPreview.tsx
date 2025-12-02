import React from 'react';
import { Card } from './Card';

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
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {caseInfo.caseNumber && <p><strong>Case Number:</strong> {caseInfo.caseNumber}</p>}
        {caseInfo.caseName && <p><strong>Case Name:</strong> {caseInfo.caseName}</p>}
        {caseInfo.court && <p><strong>Court:</strong> {caseInfo.court}</p>}
        {caseInfo.filedDate && <p><strong>Filed Date:</strong> {caseInfo.filedDate}</p>}
        {caseInfo.caseType && <p><strong>Case Type:</strong> {caseInfo.caseType}</p>}
        {caseInfo.jurisdiction && <p><strong>Jurisdiction:</strong> {caseInfo.jurisdiction}</p>}
        {caseInfo.status && <p><strong>Status:</strong> {caseInfo.status}</p>}
        {caseInfo.judge && <p><strong>Judge:</strong> {caseInfo.judge}</p>}
      </div>
    </Card>
  );
};