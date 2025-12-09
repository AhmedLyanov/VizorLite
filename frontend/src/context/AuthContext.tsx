import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const verifyToken = async () => {
        try {
          axios.defaults.headers.common['x-auth-token'] = storedToken;

          setToken(storedToken);
        } catch (error) {
          console.error('Error verifying token:', error);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);

      axios.defaults.headers.common['x-auth-token'] = token;

      setUser(user);
      setToken(token);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error.response?.data?.errors || { msg: 'Registration failed' };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      const { token, user } = res.data;

      localStorage.setItem('token', token);

      axios.defaults.headers.common['x-auth-token'] = token;

      setUser(user);
      setToken(token);
    } catch (error: any) {
      console.error('Login error:', error);
      throw error.response?.data?.errors || { msg: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');

    delete axios.defaults.headers.common['x-auth-token'];

    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};