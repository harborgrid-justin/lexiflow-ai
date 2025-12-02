import React from 'react';
import { Card } from './Card';

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
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {cases.map((caseItem, index) => (
          <div key={index} className="border-b border-gray-200 pb-2">
            <p><strong>{caseItem.caseNumber}</strong></p>
            <p>{caseItem.caseName}</p>
            <p className="text-sm text-gray-600">{caseItem.court}</p>
            <p className="text-sm text-gray-600">Status: {caseItem.status}</p>
            <p className="text-sm text-gray-600">Relationship: {caseItem.relationship}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};