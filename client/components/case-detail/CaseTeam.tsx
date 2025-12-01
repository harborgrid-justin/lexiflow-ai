import React, { useState, useEffect } from 'react';
import { CaseMember, User } from '../../types';
import { ApiService } from '../../services/apiService';
import { Plus, X, Shield, Mail } from 'lucide-react';
import { Button, Modal, Avatar, Badge } from '../common';

interface CaseTeamProps {
  caseId: string;
}

export const CaseTeam: React.FC<CaseTeamProps> = ({ caseId }) => {
  const [team, setTeam] = useState<CaseMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('Associate');

  useEffect(() => {
    fetchTeam();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  const fetchTeam = async () => {
    try {
      const members = await ApiService.getCaseTeam(caseId);
      setTeam(members);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
        await ApiService.addCaseTeamMember(caseId, selectedUser, selectedRole);
        await fetchTeam();
        setIsAddModalOpen(false);
        setSelectedUser('');
    } catch (e) {
        console.error(e);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this user from the case?')) return;
    try {
        await ApiService.removeCaseTeamMember(caseId, userId);
        setTeam(team.filter(m => m.userId !== userId));
    } catch (e) {
        console.error(e);
    }
  };

  const openAddModal = async () => {
      try {
          const users = await ApiService.getUsers();
          // Filter out existing team members
          const existingIds = team.map(m => m.userId);
          setAvailableUsers(users.filter(u => !existingIds.includes(u.id)));
          setIsAddModalOpen(true);
      } catch (e) {
          console.error(e);
      }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading team...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h3 className="text-lg font-bold text-slate-900">Case Team</h3>
            <p className="text-sm text-slate-500">Manage access and roles for this matter.</p>
        </div>
        <Button icon={Plus} onClick={openAddModal}>Add Member</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(member => (
            <div key={member.userId} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-start justify-between group">
                <div className="flex items-start space-x-3">
                    <Avatar name={member.user?.name || 'Unknown'} size="md" color="slate" />
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">{member.user?.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center mt-0.5"><Mail className="h-3 w-3 mr-1"/> {member.user?.email}</p>
                        <Badge 
                          variant={
                            member.role === 'Lead' ? 'info' :
                            member.role === 'Associate' ? 'active' :
                            'inactive'
                          } 
                          size="sm" 
                          className="mt-2"
                        >
                            {member.role === 'Lead' && <Shield className="h-3 w-3 mr-1"/>}
                            {member.role}
                        </Badge>
                    </div>
                </div>
                <button onClick={() => handleRemoveMember(member.userId)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="h-4 w-4"/>
                </button>
            </div>
        ))}
        
        {team.length === 0 && (
            <div className="col-span-full text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                No team members assigned yet.
            </div>
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Team Member">
        <div className="p-6 space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select User</label>
                <select className="w-full border rounded-md p-2" value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">-- Select User --</option>
                    {availableUsers.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select className="w-full border rounded-md p-2" value={selectedRole} onChange={e => setSelectedRole(e.target.value)}>
                    <option value="Lead">Lead Attorney</option>
                    <option value="Associate">Associate</option>
                    <option value="Paralegal">Paralegal</option>
                    <option value="Observer">Observer</option>
                </select>
            </div>
            <div className="flex justify-end pt-4">
                <Button onClick={handleAddMember} disabled={!selectedUser}>Add to Team</Button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
