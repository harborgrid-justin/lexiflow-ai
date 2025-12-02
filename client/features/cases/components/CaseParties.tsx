/**
 * Case Parties Component
 * Manage parties involved in a case (plaintiffs, defendants, etc.)
 */

import React, { useState } from 'react';
import { Party, Attorney } from '../../../types';
import { UserPlus, Mail, Phone, Building2, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';

interface CasePartiesProps {
  parties: Party[];
  onAddParty?: (party: Partial<Party>) => void;
  onRemoveParty?: (partyId: string) => void;
  onUpdateParty?: (partyId: string, updates: Partial<Party>) => void;
  isEditable?: boolean;
}

export const CaseParties: React.FC<CasePartiesProps> = ({
  parties,
  onAddParty,
  onRemoveParty,
  onUpdateParty,
  isEditable = false,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedParties, setExpandedParties] = useState<Set<string>>(new Set());
  const [newParty, setNewParty] = useState<Partial<Party>>({
    name: '',
    role: '',
    type: 'Individual',
    contact: '',
  });

  const togglePartyExpansion = (partyId: string) => {
    const newExpanded = new Set(expandedParties);
    if (newExpanded.has(partyId)) {
      newExpanded.delete(partyId);
    } else {
      newExpanded.add(partyId);
    }
    setExpandedParties(newExpanded);
  };

  const handleAddParty = () => {
    if (newParty.name && newParty.role && onAddParty) {
      onAddParty(newParty);
      setNewParty({
        name: '',
        role: '',
        type: 'Individual',
        contact: '',
      });
      setShowAddForm(false);
    }
  };

  const getPartyTypeColor = (type: string) => {
    switch (type) {
      case 'Individual':
        return 'bg-blue-100 text-blue-700';
      case 'Corporation':
        return 'bg-purple-100 text-purple-700';
      case 'Government':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleColor = (role: string) => {
    const lowerRole = role.toLowerCase();
    if (lowerRole.includes('plaintiff')) {
      return 'bg-emerald-100 text-emerald-700';
    } else if (lowerRole.includes('defendant')) {
      return 'bg-red-100 text-red-700';
    } else if (lowerRole.includes('witness')) {
      return 'bg-amber-100 text-amber-700';
    } else if (lowerRole.includes('expert')) {
      return 'bg-indigo-100 text-indigo-700';
    }
    return 'bg-slate-100 text-slate-700';
  };

  if (parties.length === 0 && !isEditable) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 mb-2">
          <UserPlus className="w-12 h-12 mx-auto" />
        </div>
        <p className="text-slate-500 text-sm">No parties added yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Parties List */}
      {parties.map((party) => {
        const isExpanded = expandedParties.has(party.id);
        const hasAttorneys = party.attorneys && party.attorneys.length > 0;

        return (
          <div key={party.id} className="bg-white border border-slate-200 rounded-lg shadow-sm">
            {/* Party Header */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900">{party.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${getPartyTypeColor(party.type)}`}>
                      {party.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleColor(party.role)}`}>
                      {party.role}
                    </span>
                    {party.contact && (
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Mail className="w-3 h-3" />
                        <span>{party.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {hasAttorneys && (
                    <button
                      onClick={() => togglePartyExpansion(party.id)}
                      className="text-slate-600 hover:text-slate-900"
                      title={isExpanded ? 'Hide attorneys' : 'Show attorneys'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                  {isEditable && onRemoveParty && (
                    <button
                      onClick={() => onRemoveParty(party.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Remove party"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Attorneys (Expandable) */}
            {hasAttorneys && isExpanded && (
              <div className="px-4 pb-4 border-t border-slate-200 pt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Attorneys</h4>
                <div className="space-y-3">
                  {party.attorneys?.map((attorney) => (
                    <div key={attorney.id} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">
                            {[attorney.firstName, attorney.middleName, attorney.lastName, attorney.suffix]
                              .filter(Boolean)
                              .join(' ')}
                          </p>
                          {attorney.firm && (
                            <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                              <Building2 className="w-3 h-3" />
                              <span>{attorney.firm}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            {attorney.email && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Mail className="w-3 h-3" />
                                <span>{attorney.email}</span>
                              </div>
                            )}
                            {attorney.phone && (
                              <div className="flex items-center gap-1 text-xs text-slate-600">
                                <Phone className="w-3 h-3" />
                                <span>{attorney.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add Party Form */}
      {isEditable && (
        <div>
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span className="font-medium">Add Party</span>
            </button>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">Add New Party</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                    placeholder="Party name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
                  <input
                    type="text"
                    value={newParty.role}
                    onChange={(e) => setNewParty({ ...newParty, role: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                    placeholder="e.g., Plaintiff, Defendant, Witness"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newParty.type}
                    onChange={(e) => setNewParty({ ...newParty, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Corporation">Corporation</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact</label>
                  <input
                    type="text"
                    value={newParty.contact}
                    onChange={(e) => setNewParty({ ...newParty, contact: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 ring-blue-500 outline-none"
                    placeholder="Email or phone"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleAddParty}
                    disabled={!newParty.name || !newParty.role}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Party
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
