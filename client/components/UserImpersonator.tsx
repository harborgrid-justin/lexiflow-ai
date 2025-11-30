import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Users, ChevronDown, Crown, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ApiService } from '../services/apiService';

interface UserImpersonatorProps {
  onImpersonate: (user: User) => void;
  currentUser: User | null;
}

const getRoleBadgeColor = (role: UserRole | string) => {
  switch (role) {
    case 'Administrator':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Senior Partner':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Partner':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    case 'Associate':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'Paralegal':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Clerk':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const UserImpersonator: React.FC<UserImpersonatorProps> = ({ onImpersonate, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const allUsers = await ApiService.users.getAll();
      setUsers(allUsers);
      console.log('✅ Loaded', allUsers.length, 'users for impersonation');
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && users.length === 0 && !loading) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filteredUsers = users.filter((user) =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.office || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImpersonate = (user: User) => {
    onImpersonate(user);
    setIsOpen(false);
    setSearchTerm('');
    console.log('🎭 Impersonating:', user.name, `(${user.role})`);
  };

  const handleRefresh = async () => {
    await fetchUsers();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105"
        title="Developer Mode: Impersonate Users"
      >
        <Crown className="h-4 w-4" />
        <span className="font-medium text-sm hidden sm:inline">Impersonate User</span>
        <span className="font-medium text-sm sm:hidden">User</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {currentUser && (
        <div className="absolute top-full left-0 mt-1 text-xs text-purple-600 font-medium whitespace-nowrap">
          Viewing as: {currentUser.name}
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3">
              <div className="flex items-center justify-between text-white mb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <h3 className="font-semibold">User Impersonation</h3>
                </div>
                <button onClick={handleRefresh} className="p-1 hover:bg-white/20 rounded transition-colors" title="Refresh user list" disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-purple-100">Select a user to view the app from their perspective</p>
            </div>

            <div className="p-3 border-b border-slate-200">
              <input type="text" placeholder="Search by name, email, role, or office..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" autoFocus disabled={loading} />
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-3 text-purple-600 animate-spin" />
                  <p className="text-sm text-slate-600">Loading users...</p>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-3 text-red-500" />
                  <p className="text-sm text-red-600 font-medium mb-2">Failed to load users</p>
                  <p className="text-xs text-slate-500 mb-3">{error}</p>
                  <button onClick={handleRefresh} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors">Retry</button>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm text-slate-500">{users.length === 0 ? 'No users found in the system' : `No users found matching "${searchTerm}"`}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const isCurrentUser = currentUser?.id === user.id;
                    return (
                      <button key={user.id} onClick={() => handleImpersonate(user)} className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors ${isCurrentUser ? 'bg-purple-50' : ''}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 text-sm truncate">{user.name}</h4>
                              {isCurrentUser && <span className="flex-shrink-0 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full font-medium">Active</span>}
                            </div>
                            <p className="text-xs text-slate-500 truncate mb-1">{user.email}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                              {user.office && <span className="text-xs text-slate-400">📍 {user.office}</span>}
                              {user.status && <span className={`text-xs ${user.status === 'Active' ? 'text-green-600' : 'text-slate-400'}`}>• {user.status}</span>}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {!loading && !error && users.length > 0 && (
              <div className="px-4 py-3 bg-slate-50 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span><strong className="text-purple-600">Developer Mode</strong> - {filteredUsers.length === users.length ? ` ${users.length} users available` : ` ${filteredUsers.length} of ${users.length} shown`}</span>
                  <button onClick={handleRefresh} className="text-purple-600 hover:text-purple-700 font-medium">Refresh</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
