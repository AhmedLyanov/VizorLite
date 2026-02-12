import type { ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../entities/user/AuthContext';
import { useEffect, useState } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

type User = {
  id: string;
  username: string;
  email: string;
  createdAt?: string,
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthChange = () => {
      console.log('🔄 Auth change detected - refreshing token from localStorage');
      const newToken = localStorage.getItem('token');
      setToken(newToken);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    };
    
    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, [queryClient]);

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('No user data');
      }
      return JSON.parse(userStr);
    },
    enabled: !!token,
    staleTime: 0,
    gcTime: 0,
  });

  const logout = () => {
    console.log('🚪 Logout initiated');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    queryClient.removeQueries({ queryKey: ['currentUser'] });
    queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    window.dispatchEvent(new Event('auth-change'));
  };

  const value = {
    user: user || null,
    profile: null,
    isLoading,
    isAuthenticated: !!token && !!user, 
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};