'use client';

import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import SkillRadarChart from '@/components/authenticated/SkillRadarChart';
import RecentSubmissionsTable from '@/components/authenticated/RecentSubmissionsTable';

const radarData = [
  { metric: 'Problem Solving', score: 84 },
  { metric: 'Communication', score: 72 },
  { metric: 'Code Quality', score: 88 },
  { metric: 'Collaboration', score: 76 },
  { metric: 'Execution', score: 81 },
];

const submissions = [
  { id: 's1', challenge: 'Frontend Optimization Sprint', score: 88, integrity: '96%', submittedAt: '2h ago' },
  { id: 's2', challenge: 'Prompt Integrity Diagnostics', score: 81, integrity: '93%', submittedAt: '1d ago' },
  { id: 's3', challenge: 'Data Reasoning Accuracy Test', score: 79, integrity: '95%', submittedAt: '3d ago' },
  { id: 's4', challenge: 'System Design Tradeoff Drill', score: 85, integrity: '94%', submittedAt: '5d ago' },
];

export default function StudentDashboardPage() {
  return (
    <AuthenticatedShell title="Student Dashboard" subtitle="Track your performance, integrity, and challenge momentum.">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <h2 className="font-heading text-2xl font-semibold">Welcome back, Learner</h2>
        <p className="mt-2 text-sm text-neutral-600">Your current trajectory is strong. Keep building verifiable outcomes.</p>
      </motion.section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="SkillScore" value="84" hint="Top 12% this week" />
        <MetricCard label="IntegrityScore" value="95" hint="Consistent across recent submissions" />
        <MetricCard label="AI Probability" value="17%" hint="Mostly human-generated behavior" />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.1fr]">
        <SkillRadarChart title="Skill Radar" data={radarData} />
        <RecentSubmissionsTable rows={submissions} />
      </section>
    </AuthenticatedShell>
  );
}
