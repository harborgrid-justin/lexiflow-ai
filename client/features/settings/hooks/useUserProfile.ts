/**
 * User Profile Hook - SOA Migration
 * 
 * Migrated from /client/hooks/useUserProfile.ts
 * Manages user profile data with form state and save functionality.
 */

import { useEffect } from 'react';
import { User, UserProfile as IUserProfile } from '@/types';
import {
  useApiRequest,
  useApiMutation,
  useIsMounted,
  useLatestCallback,
  useSafeState,
  useTrackEvent,
  usePageView,
} from '@/enzyme';

/**
 * Hook for managing user profile data and editing
 */
export const useUserProfile = (userId: string) => {
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Track page view
  usePageView('user_profile', { userId });

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
  const [editMode, setEditMode] = useSafeState(false);

  // Form state
  const [bio, setBio] = useSafeState('');
  const [phone, setPhone] = useSafeState('');
  const [skills, setSkills] = useSafeState('');
  const [theme, setTheme] = useSafeState<'light' | 'dark' | 'system'>('system');

  // Initialize form when profile loads
  useEffect(() => {
    if (profile && isMounted()) {
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
      setTheme((profile.themePreference as 'light' | 'dark' | 'system') || 'system');
    }
  }, [profile, isMounted, setBio, setPhone, setSkills, setTheme]);

  // Profile update mutation
  const { mutateAsync: updateProfile, isPending: saving } = useApiMutation<IUserProfile>({
    method: 'PUT',
    endpoint: `/user-profiles/user/${userId}`
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

      // Refetch to get latest data
      refetchProfile();
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  });

  // Cancel editing
  const handleCancel = useLatestCallback(() => {
    // Reset form to original values
    if (profile) {
      setBio(profile.bio || '');
      setPhone(profile.phone || '');
      setSkills(Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills || '');
      setTheme((profile.themePreference as 'light' | 'dark' | 'system') || 'system');
    }
    setEditMode(false);
    trackEvent('user_profile_edit_cancelled', { userId });
  });

  // Track edit mode toggles
  const handleSetEditMode = useLatestCallback((enabled: boolean) => {
    setEditMode(enabled);
    trackEvent('user_profile_edit_mode', { enabled, userId });
  });

  return {
    // User data
    user,
    profile,
    loading,
    saving,
    
    // Edit mode
    editMode,
    setEditMode: handleSetEditMode,
    
    // Form fields
    bio,
    setBio,
    phone,
    setPhone,
    skills,
    setSkills,
    theme,
    setTheme,
    
    // Actions
    handleSave,
    handleCancel,
    refetchProfile,
  };
};
