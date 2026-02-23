'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import AnimatedButton from '@/components/auth/AnimatedButton';

const sessions = [
  { id: 't1', topic: 'React Performance Patterns', mode: '1:1 Mentorship', when: 'Tomorrow, 6:00 PM' },
  { id: 't2', topic: 'Prompt Engineering Deep Dive', mode: 'Group Session', when: 'Friday, 8:00 PM' },
  { id: 't3', topic: 'System Design Whiteboard', mode: 'Workshop', when: 'Sunday, 2:00 PM' },
];

export default function ExchangePage() {
  const [offerSkill, setOfferSkill] = useState('');
  const [requestSkill, setRequestSkill] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <AuthenticatedShell title="Exchange" subtitle="Offer and request skill-sharing sessions with the community.">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Sessions Taught" value="18" hint="Lifetime contributions" />
        <MetricCard label="Sessions Joined" value="26" hint="Cross-domain learning" />
        <MetricCard label="Contribution Score" value="92" hint="Peer feedback based" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-heading text-xl font-semibold">Offer Skill</h2>
          <textarea
            value={offerSkill}
            onChange={(event) => setOfferSkill(event.target.value)}
            placeholder="Describe what you can teach"
            className="mt-4 h-28 w-full rounded-xl border border-black/15 p-3 text-sm outline-none focus:border-black"
          />
          <div className="mt-4">
            <AnimatedButton type="submit" label="Publish Offer" />
          </div>
        </motion.form>

        <motion.form onSubmit={onSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-white p-5">
          <h2 className="font-heading text-xl font-semibold">Request Skill</h2>
          <textarea
            value={requestSkill}
            onChange={(event) => setRequestSkill(event.target.value)}
            placeholder="Describe what you want to learn"
            className="mt-4 h-28 w-full rounded-xl border border-black/15 p-3 text-sm outline-none focus:border-black"
          />
          <div className="mt-4">
            <AnimatedButton type="submit" label="Submit Request" />
          </div>
        </motion.form>
      </section>

      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <h2 className="font-heading text-xl font-semibold">Teaching Sessions</h2>
        <div className="mt-4 space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="rounded-xl border border-black/10 bg-white p-4">
              <p className="font-medium text-black">{session.topic}</p>
              <p className="mt-1 text-sm text-neutral-600">{session.mode}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-neutral-500">{session.when}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </AuthenticatedShell>
  );
}
