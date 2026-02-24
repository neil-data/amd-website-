'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export type UserRole = 'student' | 'recruiter';

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  userName: string | null;
  userInitials: string;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const ROLE_STORAGE_KEY = 'skillrank-role';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState('SR');

  const getNameFromUser = (user: User): string => {
    if (user.displayName && user.displayName.trim().length > 0) {
      return user.displayName.trim();
    }

    const emailName = user.email?.split('@')[0] ?? 'SkillRank User';
    return emailName
      .split(/[._-]+/)
      .filter(Boolean)
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ');
  };

  const getInitials = (name: string): string => {
    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || 'SR';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAuthenticated(false);
        setRole(null);
        setUserName(null);
        setUserInitials('SR');
        return;
      }

      setIsAuthenticated(true);
      const resolvedName = getNameFromUser(user);
      setUserName(resolvedName);
      setUserInitials(getInitials(resolvedName));
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'student' || savedRole === 'recruiter') {
        setRole(savedRole);
      } else {
        setRole('student');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, nextRole: UserRole) => {
    await signInWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
    setRole(nextRole);
    localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const signup = async (email: string, password: string, nextRole: UserRole) => {
    await createUserWithEmailAndPassword(auth, email, password);
    setIsAuthenticated(true);
    setRole(nextRole);
    localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const loginWithGoogle = async (nextRole: UserRole) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    setIsAuthenticated(true);
    setRole(nextRole);
    localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setRole(null);
    setUserName(null);
    setUserInitials('SR');
    localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, role, userName, userInitials, login, signup, loginWithGoogle, logout }),
    [isAuthenticated, role, userInitials, userName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
