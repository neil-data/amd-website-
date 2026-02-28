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

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      await signup(email, password, role);
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

  const handleGoogleSignup = async () => {
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
        <AuthCard
          title={role === 'recruiter' ? 'Recruiter Sign Up' : 'Create Account'}
          subtitle={role === 'recruiter' ? 'Set up your recruiter account to evaluate top talent.' : 'Join SkillRank AI with your preferred role.'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <RoleSelector value={role} onChange={setRole} />
            <AuthFormFields email={email} password={password} onEmailChange={setEmail} onPasswordChange={setPassword} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <AnimatedButton type="submit" label="Create Account" />
            <GoogleButton onClick={handleGoogleSignup} />
          </form>

          <p className="pt-2 text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-black underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </AuthCard>
      </main>
    </>
  );
}
