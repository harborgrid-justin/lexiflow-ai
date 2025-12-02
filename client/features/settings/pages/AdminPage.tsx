import React, { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  DollarSign,
  FileText,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  MoreVertical,
  Download,
  RefreshCw,
  X,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResendInvitation,
  useRoles,
  useAuditLog,
  useExportAuditLog,
  useOrganizationStats,
} from '../api/admin.api';
import {
  useOrganizationSettings,
  useUpdateOrganizationSettings,
} from '../api/settings.api';
import type {
  User,
  UserRole,
  UserStatus,
  AuditLogFilters,
  CreateUserInput,
} from '../api/settings.types';

type AdminTab = 'organization' | 'users' | 'roles' | 'billing' | 'audit';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('organization');

  const tabs = [
    { id: 'organization' as AdminTab, label: 'Organization', icon: Building2 },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'roles' as AdminTab, label: 'Roles & Permissions', icon: Shield },
    { id: 'billing' as AdminTab, label: 'Billing', icon: DollarSign },
    { id: 'audit' as AdminTab, label: 'Audit Log', icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Administration</h1>
        <p className="text-slate-600 mt-1">Manage your organization settings and users</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-slate-200 bg-slate-50">
          <nav className="flex space-x-1 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors
                    ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'organization' && <OrganizationTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'roles' && <RolesTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'audit' && <AuditLogTab />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Organization Tab
// ============================================================================

const OrganizationTab: React.FC = () => {
  const { data: settings } = useOrganizationSettings();
  const { data: stats } = useOrganizationStats();
  const updateSettings = useUpdateOrganizationSettings();

  const [formData, setFormData] = useState({
    firmName: settings?.firmName || '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    website: settings?.website || '',
    street: settings?.businessAddress?.street || '',
    city: settings?.businessAddress?.city || '',
    state: settings?.businessAddress?.state || '',
    zip: settings?.businessAddress?.zip || '',
    country: settings?.businessAddress?.country || 'USA',
    partnerRate: settings?.defaultBillingRates?.partner || 500,
    associateRate: settings?.defaultBillingRates?.associate || 350,
    paralegalRate: settings?.defaultBillingRates?.paralegal || 150,
    clerkRate: settings?.defaultBillingRates?.clerk || 100,
    practiceAreas: settings?.practiceAreas?.join(', ') || '',
    matterTypes: settings?.matterTypes?.join(', ') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      firmName: formData.firmName,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      businessAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
      },
      defaultBillingRates: {
        partner: formData.partnerRate,
        associate: formData.associateRate,
        paralegal: formData.paralegalRate,
        clerk: formData.clerkRate,
      },
      practiceAreas: formData.practiceAreas.split(',').map((s) => s.trim()).filter(Boolean),
      matterTypes: formData.matterTypes.split(',').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Active Cases</p>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.activeCases}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium">Documents</p>
            <p className="text-2xl font-bold text-purple-900 mt-1">{stats.totalDocuments}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-sm text-orange-600 font-medium">Storage Used</p>
            <p className="text-2xl font-bold text-orange-900 mt-1">
              {(stats.storageUsed / 1024 / 1024 / 1024).toFixed(1)} GB
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Firm Information */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Firm Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Firm Name</label>
              <input
                type="text"
                value={formData.firmName}
                onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Business Address */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Business Address</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ZIP Code</label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Default Billing Rates */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Default Billing Rates ($/hour)</h3>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Partner</label>
              <input
                type="number"
                value={formData.partnerRate}
                onChange={(e) => setFormData({ ...formData, partnerRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Associate</label>
              <input
                type="number"
                value={formData.associateRate}
                onChange={(e) => setFormData({ ...formData, associateRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paralegal</label>
              <input
                type="number"
                value={formData.paralegalRate}
                onChange={(e) => setFormData({ ...formData, paralegalRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Clerk</label>
              <input
                type="number"
                value={formData.clerkRate}
                onChange={(e) => setFormData({ ...formData, clerkRate: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Practice Areas & Matter Types */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Practice Areas</label>
            <textarea
              value={formData.practiceAreas}
              onChange={(e) => setFormData({ ...formData, practiceAreas: e.target.value })}
              rows={4}
              placeholder="Civil Litigation, Corporate Law, Family Law (comma-separated)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Matter Types</label>
            <textarea
              value={formData.matterTypes}
              onChange={(e) => setFormData({ ...formData, matterTypes: e.target.value })}
              rows={4}
              placeholder="Contract Dispute, Merger & Acquisition, Divorce (comma-separated)"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={updateSettings.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

// ============================================================================
// Users Tab
// ============================================================================

const UsersTab: React.FC = () => {
  const { data: users } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const resendInvitation = useResendInvitation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'partner': return 'bg-blue-100 text-blue-700';
      case 'associate': return 'bg-green-100 text-green-700';
      case 'paralegal': return 'bg-yellow-100 text-yellow-700';
      case 'clerk': return 'bg-gray-100 text-gray-700';
      case 'client': return 'bg-pink-100 text-pink-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'suspended': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <button
          onClick={() => setShowInviteDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Last Login</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers?.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-600">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : 'Never'}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === 'pending' && (
                      <button
                        onClick={() => resendInvitation.mutate(user.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Resend Invitation"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to deactivate ${user.name}?`)) {
                          deleteUser.mutate(user.id);
                        }
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Deactivate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite User Dialog */}
      {showInviteDialog && (
        <InviteUserDialog
          onClose={() => setShowInviteDialog(false)}
          onSubmit={(data) => {
            createUser.mutate(data, {
              onSuccess: () => setShowInviteDialog(false),
            });
          }}
          isSubmitting={createUser.isPending}
        />
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={(data) => {
            updateUser.mutate(
              { id: editingUser.id, data },
              {
                onSuccess: () => setEditingUser(null),
              }
            );
          }}
          isSubmitting={updateUser.isPending}
        />
      )}
    </div>
  );
};

// ============================================================================
// Roles Tab
// ============================================================================

const RolesTab: React.FC = () => {
  const { data: roles } = useRoles();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Roles & Permissions</h3>
          <p className="text-sm text-slate-600">Manage user roles and their permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Custom Role
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {roles?.map((role) => (
          <div key={role.id} className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">{role.name}</h4>
                <p className="text-sm text-slate-600 mt-1">{role.description}</p>
              </div>
              {!role.isSystem && (
                <button className="p-1 text-slate-400 hover:text-slate-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 6).map((permission) => (
                <span
                  key={permission}
                  className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                >
                  {permission}
                </span>
              ))}
              {role.permissions.length > 6 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                  +{role.permissions.length - 6} more
                </span>
              )}
            </div>
            {role.isSystem && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <span className="text-xs text-slate-500">System Role</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Billing Tab
// ============================================================================

const BillingTab: React.FC = () => {
  return (
    <div className="text-center py-12">
      <DollarSign className="w-16 h-16 mx-auto text-slate-400 mb-4" />
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Billing Settings</h3>
      <p className="text-slate-600 mb-4">
        Configure billing rates, invoice templates, and payment integrations
      </p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Configure Billing
      </button>
    </div>
  );
};

// ============================================================================
// Audit Log Tab
// ============================================================================

const AuditLogTab: React.FC = () => {
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    limit: 50,
  });

  const { data: auditLog } = useAuditLog(filters);
  const exportAuditLog = useExportAuditLog();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Audit Log</h3>
          <p className="text-sm text-slate-600">Track all user actions and system events</p>
        </div>
        <button
          onClick={() => exportAuditLog.mutate(filters)}
          disabled={exportAuditLog.isPending}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 disabled:opacity-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          {exportAuditLog.isPending ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-3">
        <input
          type="date"
          value={filters.startDate || ''}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={filters.endDate || ''}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
          placeholder="End Date"
        />
        <select
          value={filters.action || ''}
          onChange={(e) => setFilters({ ...filters, action: e.target.value as any })}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
        >
          <option value="">All Actions</option>
          <option value="user:login">Login</option>
          <option value="user:logout">Logout</option>
          <option value="case:create">Case Created</option>
          <option value="case:update">Case Updated</option>
          <option value="document:create">Document Created</option>
        </select>
        <button
          onClick={() => setFilters({ page: 1, limit: 50 })}
          className="px-3 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50"
        >
          Clear Filters
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Resource</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {auditLog?.entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-900">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-slate-600">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{entry.userName}</p>
                  <p className="text-xs text-slate-600">{entry.userEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-900">{entry.resource}</p>
                  {entry.resourceId && (
                    <p className="text-xs text-slate-600">{entry.resourceId}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-slate-600">
                    {entry.details ? JSON.stringify(entry.details).slice(0, 50) + '...' : '-'}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {auditLog && auditLog.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing {((auditLog.page - 1) * auditLog.limit) + 1} to{' '}
            {Math.min(auditLog.page * auditLog.limit, auditLog.total)} of {auditLog.total} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
              disabled={auditLog.page === 1}
              className="px-3 py-1 text-sm text-slate-600 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
              disabled={auditLog.page === auditLog.totalPages}
              className="px-3 py-1 text-sm text-slate-600 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Dialogs
// ============================================================================

interface InviteUserDialogProps {
  onClose: () => void;
  onSubmit: (data: CreateUserInput) => void;
  isSubmitting: boolean;
}

const InviteUserDialog: React.FC<InviteUserDialogProps> = ({ onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    name: '',
    role: 'associate',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Invite User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="partner">Partner</option>
              <option value="associate">Associate</option>
              <option value="paralegal">Paralegal</option>
              <option value="clerk">Clerk</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditUserDialogProps {
  user: User;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ user, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    status: user.status,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Edit User</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="admin">Admin</option>
              <option value="partner">Partner</option>
              <option value="associate">Associate</option>
              <option value="paralegal">Paralegal</option>
              <option value="clerk">Clerk</option>
              <option value="client">Client</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
