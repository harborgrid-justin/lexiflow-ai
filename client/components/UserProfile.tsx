import React, { useState, useEffect } from 'react';
import { User, UserProfile as IUserProfile } from '../types';
import { ApiService } from '../services/apiService';
import { PageHeader } from './common/PageHeader';
import { User as UserIcon, Mail, Phone, Settings, Save } from 'lucide-react';
import { Button } from './common/Button';

interface UserProfileProps {
  userId: string; // Current user ID
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [theme, setTheme] = useState('system');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await ApiService.getUsers();
        const currentUser = users.find(u => u.id === userId);
        setUser(currentUser || null);

        const userProfile = await ApiService.getUserProfile(userId);
        setProfile(userProfile);
        
        // Init form
        if (userProfile) {
            setBio(userProfile.bio || '');
            setPhone(userProfile.phone || '');
            setSkills(Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : userProfile.skills || '');
            setTheme(userProfile.themePreference || 'system');
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    try {
        const updatedProfile: Partial<IUserProfile> = {
            bio,
            phone,
            skills: skills.split(',').map(s => s.trim()).filter(s => s),
            themePreference: theme as any
        };
        await ApiService.userProfiles.update(userId, updatedProfile);
        setProfile({ ...profile!, ...updatedProfile });
        setEditMode(false);
    } catch (e) {
        console.error(e);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500">Loading profile...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">User not found</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="User Profile" 
        subtitle="Manage your personal information and preferences."
        actions={
            !editMode ? (
                <Button variant="secondary" onClick={() => setEditMode(true)} icon={Settings}>Edit Profile</Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave} disabled={saving} icon={Save}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 text-center">
                <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-400 text-3xl font-bold overflow-hidden">
                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover"/> : user.name?.charAt(0) || '?'}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                <p className="text-slate-500 mb-4">{user.role}</p>
                
                <div className="flex justify-center gap-2 mb-6">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">{user.userType || 'Internal'}</span>
                    {user.office && <span className="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded border border-slate-200">{user.office}</span>}
                </div>

                <div className="text-left space-y-3 border-t border-slate-100 pt-4">
                    <div className="flex items-center text-sm text-slate-600">
                        <Mail className="h-4 w-4 mr-3 text-slate-400"/> {user.email}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <Phone className="h-4 w-4 mr-3 text-slate-400"/> 
                        {editMode ? (
                            <input className="border rounded px-2 py-1 w-full text-sm" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555)..." />
                        ) : (
                            phone || <span className="text-slate-400 italic">No phone added</span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Details & Settings */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center"><UserIcon className="h-5 w-5 mr-2 text-blue-600"/> Bio & Skills</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Biography</label>
                        {editMode ? (
                            <textarea className="w-full border rounded-md p-3 text-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." />
                        ) : (
                            <p className="text-slate-600 text-sm leading-relaxed">{bio || <span className="text-slate-400 italic">No bio provided.</span>}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Skills / Practice Areas</label>
                        {editMode ? (
                            <input className="w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Litigation, IP, Contract Law (comma separated)" />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills?.map(s => (
                                    <span key={s} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">{s}</span>
                                ))}
                                {(!profile?.skills || profile.skills.length === 0) && <span className="text-slate-400 italic text-sm">No skills listed.</span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Settings className="h-5 w-5 mr-2 text-slate-600"/> Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Theme</label>
                        {editMode ? (
                            <select className="w-full border rounded-md p-2 text-sm" value={theme} onChange={e => setTheme(e.target.value)}>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                            </select>
                        ) : (
                            <span className="text-sm text-slate-600 capitalize">{theme}</span>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Notifications</label>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <input type="checkbox" checked={profile?.notifications?.email ?? true} disabled={!editMode} className="mr-2"/>
                                <span className="text-sm text-slate-600">Email Notifications</span>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={profile?.notifications?.push ?? true} disabled={!editMode} className="mr-2"/>
                                <span className="text-sm text-slate-600">Push Notifications</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
