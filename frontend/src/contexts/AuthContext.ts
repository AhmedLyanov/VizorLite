import { createContext, useContext } from 'react';
import type { AuthResponse } from '../api/authApi';
import type { ProfileData } from '../api/profileApi';

export interface AuthContextType {
  user: AuthResponse['user'] | null;
  profile: ProfileData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};