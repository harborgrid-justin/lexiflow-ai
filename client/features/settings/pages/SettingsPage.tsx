import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Clock,
  Calendar,
  Key,
  Smartphone,
  Monitor,
  LogOut,
  Briefcase,
  FileSignature,
  Save,
  Upload,
} from 'lucide-react';
import {
  useUserSettings,
  useUpdateUserSettings,
  useChangePassword,
  useSetupTwoFactor,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useSessions,
  useRevokeSession,
  useRevokeAllSessions,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useUploadAvatar,
} from '../api/settings.api';
import type { Theme, DateFormat, DigestFrequency } from '../api/settings.types';

type Tab = 'profile' | 'preferences' | 'notifications' | 'security' | 'integrations';

interface SettingsPageProps {
  currentUser: any; // User from context
}

const NotificationToggle: React.FC<{
  label: string;
  description: string;
  emailChecked: boolean;
  inAppChecked: boolean;
  onEmailChange: (checked: boolean) => void;
  onInAppChange: (checked: boolean) => void;
}> = ({ label, description, emailChecked, inAppChecked, onEmailChange, onInAppChange }) => (
  <div className="flex items-start justify-between py-3">
    <div className="flex-1">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <p className="text-xs text-slate-600">{description}</p>
    </div>
    <div className="flex items-center gap-6 ml-4">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={emailChecked}
          onChange={(e) => onEmailChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-slate-700">Email</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={inAppChecked}
          onChange={(e) => onInAppChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-sm text-slate-700">In-App</span>
      </label>
    </div>
  </div>
);

export const SettingsPage: React.FC<SettingsPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'preferences' as Tab, label: 'Preferences', icon: Settings },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
    { id: 'integrations' as Tab, label: 'Integrations', icon: Globe },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account settings and preferences</p>
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
          {activeTab === 'profile' && <ProfileTab currentUser={currentUser} />}
          {activeTab === 'preferences' && <PreferencesTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'integrations' && <IntegrationsTab />}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Profile Tab
// ============================================================================

const ProfileTab: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();
  const uploadAvatar = useUploadAvatar();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: settings?.phone || '',
    title: settings?.title || '',
    barNumber: settings?.barNumber || '',
    signature: settings?.signature || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      phone: formData.phone,
      title: formData.title,
      barNumber: formData.barNumber,
      signature: formData.signature,
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Profile Information</h3>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">Profile Photo</p>
            <p className="text-xs text-slate-600 mt-1">
              JPG, PNG or GIF. Max 5MB. Recommended 400x400px.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">
                Contact admin to change your name
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">
                Contact admin to change your email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Senior Associate"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bar Number
              </label>
              <input
                type="text"
                value={formData.barNumber}
                onChange={(e) => setFormData({ ...formData, barNumber: e.target.value })}
                placeholder="e.g., 123456"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              <FileSignature className="w-4 h-4 inline mr-1" />
              Email Signature
            </label>
            <textarea
              value={formData.signature}
              onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
              rows={4}
              placeholder="Your email signature..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateSettings.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Preferences Tab
// ============================================================================

const PreferencesTab: React.FC = () => {
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const [formData, setFormData] = useState({
    theme: (settings?.theme || 'system') as Theme,
    language: settings?.language || 'en',
    timezone: settings?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: (settings?.dateFormat || 'MM/DD/YYYY') as DateFormat,
    defaultView: settings?.defaultView || 'dashboard',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferences</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Palette className="w-4 h-4 inline mr-1" />
              Theme
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setFormData({ ...formData, theme })}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-colors text-sm font-medium
                    ${
                      formData.theme === theme
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-slate-200 hover:border-slate-300'
                    }
                  `}
                >
                  {theme === 'light' && '☀️ Light'}
                  {theme === 'dark' && '🌙 Dark'}
                  {theme === 'system' && '💻 System'}
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" />
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Anchorage">Alaska Time (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
            </select>
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Date Format
            </label>
            <select
              value={formData.dateFormat}
              onChange={(e) =>
                setFormData({ ...formData, dateFormat: e.target.value as DateFormat })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
            </select>
          </div>

          {/* Default View */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Default Home View
            </label>
            <select
              value={formData.defaultView}
              onChange={(e) => setFormData({ ...formData, defaultView: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="dashboard">Dashboard</option>
              <option value="cases">Cases</option>
              <option value="calendar">Calendar</option>
              <option value="documents">Documents</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateSettings.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Notifications Tab
// ============================================================================

const NotificationsTab: React.FC = () => {
  const { data: settings } = useUserSettings();
  const updateSettings = useUpdateUserSettings();

  const [emailNotifications, setEmailNotifications] = useState(
    settings?.emailNotifications || {
      caseUpdates: true,
      deadlines: true,
      messages: true,
      assignments: true,
      mentions: true,
      systemAlerts: true,
    }
  );

  const [inAppNotifications, setInAppNotifications] = useState(
    settings?.inAppNotifications || {
      caseUpdates: true,
      deadlines: true,
      messages: true,
      assignments: true,
      mentions: true,
    }
  );

  const [digestFrequency, setDigestFrequency] = useState<DigestFrequency>(
    settings?.digestFrequency || 'daily'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      emailNotifications,
      inAppNotifications,
      digestFrequency,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Preferences</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-200">
              <h4 className="text-sm font-semibold text-slate-900">Notification Type</h4>
              <div className="flex gap-6">
                <span className="text-xs font-medium text-slate-600">Email</span>
                <span className="text-xs font-medium text-slate-600">In-App</span>
              </div>
            </div>

            <div className="space-y-1">
              <NotificationToggle
                label="Case Updates"
                description="Status changes, new documents, and case activity"
                emailChecked={emailNotifications.caseUpdates}
                inAppChecked={inAppNotifications.caseUpdates}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, caseUpdates: checked })
                }
                onInAppChange={(checked) =>
                  setInAppNotifications({ ...inAppNotifications, caseUpdates: checked })
                }
              />

              <NotificationToggle
                label="Deadlines"
                description="Upcoming deadlines and due dates"
                emailChecked={emailNotifications.deadlines}
                inAppChecked={inAppNotifications.deadlines}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, deadlines: checked })
                }
                onInAppChange={(checked) =>
                  setInAppNotifications({ ...inAppNotifications, deadlines: checked })
                }
              />

              <NotificationToggle
                label="Messages"
                description="New messages and replies"
                emailChecked={emailNotifications.messages}
                inAppChecked={inAppNotifications.messages}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, messages: checked })
                }
                onInAppChange={(checked) =>
                  setInAppNotifications({ ...inAppNotifications, messages: checked })
                }
              />

              <NotificationToggle
                label="Assignments"
                description="When you're assigned to a case or task"
                emailChecked={emailNotifications.assignments}
                inAppChecked={inAppNotifications.assignments}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, assignments: checked })
                }
                onInAppChange={(checked) =>
                  setInAppNotifications({ ...inAppNotifications, assignments: checked })
                }
              />

              <NotificationToggle
                label="Mentions"
                description="When someone mentions you in a comment"
                emailChecked={emailNotifications.mentions}
                inAppChecked={inAppNotifications.mentions}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, mentions: checked })
                }
                onInAppChange={(checked) =>
                  setInAppNotifications({ ...inAppNotifications, mentions: checked })
                }
              />

              <NotificationToggle
                label="System Alerts"
                description="Important system notifications and updates"
                emailChecked={emailNotifications.systemAlerts}
                inAppChecked={false}
                onEmailChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, systemAlerts: checked })
                }
                onInAppChange={() => {}}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Digest Frequency
            </label>
            <select
              value={digestFrequency}
              onChange={(e) => setDigestFrequency(e.target.value as DigestFrequency)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None - Send immediately</option>
              <option value="daily">Daily - Once per day</option>
              <option value="weekly">Weekly - Once per week</option>
              <option value="monthly">Monthly - Once per month</option>
            </select>
            <p className="text-xs text-slate-600 mt-1">
              Receive a summary of notifications at your chosen frequency
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateSettings.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// Security Tab
// ============================================================================

const SecurityTab: React.FC = () => {
  const { data: settings } = useUserSettings();
  const { data: sessions } = useSessions();
  const changePassword = useChangePassword();
  const revokeSession = useRevokeSession();
  const revokeAllSessions = useRevokeAllSessions();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    changePassword.mutate(passwordData, {
      onSuccess: () => {
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully');
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Password</h3>
            <p className="text-sm text-slate-600">Change your account password</p>
          </div>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="space-y-4 bg-slate-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={changePassword.isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {changePassword.isPending ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-600">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {settings?.twoFactorEnabled ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                Enabled
              </span>
            ) : (
              <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Enable 2FA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Active Sessions</h3>
            <p className="text-sm text-slate-600">Manage devices where you're logged in</p>
          </div>
          {sessions && sessions.length > 1 && (
            <button
              onClick={() => revokeAllSessions.mutate()}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sign Out All Devices
            </button>
          )}
        </div>

        <div className="space-y-3">
          {sessions?.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">
                      {session.browser} on {session.os}
                    </p>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">
                    {session.location || session.ipAddress} • Last active{' '}
                    {new Date(session.lastActiveAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => revokeSession.mutate(session.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Integrations Tab (Simplified - Full version in IntegrationsPage)
// ============================================================================

const IntegrationsTab: React.FC = () => {
  const { data: apiKeys } = useApiKeys();
  const createApiKey = useCreateApiKey();
  const revokeApiKey = useRevokeApiKey();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    createApiKey.mutate(
      { name: keyName, permissions: ['cases:read', 'documents:read'] },
      {
        onSuccess: (data) => {
          setCreatedKey(data.key);
          setKeyName('');
          setShowCreateForm(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">API Keys</h3>
            <p className="text-sm text-slate-600">Manage API keys for integrations</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create API Key
          </button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateKey} className="mb-4 p-4 bg-slate-50 rounded-lg space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Name</label>
              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g., Mobile App"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createApiKey.isPending}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {createApiKey.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-slate-600 text-sm rounded-lg hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {createdKey && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-900 mb-2">
              API Key Created Successfully!
            </p>
            <p className="text-xs text-green-700 mb-2">
              Make sure to copy your API key now. You won't be able to see it again!
            </p>
            <code className="block p-2 bg-white rounded text-xs font-mono">{createdKey}</code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdKey);
                alert('Copied to clipboard!');
              }}
              className="mt-2 text-xs text-green-600 hover:text-green-700"
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        <div className="space-y-2">
          {apiKeys?.map((key) => (
            <div
              key={key.id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{key.name}</p>
                <p className="text-xs text-slate-600">
                  {key.prefix}... • Created {new Date(key.createdAt).toLocaleDateString()}
                  {key.lastUsedAt && ` • Last used ${new Date(key.lastUsedAt).toLocaleDateString()}`}
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to revoke this API key?')) {
                    revokeApiKey.mutate(key.id);
                  }
                }}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                Revoke
              </button>
            </div>
          ))}

          {!apiKeys?.length && (
            <div className="text-center py-8 text-slate-600">
              <Key className="w-12 h-12 mx-auto mb-2 text-slate-400" />
              <p className="text-sm">No API keys yet</p>
              <p className="text-xs">Create one to get started with integrations</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
