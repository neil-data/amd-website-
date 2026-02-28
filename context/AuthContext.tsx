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
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'student' | 'recruiter';

interface AuthState {
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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

  const resolveRoleFromStorage = (): UserRole => {
    const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    if (savedRole === 'student' || savedRole === 'recruiter') {
      return savedRole;
    }
    return 'student';
  };

  const getRoleFromFirestore = async (uid: string): Promise<UserRole | null> => {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        return null;
      }

      const firestoreRole = userDoc.data().role;
      return firestoreRole === 'student' || firestoreRole === 'recruiter' ? firestoreRole : null;
    } catch {
      return null;
    }
  };

  const persistRoleToFirestore = async (uid: string, email: string | null, name: string, nextRole: UserRole) => {
    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          name,
          email,
          role: nextRole,
          totalPoints: 0,
          integrityScore: 100,
          createdAt: serverTimestamp(),
        },
        { merge: true },
      );
    } catch {
      return;
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          setIsAuthenticated(false);
          setUserId(null);
          setRole(null);
          setUserName(null);
          setUserInitials('SR');
          setIsAuthLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserId(user.uid);
        const resolvedName = getNameFromUser(user);
        setUserName(resolvedName);
        setUserInitials(getInitials(resolvedName));
        const firestoreRole = await getRoleFromFirestore(user.uid);
        const resolvedRole = firestoreRole ?? resolveRoleFromStorage();
        setRole(resolvedRole);
        localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
        setIsAuthLoading(false);
      });
    } catch (error) {
      console.error('Failed to initialize Firebase auth listener', error);
      setIsAuthLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string, nextRole: UserRole) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firestoreRole = await getRoleFromFirestore(userCredential.user.uid);
    const resolvedRole: UserRole = firestoreRole ?? nextRole;

    setIsAuthenticated(true);
    setRole(resolvedRole);
    localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
  };

  const signup = async (email: string, password: string, nextRole: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await persistRoleToFirestore(
      userCredential.user.uid,
      userCredential.user.email,
      getNameFromUser(userCredential.user),
      nextRole,
    );

    setIsAuthenticated(true);
    setRole(nextRole);
    localStorage.setItem(ROLE_STORAGE_KEY, nextRole);
  };

  const loginWithGoogle = async (nextRole: UserRole) => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const firestoreRole = await getRoleFromFirestore(userCredential.user.uid);
    const resolvedRole = firestoreRole ?? nextRole;
    await persistRoleToFirestore(
      userCredential.user.uid,
      userCredential.user.email,
      getNameFromUser(userCredential.user),
      resolvedRole,
    );

    setIsAuthenticated(true);
    setRole(resolvedRole);
    localStorage.setItem(ROLE_STORAGE_KEY, resolvedRole);
  };

  const logout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
    setUserName(null);
    setUserInitials('SR');
    localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthLoading, isAuthenticated, userId, role, userName, userInitials, login, signup, loginWithGoogle, logout }),
    [isAuthLoading, isAuthenticated, role, userId, userInitials, userName],
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
