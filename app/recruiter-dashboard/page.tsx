'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import RankingTable from '@/components/authenticated/RankingTable';
import RoleGuard from '@/components/auth/RoleGuard';
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardStates';
import { useRecruiterDashboardData } from '@/hooks/useRecruiterDashboardData';

export default function RecruiterDashboardPage() {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const { dashboard, loading, error, candidate, candidateLoading } = useRecruiterDashboardData(selectedCandidateId);

  const students = useMemo(() => dashboard?.students ?? [], [dashboard?.students]);
  const metrics = useMemo(() => {
    const rankingRows = students.map((student) => ({
      id: student.id,
      name: student.name,
      role: 'Candidate',
      skillScore: student.totalPoints,
      integrity: Number(student.integrityScore.toFixed(1)),
    }));

    const avgIntegrity = students.length
      ? `${(students.reduce((sum, item) => sum + item.integrityScore, 0) / students.length).toFixed(1)}%`
      : '0%';

    const avgAi = students.length
      ? `${(students.reduce((sum, item) => sum + item.avgAiProbability, 0) / students.length).toFixed(1)}%`
      : '0%';

    const totalChallenges = students.reduce((sum, item) => sum + item.completedChallenges, 0);

    return { rankingRows, avgIntegrity, avgAi, totalChallenges };
  }, [students]);

  const handleSelectCandidate = (id: string) => {
    setSelectedCandidateId((prev) => (prev === id ? null : id));
  };

  const selectedStudent = students.find((s) => s.id === selectedCandidateId);

  return (
    <RoleGuard allowedRole="recruiter">
      <AuthenticatedShell title="Recruiter Dashboard" subtitle="Review top candidates and inspect their submission logs.">
        {loading && <DashboardLoading label="Loading recruiter analytics" />}
        {!loading && error && <DashboardError message={error} />}

        {!loading && !error && (
          <>
            {/* Summary metrics */}
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard label="Candidate Pool" value={String(students.length)} hint="Students currently ranked" />
              <MetricCard label="Avg Integrity" value={metrics.avgIntegrity} hint="Mean candidate integrity score" />
              <MetricCard label="Avg AI Probability" value={metrics.avgAi} hint="Lower values indicate stronger originality" />
            </section>

            <section className="grid grid-cols-1 gap-4">
              <MetricCard label="Total Completed Challenges" value={String(metrics.totalChallenges)} hint="Combined across visible candidates" />
            </section>

            {/* Candidate table */}
            <RankingTable
              rows={metrics.rankingRows}
              selectedId={selectedCandidateId}
              onSelect={handleSelectCandidate}
            />

            {/* Candidate submission log panel */}
            <AnimatePresence>
              {selectedCandidateId && (
                <motion.section
                  key={selectedCandidateId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border border-black/10 bg-white p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-black">
                        {selectedStudent?.name ?? 'Candidate'} — Submission Log
                      </h2>
                      <p className="mt-0.5 text-sm text-neutral-500">
                        {selectedStudent?.completedChallenges ?? 0} challenges completed ·{' '}
                        {selectedStudent?.totalPoints ?? 0} total pts ·{' '}
                        Integrity {selectedStudent?.integrityScore.toFixed(1) ?? '0'}%
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCandidateId(null)}
                      className="rounded-full border border-black/20 px-3 py-1 text-xs text-black hover:border-black/60"
                    >
                      Close
                    </button>
                  </div>

                  {candidateLoading && (
                    <p className="py-6 text-center text-sm text-neutral-500">Loading submission logs…</p>
                  )}

                  {!candidateLoading && candidate && (
                    <>
                      {/* Candidate metric row */}
                      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">SkillScore</p>
                          <p className="mt-1 font-heading text-2xl font-semibold">{candidate.totalPoints}</p>
                        </div>
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Integrity</p>
                          <p className="mt-1 font-heading text-2xl font-semibold">{candidate.integrityScore.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">AI Probability</p>
                          <p className="mt-1 font-heading text-2xl font-semibold">{candidate.avgAiProbability.toFixed(1)}%</p>
                        </div>
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">Challenges</p>
                          <p className="mt-1 font-heading text-2xl font-semibold">{candidate.completedChallenges}</p>
                        </div>
                      </div>

                      {/* Submission log table */}
                      {candidate.submissionHistory.length === 0 ? (
                        <p className="py-6 text-center text-sm text-neutral-500">No submissions recorded yet.</p>
                      ) : (
                        <div className="overflow-x-auto rounded-xl border border-black/10">
                          <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                              <tr className="border-b border-black/10 text-xs uppercase tracking-[0.14em] text-neutral-500">
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Challenge</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">AI Probability</th>
                                <th className="px-4 py-3">Time (s)</th>
                                <th className="px-4 py-3">Submitted</th>
                              </tr>
                            </thead>
                            <tbody>
                              {candidate.submissionHistory.map((sub, i) => (
                                <tr key={sub.id} className="border-b border-black/5 last:border-0 text-neutral-700">
                                  <td className="px-4 py-3 text-neutral-400">{i + 1}</td>
                                  <td className="px-4 py-3 font-medium text-black">{sub.challengeId}</td>
                                  <td className="px-4 py-3">{sub.score}</td>
                                  <td className={`px-4 py-3 font-medium ${sub.aiProbability > 70 ? 'text-red-500' : sub.aiProbability > 40 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                    {sub.aiProbability.toFixed(1)}%
                                  </td>
                                  <td className="px-4 py-3">{sub.timeTaken}</td>
                                  <td className="px-4 py-3 text-neutral-500">
                                    {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </>
                  )}
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}
      </AuthenticatedShell>
    </RoleGuard>
  );
}}
