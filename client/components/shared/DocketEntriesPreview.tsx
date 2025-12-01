import React, { useState } from 'react';
import { FileText, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

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
  const [showAll, setShowAll] = useState(false);
  const displayEntries = showAll ? entries : entries.slice(0, maxDisplay);
  const hasMore = entries.length > maxDisplay;

  const getEntryTypeColor = (type?: string) => {
    const typeColors: Record<string, string> = {
      motion: 'bg-blue-100 text-blue-800',
      order: 'bg-green-100 text-green-800',
      notice: 'bg-yellow-100 text-yellow-800',
      judgment: 'bg-red-100 text-red-800',
      pleading: 'bg-purple-100 text-purple-800'
    };
    return typeColors[type?.toLowerCase() || ''] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
          <Badge variant="secondary" className="text-xs">
            {entries.length} entries
          </Badge>
        </h3>
        {hasMore && (
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:text-blue-700"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show All ({entries.length})
              </>
            )}
          </Button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No docket entries found in the imported data.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayEntries.map((entry, index) => (
            <div key={index} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-900">{entry.date}</span>
                  {entry.documentNumber && (
                    <Badge variant="outline" className="text-xs">
                      Doc #{entry.documentNumber}
                    </Badge>
                  )}
                </div>
                {entry.type && (
                  <Badge className={`text-xs ${getEntryTypeColor(entry.type)}`}>
                    {entry.type}
                  </Badge>
                )}
              </div>

              <p className="text-sm text-slate-700 mb-2">{entry.description}</p>

              {entry.filedBy && (
                <div className="text-xs text-slate-600">
                  <span className="font-medium">Filed by:</span> {entry.filedBy}
                </div>
              )}
            </div>
          ))}

          {!showAll && hasMore && (
            <div className="text-center py-2">
              <span className="text-sm text-slate-500">
                ... and {entries.length - maxDisplay} more entries
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};