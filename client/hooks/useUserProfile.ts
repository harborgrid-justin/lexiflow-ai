import { useState, useEffect } from 'react';
import { User, UserProfile as IUserProfile } from '../types';
import { ApiService } from '../services/apiService';

export const useUserProfile = (userId: string) => {
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
      const updatedProfile = {
        ...profile,
        bio,
        phone,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        themePreference: theme
      };
      await ApiService.updateUserProfile(userId, updatedProfile);
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    profile,
    loading,
    saving,
    editMode,
    setEditMode,
    bio,
    setBio,
    phone,
    setPhone,
    skills,
    setSkills,
    theme,
    setTheme,
    handleSave
  };
};