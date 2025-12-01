
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, User, ChevronRight, Shield, Globe, 
  MoreVertical, Plus, CheckCircle 
} from 'lucide-react';
import { ApiService } from '../../services/apiService';
import { Organization, Group, User as UserType } from '../../types';
import { Button, Badge } from '../common';
import { UserAvatar } from '../common/UserAvatar';

export const AdminHierarchy: React.FC = () => {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [o, g, u] = await Promise.all([
                ApiService.getOrganizations(),
                ApiService.getGroups(),
                ApiService.getUsers()
            ]);
            setOrgs(o);
            setGroups(g);
            setUsers(u);
            if (o.length > 0 && !selectedOrgId) setSelectedOrgId(o[0].id);
        } catch (e) {
            console.error("Failed to fetch hierarchy data", e);
        }
    };
    fetchData();
  }, [selectedOrgId]);

  const selectedOrg = orgs.find(o => o.id === selectedOrgId);
  const orgGroups = groups.filter(g => g.orgId === selectedOrgId);
  
  // Users in the selected group OR if no group selected, all users in the org
  const displayedUsers = users.filter(u => 
    u.orgId === selectedOrgId && 
    (!selectedGroupId || u.groupIds?.includes(selectedGroupId))
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-lg overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10 shrink-0">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600"/> Enterprise Hierarchy
          </h3>
          <p className="text-xs text-slate-500 hidden md:block">Manage multi-tenant organizations, groups, and user access.</p>
        </div>
        <Button variant="primary" size="sm" icon={Plus}>Add Org</Button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Column 1: Organizations */}
        <div className="w-full md:w-1/4 md:min-w-[250px] border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col h-48 md:h-full">
          <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase tracking-wide shrink-0">
            Organizations
          </div>
          <div className="flex-1 overflow-y-auto">
            {orgs.map(org => (
              <div 
                key={org.id}
                onClick={() => { setSelectedOrgId(org.id); setSelectedGroupId(null); }}
                className={`p-4 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 group relative ${selectedOrgId === org.id ? 'bg-blue-50/50 border-l-4 md:border-l-0 md:border-r-4 border-blue-600' : 'border-l-4 md:border-l-0 border-transparent'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${org.type === 'LawFirm' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200'}`}>
                      {org.type === 'LawFirm' ? <Shield className="h-5 w-5"/> : org.type === 'Corporate' ? <Building2 className="h-5 w-5"/> : <Globe className="h-5 w-5"/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{org.name}</h4>
                      <Badge variant={org.type === 'Corporate' ? 'active' : 'inactive'} size="sm" className="mt-1">
                        {org.type}
                      </Badge>
                    </div>
                  </div>
                  {selectedOrgId === org.id && <ChevronRight className="h-4 w-4 text-blue-600 hidden md:block"/>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Groups */}
        <div className="w-full md:w-1/4 md:min-w-[250px] border-b md:border-b-0 md:border-r border-slate-200 bg-slate-50/30 flex flex-col h-48 md:h-full">
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
            <span className="font-bold text-xs text-slate-500 uppercase tracking-wide">
              Groups & Depts
            </span>
            {selectedOrgId && <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus className="h-4 w-4"/></button>}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {!selectedOrgId ? (
              <div className="text-center text-slate-400 mt-10 text-sm">Select an Organization</div>
            ) : (
              <>
                <div 
                  onClick={() => setSelectedGroupId(null)}
                  className={`p-3 rounded-lg cursor-pointer flex items-center justify-between border ${!selectedGroupId ? 'bg-white border-blue-300 shadow-sm' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-400"/>
                    <span className="text-sm font-medium">All {selectedOrg?.name} Users</span>
                  </div>
                  {!selectedGroupId && <CheckCircle className="h-4 w-4 text-blue-500"/>}
                </div>
                
                {orgGroups.map(group => (
                  <div 
                    key={group.id}
                    onClick={() => setSelectedGroupId(group.id)}
                    className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedGroupId === group.id ? 'bg-white border-blue-300 shadow-sm' : 'bg-slate-100 border-transparent hover:bg-white hover:shadow-sm'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h5 className={`text-sm font-bold ${selectedGroupId === group.id ? 'text-blue-700' : 'text-slate-700'}`}>{group.name}</h5>
                      <MoreVertical className="h-3 w-3 text-slate-400"/>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {(group.permissions || []).slice(0, 2).map(p => (
                        <Badge key={p} variant="permission" size="sm" className="text-[9px]">
                          {p.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Column 3: Users */}
        <div className="flex-1 bg-white flex flex-col min-w-[300px] h-full overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
            <span className="font-bold text-xs text-slate-500 uppercase tracking-wide truncate max-w-[200px]">
              {selectedGroupId ? `${orgGroups.find(g => g.id === selectedGroupId)?.name}` : 'All Users'}
            </span>
            <div className="flex gap-2">
               <span className="text-xs bg-white border px-2 py-0.5 rounded text-slate-500">{displayedUsers.length}</span>
               <button className="text-blue-600 hover:bg-blue-50 p-1 rounded"><Plus className="h-4 w-4"/></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {displayedUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 py-10">
                <User className="h-12 w-12 mb-2 opacity-20"/>
                <p className="text-sm">No users found.</p>
              </div>
            ) : (
                <>
                {/* Desktop Table */}
                <table className="hidden md:table min-w-full divide-y divide-slate-100">
                    <thead className="bg-white sticky top-0">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Role</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500">Type</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-slate-500">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {displayedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                            <div className="flex items-center">
                            <UserAvatar name={user.name} size="sm" className="mr-3"/>
                            <div>
                                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-4 py-3">
                            <div className="text-xs font-medium text-slate-700">{user.role}</div>
                        </td>
                        <td className="px-4 py-3">
                            <Badge variant={user.userType === 'Internal' ? 'user-internal' : 'user-external'} size="sm">
                              {user.userType}
                            </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <span className="flex items-center justify-end text-xs text-green-600 font-medium">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Active
                            </span>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {/* Mobile List */}
                <div className="md:hidden divide-y divide-slate-100">
                    {displayedUsers.map(user => (
                        <div key={user.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <UserAvatar name={user.name} size="sm" className="mr-3"/>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                    <div className="text-xs text-slate-500">{user.role} • {user.userType}</div>
                                </div>
                            </div>
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                    ))}
                </div>
                </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
