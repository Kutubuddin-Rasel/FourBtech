"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ accessToken: string, user: User }>;
  logout: () => void;
  isAuthenticated: () => boolean;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to set a cookie
const setCookie = (name: string, value: string, days: number) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }
  if (!value) {
    console.warn(`[setCookie] Attempting to set an empty value for cookie: ${name}`);
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
  console.log(`[setCookie] Set ${name}=${value}. Current document.cookie: ${document.cookie}`);
};

// Helper to get a cookie
const getCookie = (name: string) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Helper to erase a cookie
const eraseCookie = (name: string) => {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  console.log(`[eraseCookie] Erased ${name}. Current document.cookie: ${document.cookie}`);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Explicitly clear old localStorage items to avoid conflicts
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');

    const storedToken = getCookie('token');
    const storedUser = getCookie('user'); // User object stored as string
    const storedUserRole = getCookie('userRole');
    const storedAdminAuthenticated = getCookie('adminAuthenticated'); // Read from cookie

    console.log('[AuthContext useEffect] Initial load. Cookies:');
    console.log(`[AuthContext useEffect] token: ${storedToken}`);
    console.log(`[AuthContext useEffect] user: ${storedUser}`);
    console.log(`[AuthContext useEffect] userRole: ${storedUserRole}`);
    console.log(`[AuthContext useEffect] adminAuthenticated: ${storedAdminAuthenticated}`);

    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data from cookie", e);
        eraseCookie('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext login] Attempting login with:', { email, API_URL });
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { accessToken, user } = response.data;
      console.log('[AuthContext login] Received accessToken from backend:', accessToken);
      setCookie('token', accessToken, 7); // Expire in 7 days
      setCookie('user', JSON.stringify(user), 7); // Store user object as string
      setCookie('userRole', user.role, 7); // Store user role separately for middleware
      if (user.role === 'admin') {
        setCookie('adminAuthenticated', 'true', 7); // Set adminAuthenticated cookie for admins
      } else {
        eraseCookie('adminAuthenticated'); // Ensure it's not set for non-admins
      }
      console.log('[AuthContext login] After setting cookies, document.cookie:', document.cookie);
      setToken(accessToken);
      setUser(user);
      return { accessToken, user };
    } catch (error: unknown) {
      console.error('[AuthContext login] Error:', error);
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        throw new Error((error as { response: { data: { message: string } } }).response.data.message || 'Invalid credentials');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'request' in error
      ) {
        throw new Error('No response from server. Please check your connection.');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        throw new Error((error as { message: string }).message || 'Failed to make request. Please try again.');
      } else {
        throw new Error('Failed to make request. Please try again.');
      }
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      console.log('[AuthContext register] Attempting registration with:', { name, email, role, API_URL });
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
      console.log('[AuthContext register] Registration successful:', response.data);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
      ) {
        throw new Error((error as { response: { data: { message: string } } }).response.data.message || 'Failed to register. Please try again.');
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        throw new Error((error as { message: string }).message || 'Failed to register. Please try again.');
      } else {
        throw new Error('Failed to register. Please try again.');
      }
    }
  };

  const logout = () => {
    eraseCookie('token');
    eraseCookie('user');
    eraseCookie('userRole');
    eraseCookie('adminAuthenticated'); // Clear admin flag too
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 