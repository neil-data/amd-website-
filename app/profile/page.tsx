'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import { apiRequest } from '@/lib/api/client';

interface ProfilePayload {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'recruiter';
  totalPoints: number;
  integrityScore: number;
  avgAiProbability: number;
  completedChallenges: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const payload = await apiRequest<ProfilePayload>('/api/me');
        if (mounted) {
          setProfile(payload);
        }
      } catch (apiError) {
        const nextMessage = apiError instanceof Error ? apiError.message : 'Failed to load profile.';
        if (mounted) {
          setError(nextMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AuthenticatedShell title="Profile" subtitle="Manage your public SkillRank identity and activity.">
      {loading && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-neutral-600">Loading profile…</div>}
      {!loading && error && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-red-600">{error}</div>}

      {!loading && !error && profile && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Display Name" value={profile.name} hint={profile.email} />
          <MetricCard label="Role" value={profile.role.toUpperCase()} hint="Account access level" />
          <MetricCard label="Total Points" value={String(profile.totalPoints)} hint="Current leaderboard points" />
          <MetricCard label="Integrity Score" value={`${profile.integrityScore.toFixed(1)}%`} hint={`Avg AI ${profile.avgAiProbability.toFixed(1)}%`} />
        </section>
      )}

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <h2 className="font-heading text-xl font-semibold">Profile Summary</h2>
        <p className="mt-2 text-sm text-neutral-600">
          Profile settings are now connected to backend data. More editable profile controls can be added next.
        </p>
      </motion.section>
    </AuthenticatedShell>
  );
}
