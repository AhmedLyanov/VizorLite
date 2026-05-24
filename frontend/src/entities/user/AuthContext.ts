import { createContext, useContext } from 'react';

export interface User {
  id: string;
  username: string;
  email: string;
  plan?: 'free' | 'pro';
  createdAt?: string;
  avatar?: string | null;
}

export interface AuthContextType {
  user: User | null;
  profile: null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  updateUserAvatar: (avatarUrl: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};