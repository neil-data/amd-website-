'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserRole } from '@/context/AuthContext';

interface RoleGuardProps {
  allowedRole: UserRole;
  children: ReactNode;
}

export default function RoleGuard({ allowedRole, children }: RoleGuardProps) {
  const router = useRouter();
  const { isAuthLoading, isAuthenticated, role } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (role && role !== allowedRole) {
      router.replace(role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard');
    }
  }, [allowedRole, isAuthLoading, isAuthenticated, role, router]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated || role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
