'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';

export type UserRole = 'student' | 'recruiter';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
}

interface AuthContextValue extends AuthState {
  login: (role: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = 'skillrank-auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed.isAuthenticated && (parsed.role === 'student' || parsed.role === 'recruiter')) {
        setIsAuthenticated(true);
        setRole(parsed.role);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = (nextRole: UserRole) => {
    const next = { isAuthenticated: true, role: nextRole } satisfies AuthState;
    setIsAuthenticated(true);
    setRole(nextRole);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(() => ({ isAuthenticated, role, login, logout }), [isAuthenticated, role]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
