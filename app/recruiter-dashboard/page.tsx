'use client';

import { useMemo } from 'react';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import RankingTable from '@/components/authenticated/RankingTable';
import RoleGuard from '@/components/auth/RoleGuard';
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardStates';
import { useRecruiterDashboardData } from '@/hooks/useRecruiterDashboardData';

export default function RecruiterDashboardPage() {
  const { dashboard, loading, error } = useRecruiterDashboardData(null);

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

  return (
    <RoleGuard allowedRole="recruiter">
      <AuthenticatedShell title="Recruiter Dashboard" subtitle="Review top candidates in the same sidebar workspace.">
          {loading && <DashboardLoading label="Loading recruiter analytics" />}
          {!loading && error && <DashboardError message={error} />}

          {!loading && !error && (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <MetricCard label="Candidate Pool" value={String(students.length)} hint="Students currently ranked" />
                <MetricCard label="Avg Integrity" value={metrics.avgIntegrity} hint="Mean candidate integrity score" />
                <MetricCard label="Avg AI Probability" value={metrics.avgAi} hint="Lower values indicate stronger originality" />
              </section>

              <section className="grid grid-cols-1 gap-4">
                <MetricCard label="Total Completed Challenges" value={String(metrics.totalChallenges)} hint="Combined across visible candidates" />
              </section>

              <RankingTable rows={metrics.rankingRows} />
            </>
          )}
      </AuthenticatedShell>
    </RoleGuard>
  );
}
