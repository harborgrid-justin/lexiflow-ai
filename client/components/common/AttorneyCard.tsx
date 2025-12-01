
import React from 'react';
import { Attorney } from '../../types';
import { Mail, Phone, MapPin, Building, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface AttorneyCardProps {
  attorney: Attorney;
  onEdit?: (attorney: Attorney) => void;
  onRemove?: (attorneyId: string) => void;
  compact?: boolean;
}

export const AttorneyCard: React.FC<AttorneyCardProps> = ({ attorney, onEdit, onRemove, compact = false }) => {
  const fullName = [
    attorney.firstName,
    attorney.middleName,
    attorney.lastName,
    attorney.generation,
    attorney.suffix
  ].filter(Boolean).join(' ');

  const isTerminated = attorney.terminationDate && new Date(attorney.terminationDate) < new Date();

  if (compact) {
    return (
      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:border-blue-300 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-900 text-sm truncate">{fullName}</h4>
              {isTerminated && (
                <Badge variant="danger" size="sm">Terminated</Badge>
              )}
              {attorney.status && !isTerminated && (
                <Badge variant="info" size="sm">{attorney.status}</Badge>
              )}
            </div>
            {attorney.firm && (
              <p className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                <Building className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{attorney.firm}</span>
              </p>
            )}
            {attorney.email && (
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                <span className="truncate">{attorney.email}</span>
              </p>
            )}
          </div>
          {(onEdit || onRemove) && (
            <div className="flex gap-1 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(attorney)}
                  className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(attorney.id)}
                  className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
            {isTerminated && (
              <Badge variant="danger">Terminated</Badge>
            )}
            {attorney.status && !isTerminated && (
              <Badge variant="info">{attorney.status}</Badge>
            )}
          </div>
          {attorney.title && (
            <p className="text-sm text-slate-600">{attorney.title}</p>
          )}
        </div>
        {(onEdit || onRemove) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(attorney)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-50 rounded"
              >
                Edit
              </button>
            )}
            {onRemove && (
              <button
                onClick={() => onRemove(attorney.id)}
                className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 hover:bg-red-50 rounded"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      {/* Firm Information */}
      {attorney.firm && (
        <div className="mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-700">
            <Building className="h-4 w-4 text-slate-400" />
            <span className="font-medium">{attorney.firm}</span>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="space-y-3 mb-4">
        <h4 className="text-xs font-semibold text-slate-500 uppercase">Contact Information</h4>
        
        {attorney.email && (
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-slate-400 shrink-0" />
            <a href={`mailto:${attorney.email}`} className="text-blue-600 hover:underline">
              {attorney.email}
            </a>
          </div>
        )}

        {attorney.phone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <a href={`tel:${attorney.phone}`} className="text-slate-700">
              {attorney.phone}
            </a>
            <span className="text-xs text-slate-400">Primary</span>
          </div>
        )}

        {attorney.businessPhone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <a href={`tel:${attorney.businessPhone}`} className="text-slate-700">
              {attorney.businessPhone}
            </a>
            <span className="text-xs text-slate-400">Business</span>
          </div>
        )}

        {attorney.personalPhone && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <a href={`tel:${attorney.personalPhone}`} className="text-slate-700">
              {attorney.personalPhone}
            </a>
            <span className="text-xs text-slate-400">Personal</span>
          </div>
        )}

        {attorney.fax && (
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-slate-700">{attorney.fax}</span>
            <span className="text-xs text-slate-400">Fax</span>
          </div>
        )}
      </div>

      {/* Address */}
      {(attorney.address1 || attorney.city || attorney.state) && (
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Address</h4>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-slate-700 leading-relaxed">
              {attorney.address1 && <div>{attorney.address1}</div>}
              {attorney.address2 && <div>{attorney.address2}</div>}
              {attorney.address3 && <div>{attorney.address3}</div>}
              {(attorney.office || attorney.unit || attorney.room) && (
                <div className="text-xs text-slate-500">
                  {[attorney.office && `Office: ${attorney.office}`,
                    attorney.unit && `Unit: ${attorney.unit}`,
                    attorney.room && `Room: ${attorney.room}`
                  ].filter(Boolean).join(', ')}
                </div>
              )}
              {(attorney.city || attorney.state || attorney.zip) && (
                <div>
                  {[attorney.city, attorney.state, attorney.zip].filter(Boolean).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Termination Info */}
      {attorney.terminationDate && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Representation Terminated</div>
              <div className="text-xs text-amber-600 mt-1">
                {new Date(attorney.terminationDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notice Info */}
      {attorney.noticeInfo && (
        <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded border border-slate-200">
          <span className="font-semibold">Notice Info:</span> {attorney.noticeInfo}
        </div>
      )}
    </div>
  );
};
