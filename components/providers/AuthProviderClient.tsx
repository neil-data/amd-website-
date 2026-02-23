'use client';

import { PropsWithChildren } from 'react';
import { AuthProvider } from '@/context/AuthContext';

export default function AuthProviderClient({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
