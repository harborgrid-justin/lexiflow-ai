import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { ApiService } from '../services/apiService';

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

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const currentUser = await ApiService.auth.getCurrentUser();
          setUser(currentUser);
          // Update last active timestamp
          if (currentUser.id) {
            ApiService.userProfiles.updateLastActive(currentUser.id);
          }
        } catch (_error) {
          // Token is invalid
          localStorage.removeItem('authToken');
          sessionStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await ApiService.auth.login(email, password);
      ApiService.setAuthToken(response.access_token);
      setUser(response.user);

      // Update last active timestamp
      if (response.user.id) {
        ApiService.userProfiles.updateLastActive(response.user.id);
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    ApiService.clearAuthToken();
    setUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const updatedUser = await ApiService.users.update(user.id, data);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};