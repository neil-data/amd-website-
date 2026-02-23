'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import SkillRadarChart from '@/components/authenticated/SkillRadarChart';

const candidatePool = [
  'Ava Chen',
  'Noah Singh',
  'Lena Park',
  'Mason Reed',
  'Iris Gomez',
  'Elijah Brooks',
];

const radarData = [
  { metric: 'Frontend', score: 86 },
  { metric: 'Backend', score: 79 },
  { metric: 'Reasoning', score: 82 },
  { metric: 'Communication', score: 75 },
  { metric: 'Integrity', score: 93 },
];

const rankingInsights = [
  { label: 'Top verified candidates', value: '42' },
  { label: 'Avg integrity score', value: '91%' },
  { label: 'Role-fit confidence', value: '87%' },
];

export default function RecruiterDashboardPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return candidatePool.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <AuthenticatedShell title="Recruiter Dashboard" subtitle="Evaluate candidate trust signals and performance fit.">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Qualified Candidates" value="128" hint="Updated hourly" />
        <MetricCard label="Avg SkillScore" value="82" hint="Across shortlisted talent" />
        <MetricCard label="Integrity Median" value="91" hint="Stable and high-confidence" />
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="font-heading text-xl font-semibold">Candidate Search</h2>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search candidates"
          className="mt-4 w-full rounded-xl border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
        />
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {filtered.map((name) => (
            <div key={name} className="rounded-xl border border-black/10 bg-black/[0.02] px-3 py-2 text-sm">
              {name}
            </div>
          ))}
          {filtered.length === 0 && <p className="text-sm text-neutral-600">No candidates found.</p>}
        </div>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.95fr]">
        <SkillRadarChart title="Skill Overview Radar" data={radarData} />
        <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <h2 className="font-heading text-xl font-semibold">Ranking Insights</h2>
          <div className="mt-4 space-y-3">
            {rankingInsights.map((item) => (
              <div key={item.label} className="rounded-xl border border-black/10 bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{item.label}</p>
                <p className="mt-1 font-heading text-2xl font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </section>
    </AuthenticatedShell>
  );
}
