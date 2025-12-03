import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';
import { enzymeAuthService, enzymeUsersService, enzymeUserProfilesService } from '../enzyme/services';
import { FEATURE_FLAGS, AUTH_CONFIG } from '../config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  impersonateUser: (user: User) => void;
  isImpersonating: boolean;
  stopImpersonating: () => void;
  /** Refresh the authentication token without affecting other settings */
  refreshToken: () => Promise<boolean>;
  /** Whether the app is in dev login bypass mode */
  isDevBypassMode: boolean;
  /** Token expiry warning state */
  tokenExpiryWarning: boolean;
  /** Last error message from auth operations */
  error: string | null;
  /** Clear the error state */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiryWarning, setTokenExpiryWarning] = useState(false);
  const [isDevBypassMode, setIsDevBypassMode] = useState(false);

  // Clear error helper
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    const initAuth = async () => {
      // Check for DEV_LOGIN_BYPASS mode
      if (FEATURE_FLAGS.DEV_LOGIN_BYPASS) {
        console.log('🔓 [DEV] Login bypass enabled - auto-authenticating as admin');
        setUser(AUTH_CONFIG.DEV_ADMIN_USER as User);
        setIsDevBypassMode(true);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
      if (token) {
        try {
          const currentUser = await enzymeAuthService.getCurrentUser();
          setUser(currentUser);
          // Update last active timestamp
          if (currentUser.id) {
            try {
              if (FEATURE_FLAGS.ENABLE_DEBUG_LOGGING) {
                console.log('AuthContext: Calling updateLastActive for user', currentUser.id);
              }
              await enzymeUserProfilesService.updateLastActive(currentUser.id);
            } catch (updateError) {
              console.error('Failed to update last active timestamp:', updateError);
            }
          }
        } catch (_error) {
          // Token is invalid
          localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
          sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
          setError('Session expired. Please log in again.');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    clearError();
    try {
      const response = await enzymeAuthService.login(email, password);
      setUser(response.user);

      // Update last active timestamp
      if (response.user.id) {
        try {
          if (FEATURE_FLAGS.ENABLE_DEBUG_LOGGING) {
            console.log('AuthContext login: Calling updateLastActive for user', response.user.id);
          }
          await enzymeUserProfilesService.updateLastActive(response.user.id);
        } catch (updateError) {
          console.error('Failed to update last active timestamp after login:', updateError);
        }
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setError(message);
      console.error('Login failed:', err);
      return false;
    }
  };

  /**
   * Refresh the authentication token without affecting other user settings
   * This is useful when changing servers or when the token is about to expire
   */
  const refreshToken = async (): Promise<boolean> => {
    // In dev bypass mode, just return true
    if (isDevBypassMode) {
      console.log('🔓 [DEV] Token refresh skipped in bypass mode');
      return true;
    }

    try {
      // Try to get current user to validate/refresh the session
      const currentUser = await enzymeAuthService.getCurrentUser();
      setUser(currentUser);
      setTokenExpiryWarning(false);
      setError(null);

      if (FEATURE_FLAGS.ENABLE_DEBUG_LOGGING) {
        console.log('✅ Token refreshed successfully');
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to refresh token';
      setError(message);
      console.error('Token refresh failed:', err);
      return false;
    }
  };

  const logout = () => {
    // Clear tokens from storage
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    setUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = await enzymeUsersService.update(user.id, data);
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  };

  const impersonateUser = (impersonatedUser: User) => {
    if (!isImpersonating && user) {
      // Save original user before impersonating
      setOriginalUser(user);
    }
    setUser(impersonatedUser);
    setIsImpersonating(true);
    console.log('🎭 Impersonating user:', impersonatedUser.name, `(${impersonatedUser.role})`);
  };

  const stopImpersonating = () => {
    if (originalUser) {
      setUser(originalUser);
      setOriginalUser(null);
      setIsImpersonating(false);
      console.log('✅ Stopped impersonating, returned to original user');
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    impersonateUser,
    isImpersonating,
    stopImpersonating,
    refreshToken,
    isDevBypassMode,
    tokenExpiryWarning,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};