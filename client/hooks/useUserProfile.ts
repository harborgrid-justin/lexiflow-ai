/**
 * ENZYME MIGRATION (Wave 6, Agent 43)
 *
 * This hook manages user profile data with form state and save functionality.
 * Migrated from useEffect-based fetching to Enzyme's Virtual DOM hooks:
 * - useApiRequest for user and profile data fetching
 * - useApiMutation for profile updates
 * - useSafeState for form fields (bio, phone, skills, theme, editMode)
 * - useIsMounted guards for safe state updates
 * - useLatestCallback for stable handler references
 * - useTrackEvent for profile analytics
 */

import { useEffect } from 'react';
import { User, UserProfile as IUserProfile } from '../types';
import {
  useApiRequest,
  useApiMutation,
  useIsMounted,
  useLatestCallback,
  useSafeState,
  useTrackEvent
} from '../enzyme';

export const useUserProfile = (userId: string) => {
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Fetch all users to find the current user
  const { data: users, isLoading: usersLoading } = useApiRequest<User[]>({
    endpoint: '/api/v1/users',
    options: { enabled: !!userId }
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useApiRequest<IUserProfile>({
    endpoint: `/api/v1/user-profiles/user/${userId}`,
    options: { enabled: !!userId }
  });

  // Derived state
  const user = users?.find(u => u.id === userId) || null;
  const loading = usersLoading || profileLoading;

  // Edit mode state
  const [editMode, setEditMode] = useSafeState(false);

  // Form state
  const [bio, setBio] = useSafeState('');
  const [phone, setPhone] = useSafeState('');
  const [skills, setSkills] = useSafeState('');
  const [theme, setTheme] = useSafeState('system');

  // Initialize form when profile loads
  useEffect(() => {
    if (profile && isMounted()) {
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
      setTheme(profile.themePreference || 'system');
    }
  }, [profile, isMounted, setBio, setPhone, setSkills, setTheme]);

  // Profile update mutation
  const { mutateAsync: updateProfile, isPending: saving } = useApiMutation<IUserProfile>({
    method: 'PUT',
    endpoint: `/api/v1/user-profiles/user/${userId}`
  });

  // Save handler
  const handleSave = useLatestCallback(async () => {
    try {
      const updatedProfile = {
        ...profile,
        bio,
        phone,
        skills: skills.split(',').map(s => s.trim()).filter(s => s),
        themePreference: theme
      };

      await updateProfile({ data: updatedProfile });

      if (isMounted()) {
        setEditMode(false);
        trackEvent('user_profile_saved', { userId });
      }
    } catch (e) {
      console.error('Failed to save profile:', e);
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
    saving,
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
    handleSave
  };
};