import React from 'react';
import { Card } from './Card';

interface DocketEntry {
  date: string;
  description: string;
  documentNumber?: string;
  filedBy?: string;
  type?: string;
}

interface DocketEntriesPreviewProps {
  entries: DocketEntry[];
  title?: string;
  maxDisplay?: number;
  className?: string;
}

export const DocketEntriesPreview: React.FC<DocketEntriesPreviewProps> = ({
  entries,
  title = "Docket Entries",
  maxDisplay = 10,
  className = ""
}) => {
  const displayEntries = entries.slice(0, maxDisplay);

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {displayEntries.map((entry, index) => (
          <div key={index} className="border-b border-gray-200 pb-2">
            <p className="text-sm text-gray-600">{entry.date}</p>
            <p>{entry.description}</p>
            {entry.documentNumber && <p className="text-sm">Doc #: {entry.documentNumber}</p>}
            {entry.filedBy && <p className="text-sm">Filed by: {entry.filedBy}</p>}
          </div>
        ))}
        {entries.length > maxDisplay && (
          <p className="text-sm text-gray-500">
            And {entries.length - maxDisplay} more entries...
          </p>
        )}
      </div>
    </Card>
  );
};