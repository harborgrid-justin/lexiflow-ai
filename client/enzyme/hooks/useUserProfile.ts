import { useState, useEffect } from 'react';
import { User, UserProfile as IUserProfile } from '../../types';
import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import {
  useIsMounted,
  useLatestCallback,
  useTrackEvent
} from '@missionfabric-js/enzyme/hooks';

export const useUserProfile = (userId: string) => {
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Fetch all users to find the current user
  const { data: users, isLoading: usersLoading } = useApiRequest<User[]>({
    endpoint: '/users',
    options: { enabled: !!userId }
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading, refetch: refetchProfile } = useApiRequest<IUserProfile>({
    endpoint: `/user-profiles/user/${userId}`,
    options: { enabled: !!userId }
  });

  // Derived state
  const user = users?.find(u => u.id === userId) || null;
  const loading = usersLoading || profileLoading;

  // Edit mode state
  const [editMode, setEditMode] = useState(false);

  // Form state
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [theme, setTheme] = useState('system');
  const [saving, setSaving] = useState(false);

  // Initialize form when profile loads
  useEffect(() => {
    if (profile && isMounted()) {
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
      setTheme(profile.themePreference || 'system');
    }
  }, [profile, isMounted]);

  // Save handler
  const handleSave = useLatestCallback(async () => {
    setSaving(true);
    try {
      const updatedProfile = {
        ...profile,
        bio,
        phone,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        themePreference: theme
      };

      await enzymeClient.put(`/user-profiles/user/${userId}`, updatedProfile);
      await refetchProfile();

      if (isMounted()) {
        setEditMode(false);
        setSaving(false);
        trackEvent('user_profile_saved', { userId });
      }
    } catch (e) {
      if (isMounted()) {
        setSaving(false);
        console.error('Failed to save profile:', e);
      }
    }
  });

  // Wrap setEditMode to track edit mode toggles
  const handleSetEditMode = useLatestCallback((enabled: boolean) => {
    setEditMode(enabled);
    trackEvent('user_profile_edit_mode', { enabled });
  });

  return {
    user,
    profile,
    loading,
    editMode,
    setEditMode: handleSetEditMode,
    bio,
    setBio,
    phone,
    setPhone,
    skills,
    setSkills,
    theme,
    setTheme,
    handleSave,
    saving
  };
};
