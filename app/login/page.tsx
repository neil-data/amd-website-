'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Navbar from '@/components/Navbar';
import AuthCard from '@/components/auth/AuthCard';
import RoleSelector from '@/components/auth/RoleSelector';
import AnimatedButton from '@/components/auth/AnimatedButton';
import AuthFormFields from '@/components/auth/AuthFormFields';
import GoogleButton from '@/components/auth/GoogleButton';
import { useAuth, UserRole } from '@/context/AuthContext';
import { getFirebaseAuthErrorMessage } from '@/lib/firebaseAuthError';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await login(email, password, role);
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
      return;
    }

    if (role === 'student') {
      router.push('/dashboard');
      return;
    }
    router.push('/recruiter-dashboard');
  };

  const handleGoogleLogin = async () => {
    setError(null);

    try {
      await loginWithGoogle(role);
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
      return;
    }

    if (role === 'student') {
      router.push('/dashboard');
      return;
    }
    router.push('/recruiter-dashboard');
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center px-4 pt-28 pb-10 sm:px-6">
        <AuthCard title="Login" subtitle="Continue your SkillRank AI journey.">
          <form onSubmit={handleSubmit} className="space-y-4">
            <RoleSelector value={role} onChange={setRole} />
            <AuthFormFields email={email} password={password} onEmailChange={setEmail} onPasswordChange={setPassword} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AnimatedButton type="submit" label="Login" />
            <GoogleButton onClick={handleGoogleLogin} />
          </form>

          <p className="pt-2 text-center text-sm text-neutral-600">
            New to SkillRank AI?{' '}
            <Link href="/signup" className="font-medium text-black underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </AuthCard>
      </main>
    </>
  );
}
