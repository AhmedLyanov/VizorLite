import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../contexts/AuthContext';
import { getProfile } from '../api/profileApi';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const token = localStorage.getItem('token');
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
  });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const getUserFromStorage = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  };

  const value = {
    user: getUserFromStorage(),
    profile: profile || null,
    isLoading,
    isAuthenticated: !!token,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};