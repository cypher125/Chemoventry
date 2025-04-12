'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI, usersAPI } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        const userData = await usersAPI.getCurrentUser();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const setTokens = (access: string, refresh: string) => {
    // Set access token in cookie with expiry from JWT
    const decoded = jwtDecode<{ exp: number }>(access);
    const expiryDate = new Date(decoded.exp * 1000);
    
    Cookies.set('token', access, { expires: expiryDate, sameSite: 'Lax' });
    Cookies.set('refreshToken', refresh, { expires: 7, sameSite: 'Lax' }); // 7 days for refresh token
  };

  const refreshToken = async () => {
    try {
      const refresh = Cookies.get('refreshToken');
      if (!refresh) throw new Error('No refresh token');

      const response = await authAPI.refreshToken(refresh);
      setTokens(response.access, response.refresh);
      return response.access;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await logout();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const { access, refresh, user } = await authAPI.login(email, password);
      console.log('Login successful, setting tokens and user');
      setTokens(access, refresh);
      setUser(user);
      router.push('/chemoventry');
    } catch (error: any) {
      console.error('Login error details:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid credentials. Please check your email and password.');
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Login failed. Please try again later.');
      }
    }
  };

  const logout = async () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
