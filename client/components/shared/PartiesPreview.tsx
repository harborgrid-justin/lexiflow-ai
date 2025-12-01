import React from 'react';
import { Users, User, Building } from 'lucide-react';
import { Badge } from '../common/Badge';

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
  const getPartyIcon = (type: string) => {
    return type === 'individual' ? User : Building;
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      plaintiff: 'bg-blue-100 text-blue-800',
      defendant: 'bg-red-100 text-red-800',
      petitioner: 'bg-purple-100 text-purple-800',
      respondent: 'bg-orange-100 text-orange-800',
      appellant: 'bg-green-100 text-green-800',
      appellee: 'bg-teal-100 text-teal-800'
    };
    return roleColors[role.toLowerCase()] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
        <Users className="w-5 h-5" />
        {title}
        <Badge variant="secondary" className="text-xs">
          {parties.length} parties
        </Badge>
      </h3>

      {parties.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No parties found in the imported data.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {parties.map((party, index) => {
            const Icon = getPartyIcon(party.type);
            return (
              <div key={index} className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-600" />
                    <div>
                      <h4 className="font-medium text-slate-900">{party.name}</h4>
                      <Badge className={`text-xs mt-1 ${getRoleColor(party.role)}`}>
                        {party.role}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {party.type}
                  </Badge>
                </div>

                {party.counsel && (
                  <div className="pl-8 space-y-2">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">Counsel:</span> {party.counsel.name}
                    </div>
                    {party.counsel.firm && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Firm:</span> {party.counsel.firm}
                      </div>
                    )}
                    {party.counsel.contact && (
                      <div className="text-sm text-slate-600">
                        <span className="font-medium">Contact:</span> {party.counsel.contact}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};