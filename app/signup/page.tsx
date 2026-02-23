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

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login(role);
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
        <AuthCard title="Create Account" subtitle="Join SkillRank AI with your preferred role.">
          <form onSubmit={handleSubmit} className="space-y-4">
            <RoleSelector value={role} onChange={setRole} />
            <AuthFormFields email={email} password={password} onEmailChange={setEmail} onPasswordChange={setPassword} />
            <AnimatedButton type="submit" label="Create Account" />
            <GoogleButton />
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
