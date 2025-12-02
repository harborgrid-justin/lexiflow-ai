import React from 'react';
import { Card } from './Card';

interface Party {
  name: string;
  type: 'individual' | 'organization';
  role: string;
  counsel?: {
    name: string;
    firm?: string;
    contact?: string;
  };
}

interface PartiesPreviewProps {
  parties: Party[];
  title?: string;
  className?: string;
}

export const PartiesPreview: React.FC<PartiesPreviewProps> = ({
  parties,
  title = "Parties",
  className = ""
}) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {parties.map((party, index) => (
          <div key={index} className="border-b border-gray-200 pb-2">
            <p><strong>{party.name}</strong> ({party.type})</p>
            <p className="text-sm text-gray-600">Role: {party.role}</p>
            {party.counsel && (
              <p className="text-sm text-gray-600">
                Counsel: {party.counsel.name}
                {party.counsel.firm && ` (${party.counsel.firm})`}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};