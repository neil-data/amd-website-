'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import AnimatedButton from '@/components/auth/AnimatedButton';
import { apiRequest } from '@/lib/api/client';
import { useAuth } from '@/context/AuthContext';

interface ExchangeItem {
  id: string;
  teacherId: string;
  learnerId: string;
  skill: string;
  status: 'active' | 'completed';
  pointsAwarded: number;
  createdAt?: string;
}

export default function ExchangePage() {
  const { userId } = useAuth();
  const [offerSkill, setOfferSkill] = useState('');
  const [requestSkill, setRequestSkill] = useState('');
  const [sessions, setSessions] = useState<ExchangeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const taughtCount = useMemo(() => sessions.filter((item) => item.teacherId === userId).length, [sessions, userId]);
  const joinedCount = useMemo(() => sessions.filter((item) => item.learnerId === userId).length, [sessions, userId]);
  const contributionScore = useMemo(() => Math.min(100, 70 + sessions.length * 3), [sessions.length]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const payload = await apiRequest<{ exchanges: ExchangeItem[] }>('/api/exchange');
      setSessions(payload.exchanges);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Failed to load exchange sessions.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSessions();
  }, []);

  const onSubmitOffer = async (event: FormEvent) => {
    event.preventDefault();
    if (!offerSkill.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await apiRequest('/api/exchange', {
        method: 'POST',
        body: JSON.stringify({
          skill: offerSkill.trim(),
          learnerId: userId,
        }),
      });
      setOfferSkill('');
      await loadSessions();
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Failed to publish offer.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitRequest = async (event: FormEvent) => {
    event.preventDefault();
    if (!requestSkill.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await apiRequest('/api/exchange', {
        method: 'POST',
        body: JSON.stringify({
          skill: requestSkill.trim(),
          learnerId: userId,
        }),
      });
      setRequestSkill('');
      await loadSessions();
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Failed to submit request.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthenticatedShell title="Exchange" subtitle="Offer and request skill-sharing sessions with the community.">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Sessions Taught" value={String(taughtCount)} hint="Live from your exchange activity" />
        <MetricCard label="Sessions Joined" value={String(joinedCount)} hint="Live from your exchange activity" />
        <MetricCard label="Contribution Score" value={String(contributionScore)} hint="Derived from active sessions" />
      </section>

      {loading && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-neutral-600">Loading exchange sessions…</div>}
      {error && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-red-600">{error}</div>}

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.form onSubmit={onSubmitOffer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-heading text-xl font-semibold">Offer Skill</h2>
          <textarea
            value={offerSkill}
            onChange={(event) => setOfferSkill(event.target.value)}
            placeholder="Describe what you can teach"
            className="mt-4 h-28 w-full rounded-xl border border-black/15 p-3 text-sm outline-none focus:border-black"
          />
          <div className="mt-4">
            <AnimatedButton type="submit" label={submitting ? 'Publishing…' : 'Publish Offer'} />
          </div>
        </motion.form>

        <motion.form onSubmit={onSubmitRequest} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-heading text-xl font-semibold">Request Skill</h2>
          <textarea
            value={requestSkill}
            onChange={(event) => setRequestSkill(event.target.value)}
            placeholder="Describe what you want to learn"
            className="mt-4 h-28 w-full rounded-xl border border-black/15 p-3 text-sm outline-none focus:border-black"
          />
          <div className="mt-4">
            <AnimatedButton type="submit" label={submitting ? 'Submitting…' : 'Submit Request'} />
          </div>
        </motion.form>
      </section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <h2 className="font-heading text-xl font-semibold">Exchange Sessions</h2>
        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-xl border border-black/10 bg-white p-4">
              <p className="font-medium text-black">{session.skill}</p>
              <p className="mt-1 text-sm text-neutral-600">Status: {session.status}</p>
              <p className="mt-1 text-sm text-neutral-600">Points Awarded: {session.pointsAwarded}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">
                {session.createdAt ? new Date(session.createdAt).toLocaleString() : 'Created recently'}
              </p>
            </div>
          ))}
          {!loading && sessions.length === 0 && <p className="text-sm text-neutral-600">No exchange sessions yet.</p>}
        </div>
      </motion.section>
    </AuthenticatedShell>
  );
}
