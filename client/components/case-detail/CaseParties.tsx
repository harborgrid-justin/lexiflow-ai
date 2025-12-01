
import React, { useState, useEffect } from 'react';
import { Party, Organization, Attorney } from '../../types';
import { ApiService } from '../../services/apiService';
import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Button } from '../common/Button';
import { Plus, Edit2, Trash2, User, Building, Gavel, Mail, Link, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Inputs';
import { EmptyState } from '../common/EmptyState';
import { FormSection, FormFieldGroup } from '../common';
import { AttorneyCard } from '../common/AttorneyCard';

interface CasePartiesProps {
  parties?: Party[];
  onUpdate: (parties: Party[]) => void;
}

export const CaseParties: React.FC<CasePartiesProps> = ({ parties = [], onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParty, setCurrentParty] = useState<Partial<Party>>({});
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [expandedParties, setExpandedParties] = useState<Set<string>>(new Set());
  const [isAttorneyModalOpen, setIsAttorneyModalOpen] = useState(false);
  const [currentAttorney, setCurrentAttorney] = useState<Partial<Attorney>>({});
  const [selectedPartyId, setSelectedPartyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
        try {
            const data = await ApiService.getOrganizations();
            setOrgs(data || []);
        } catch (e) {
            console.error("Failed to fetch orgs", e);
            setOrgs([]);
        }
    };
    fetchOrgs();
  }, []);
  
  const handleSave = () => {
    if (!currentParty.name || !currentParty.role) return;
    
    let newParties = [...parties];
    if (currentParty.id) {
        // Edit
        newParties = newParties.map(p => p.id === currentParty.id ? { ...p, ...currentParty } as Party : p);
    } else {
        // Add
        const newParty: Party = {
            id: `p-${Date.now()}`,
            name: currentParty.name,
            role: currentParty.role,
            contact: currentParty.contact || '',
            type: currentParty.type || 'Individual',
            counsel: currentParty.counsel,
            linkedOrgId: currentParty.linkedOrgId
        };
        newParties.push(newParty);
    }
    onUpdate(newParties);
    setIsModalOpen(false);
    setCurrentParty({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this party from the case?')) {
        onUpdate(parties.filter(p => p.id !== id));
    }
  };

  const togglePartyExpansion = (partyId: string) => {
    const newExpanded = new Set(expandedParties);
    if (newExpanded.has(partyId)) {
      newExpanded.delete(partyId);
    } else {
      newExpanded.add(partyId);
    }
    setExpandedParties(newExpanded);
  };

  const handleAddAttorney = (partyId: string) => {
    setSelectedPartyId(partyId);
    setCurrentAttorney({});
    setIsAttorneyModalOpen(true);
  };

  const handleEditAttorney = (partyId: string, attorney: Attorney) => {
    setSelectedPartyId(partyId);
    setCurrentAttorney(attorney);
    setIsAttorneyModalOpen(true);
  };

  const handleRemoveAttorney = (partyId: string, attorneyId: string) => {
    if (confirm('Are you sure you want to remove this attorney?')) {
      const updatedParties = parties.map(p => {
        if (p.id === partyId && Array.isArray(p.attorneys)) {
          return {
            ...p,
            attorneys: p.attorneys.filter(a => a.id !== attorneyId)
          };
        }
        return p;
      });
      onUpdate(updatedParties);
    }
  };

  const handleSaveAttorney = () => {
    if (!selectedPartyId || !currentAttorney.firstName || !currentAttorney.lastName) return;
    
    const updatedParties = parties.map(p => {
      if (p.id === selectedPartyId) {
        const attorneys = Array.isArray(p.attorneys) ? [...p.attorneys] : [];
        
        if (currentAttorney.id) {
          // Edit existing attorney
          const index = attorneys.findIndex(a => a.id === currentAttorney.id);
          if (index >= 0) {
            attorneys[index] = currentAttorney as Attorney;
          }
        } else {
          // Add new attorney
          const newAttorney: Attorney = {
            ...currentAttorney,
            id: `att-${Date.now()}`,
            partyId: selectedPartyId
          } as Attorney;
          attorneys.push(newAttorney);
        }
        
        return { ...p, attorneys };
      }
      return p;
    });
    
    onUpdate(updatedParties);
    setIsAttorneyModalOpen(false);
    setCurrentAttorney({});
    setSelectedPartyId(null);
  };

  const openEdit = (party: Party) => {
      setCurrentParty(party);
      setIsModalOpen(true);
  };

  const openNew = () => {
      setCurrentParty({ type: 'Individual' });
      setIsModalOpen(true);
  };

  const getIcon = (type: string) => {
      if (type === 'Corporation') return <Building className="h-4 w-4 text-slate-500"/>;
      if (type === 'Government') return <Gavel className="h-4 w-4 text-slate-500"/>;
      return <User className="h-4 w-4 text-slate-500"/>;
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div>
            <h3 className="text-lg font-bold text-slate-900">Involved Parties</h3>
            <p className="text-sm text-slate-500">Manage plaintiffs, defendants, and other entities.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openNew}>Add Party</Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto border border-slate-200 rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <TableHeader>
                <TableHead>Entity Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Attorneys</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableHeader>
            <TableBody>
                {parties.map(party => {
                    const linkedOrg = orgs.find(o => o.id === party.linkedOrgId);
                    const isExpanded = expandedParties.has(party.id);
                    const attorneys = Array.isArray(party.attorneys) ? party.attorneys : [];
                    const hasCounsel = typeof party.counsel === 'string' && party.counsel.length > 0;
                    
                    return (
                    <React.Fragment key={party.id}>
                      <TableRow>
                        <TableCell className="font-medium text-slate-900">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-full">{getIcon(party.type)}</div>
                                <div>
                                    {party.name}
                                    {linkedOrg && (
                                        <div className="text-[10px] text-blue-600 flex items-center mt-0.5">
                                            <Link className="h-3 w-3 mr-1"/> Linked: {linkedOrg.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={party.role.includes('Plaintiff') ? 'info' : party.role.includes('Defendant') ? 'warning' : 'neutral'}>
                                {party.role}
                            </Badge>
                        </TableCell>
                        <TableCell>{party.type}</TableCell>
                        <TableCell className="text-xs font-mono text-slate-600">{party.contact}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {attorneys.length > 0 ? (
                              <button
                                onClick={() => togglePartyExpansion(party.id)}
                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                {attorneys.length} {attorneys.length === 1 ? 'Attorney' : 'Attorneys'}
                              </button>
                            ) : hasCounsel ? (
                              <span className="text-xs text-slate-500">{party.counsel}</span>
                            ) : (
                              <span className="text-xs text-slate-400">Pro Se</span>
                            )}
                            <button
                              onClick={() => handleAddAttorney(party.id)}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                              title="Add Attorney"
                            >
                              <UserPlus className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <button onClick={() => openEdit(party)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4"/></button>
                                <button onClick={() => handleDelete(party.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
                            </div>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expanded Attorney Details Row */}
                      {isExpanded && attorneys.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="bg-slate-50 p-4">
                            <div className="space-y-3">
                              <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Attorneys for {party.name}</h4>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {attorneys.map(attorney => (
                                  <AttorneyCard
                                    key={attorney.id}
                                    attorney={attorney}
                                    compact
                                    onEdit={(att) => handleEditAttorney(party.id, att)}
                                    onRemove={(attId) => handleRemoveAttorney(party.id, attId)}
                                  />
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                )})}
                {parties.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6}>
                            <EmptyState
                                title="No parties recorded"
                                description="Add parties to this case to track involved individuals and organizations."
                                variant="inline"
                            />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 overflow-y-auto flex-1">
        {parties.map(party => {
          const attorneys = Array.isArray(party.attorneys) ? party.attorneys : [];
          const hasCounsel = typeof party.counsel === 'string' && party.counsel.length > 0;
          const isExpanded = expandedParties.has(party.id);
          
          return (
            <div key={party.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full">{getIcon(party.type)}</div>
                        <div>
                            <h4 className="font-bold text-slate-900">{party.name}</h4>
                            <p className="text-xs text-slate-500">{party.type}</p>
                        </div>
                    </div>
                    <Badge variant={party.role.includes('Plaintiff') ? 'info' : party.role.includes('Defendant') ? 'warning' : 'neutral'}>
                        {party.role}
                    </Badge>
                </div>
                <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                    <div className="flex items-center text-slate-600">
                        <Mail className="h-3 w-3 mr-2 text-slate-400"/> {party.contact || 'No contact info'}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-slate-600">
                        <Gavel className="h-3 w-3 mr-2 text-slate-400"/> 
                        {attorneys.length > 0 ? (
                          <button
                            onClick={() => togglePartyExpansion(party.id)}
                            className="text-blue-600 font-medium flex items-center gap-1"
                          >
                            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            {attorneys.length} {attorneys.length === 1 ? 'Attorney' : 'Attorneys'}
                          </button>
                        ) : hasCounsel ? (
                          `Counsel: ${party.counsel}`
                        ) : (
                          'Pro Se'
                        )}
                      </div>
                      <button
                        onClick={() => handleAddAttorney(party.id)}
                        className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                </div>
                
                {/* Expanded Attorneys */}
                {isExpanded && attorneys.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    {attorneys.map(attorney => (
                      <AttorneyCard
                        key={attorney.id}
                        attorney={attorney}
                        compact
                        onEdit={(att) => handleEditAttorney(party.id, att)}
                        onRemove={(attId) => handleRemoveAttorney(party.id, attId)}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-4 pt-2 border-t border-slate-50">
                    <button onClick={() => openEdit(party)} className="text-sm font-medium text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(party.id)} className="text-sm font-medium text-red-600">Remove</button>
                </div>
            </div>
        )})}
        {parties.length === 0 && (
            <EmptyState
                title="No parties recorded"
                description="Add parties to this case to track involved individuals and organizations."
                variant="card"
            />
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentParty.id ? 'Edit Party' : 'Add New Party'}>
          <div className="p-6 space-y-4">
              <Input label="Name" value={currentParty.name || ''} onChange={e => setCurrentParty({...currentParty, name: e.target.value})} placeholder="e.g. John Doe or Acme Corp"/>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Role</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm bg-white" value={currentParty.role || ''} onChange={e => setCurrentParty({...currentParty, role: e.target.value})}>
                          <option value="">Select Role...</option>
                          <option value="Plaintiff">Plaintiff</option>
                          <option value="Defendant">Defendant</option>
                          <option value="Witness">Witness</option>
                          <option value="Expert">Expert</option>
                          <option value="Judge">Judge</option>
                      </select>
                  </div>
                  <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Type</label>
                      <select className="w-full px-3 py-2 border rounded-md text-sm bg-white" value={currentParty.type || 'Individual'} onChange={e => setCurrentParty({...currentParty, type: e.target.value as any})}>
                          <option value="Individual">Individual</option>
                          <option value="Corporation">Corporation</option>
                          <option value="Government">Government</option>
                      </select>
                  </div>
              </div>
              <Input label="Contact Info" value={currentParty.contact || ''} onChange={e => setCurrentParty({...currentParty, contact: e.target.value})} placeholder="Email, Phone, or Address"/>
              <Input label="Legal Counsel" value={currentParty.counsel || ''} onChange={e => setCurrentParty({...currentParty, counsel: e.target.value})} placeholder="Firm or Attorney Name"/>
              
              {currentParty.type === 'Corporation' && (
                  <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Link to Organization (Internal DB)</label>
                      <select 
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white" 
                        value={currentParty.linkedOrgId || ''} 
                        onChange={e => setCurrentParty({...currentParty, linkedOrgId: e.target.value})}
                      >
                          <option value="">No Link</option>
                          {orgs.map(org => (
                              <option key={org.id} value={org.id}>{org.name} ({org.type})</option>
                          ))}
                      </select>
                  </div>
              )}

              <div className="pt-4 flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSave}>Save Party</Button>
              </div>
          </div>
      </Modal>

      {/* Attorney Modal */}
      <Modal 
        isOpen={isAttorneyModalOpen} 
        onClose={() => setIsAttorneyModalOpen(false)} 
        title={currentAttorney.id ? 'Edit Attorney' : 'Add Attorney'}
        size="lg"
      >
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="First Name *" 
                    value={currentAttorney.firstName || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, firstName: e.target.value})} 
                  />
                  <Input 
                    label="Last Name *" 
                    value={currentAttorney.lastName || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, lastName: e.target.value})} 
                  />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                  <Input 
                    label="Middle Name" 
                    value={currentAttorney.middleName || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, middleName: e.target.value})} 
                  />
                  <Input 
                    label="Generation" 
                    placeholder="Jr., Sr., III" 
                    value={currentAttorney.generation || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, generation: e.target.value})} 
                  />
                  <Input 
                    label="Suffix" 
                    placeholder="Esq." 
                    value={currentAttorney.suffix || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, suffix: e.target.value})} 
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <Input 
                    label="Title" 
                    placeholder="Partner, Associate" 
                    value={currentAttorney.title || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, title: e.target.value})} 
                  />
                  <Input 
                    label="Law Firm" 
                    value={currentAttorney.firm || ''} 
                    onChange={e => setCurrentAttorney({...currentAttorney, firm: e.target.value})} 
                  />
              </div>

              <FormSection title="Contact Information">
                <FormFieldGroup columns={2}>
                  <Input
                    label="Email"
                    type="email"
                    value={currentAttorney.email || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, email: e.target.value})}
                  />
                  <Input
                    label="Primary Phone"
                    value={currentAttorney.phone || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, phone: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={3} className="mt-4">
                  <Input
                    label="Business Phone"
                    value={currentAttorney.businessPhone || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, businessPhone: e.target.value})}
                  />
                  <Input
                    label="Personal Phone"
                    value={currentAttorney.personalPhone || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, personalPhone: e.target.value})}
                  />
                  <Input
                    label="Fax"
                    value={currentAttorney.fax || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, fax: e.target.value})}
                  />
                </FormFieldGroup>
              </FormSection>

              <FormSection title="Address">
                <FormFieldGroup columns={1}>
                  <Input
                    label="Address Line 1"
                    value={currentAttorney.address1 || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, address1: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={1} className="mt-3">
                  <Input
                    label="Address Line 2"
                    value={currentAttorney.address2 || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, address2: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={1} className="mt-3">
                  <Input
                    label="Address Line 3"
                    value={currentAttorney.address3 || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, address3: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={3} className="mt-4">
                  <Input
                    label="City"
                    value={currentAttorney.city || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, city: e.target.value})}
                  />
                  <Input
                    label="State"
                    value={currentAttorney.state || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, state: e.target.value})}
                  />
                  <Input
                    label="ZIP"
                    value={currentAttorney.zip || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, zip: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={3} className="mt-4">
                  <Input
                    label="Office"
                    value={currentAttorney.office || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, office: e.target.value})}
                  />
                  <Input
                    label="Unit"
                    value={currentAttorney.unit || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, unit: e.target.value})}
                  />
                  <Input
                    label="Room"
                    value={currentAttorney.room || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, room: e.target.value})}
                  />
                </FormFieldGroup>
              </FormSection>

              <FormSection title="Additional Information">
                <FormFieldGroup columns={2}>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Status</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                      value={currentAttorney.status || 'Active'}
                      onChange={e => setCurrentAttorney({...currentAttorney, status: e.target.value})}
                    >
                        <option value="Active">Active</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Pro Hac Vice">Pro Hac Vice</option>
                        <option value="Lead Counsel">Lead Counsel</option>
                    </select>
                  </div>
                  <Input
                    label="Termination Date"
                    type="date"
                    value={currentAttorney.terminationDate || ''}
                    onChange={e => setCurrentAttorney({...currentAttorney, terminationDate: e.target.value})}
                  />
                </FormFieldGroup>
                <FormFieldGroup columns={1} className="mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Notice Information</label>
                    <textarea
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      rows={2}
                      value={currentAttorney.noticeInfo || ''}
                      onChange={e => setCurrentAttorney({...currentAttorney, noticeInfo: e.target.value})}
                      placeholder="e.g., Notice by Electronic Service Consented, Designation of Electronic Service"
                    />
                  </div>
                </FormFieldGroup>
              </FormSection>

              <div className="pt-4 flex justify-end gap-2 border-t">
                  <Button variant="secondary" onClick={() => setIsAttorneyModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSaveAttorney}>Save Attorney</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};
