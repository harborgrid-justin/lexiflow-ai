
import React, { useState } from 'react';
import { Party } from '../../types';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Button } from '../common/Button';
import { Plus, Edit2, Trash2, User, Building, Gavel } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Inputs';
import { Badge } from '../common/Badge';

interface CasePartiesProps {
  parties?: Party[];
  onUpdate: (parties: Party[]) => void;
}

export const CaseParties: React.FC<CasePartiesProps> = ({ parties = [], onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParty, setCurrentParty] = useState<Partial<Party>>({});
  
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
            counsel: currentParty.counsel
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-lg font-bold text-slate-900">Involved Parties</h3>
            <p className="text-sm text-slate-500">Manage plaintiffs, defendants, and other entities.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openNew}>Add Party</Button>
      </div>

      <TableContainer>
        <TableHeader>
            <TableHead>Entity Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Counsel</TableHead>
            <TableHead className="text-right">Actions</TableHead>
        </TableHeader>
        <TableBody>
            {parties.map(party => (
                <TableRow key={party.id}>
                    <TableCell className="font-medium text-slate-900 flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-full">{getIcon(party.type)}</div>
                        {party.name}
                    </TableCell>
                    <TableCell>
                        <Badge variant={party.role.includes('Plaintiff') ? 'info' : party.role.includes('Defendant') ? 'warning' : 'neutral'}>
                            {party.role}
                        </Badge>
                    </TableCell>
                    <TableCell>{party.type}</TableCell>
                    <TableCell className="text-xs font-mono text-slate-600">{party.contact}</TableCell>
                    <TableCell className="text-xs text-slate-500">{party.counsel || '-'}</TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(party)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4"/></button>
                            <button onClick={() => handleDelete(party.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4"/></button>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
            {parties.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-400 italic">No parties recorded.</TableCell>
                </TableRow>
            )}
        </TableBody>
      </TableContainer>

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
              
              <div className="pt-4 flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button variant="primary" onClick={handleSave}>Save Party</Button>
              </div>
          </div>
      </Modal>
    </div>
  );
};
