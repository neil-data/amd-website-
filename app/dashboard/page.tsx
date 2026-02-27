'use client';

import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import MetricCard from '@/components/authenticated/MetricCard';
import RecentSubmissionsTable from '@/components/authenticated/RecentSubmissionsTable';
import SkillRadarChart from '@/components/authenticated/SkillRadarChart';
import RoleGuard from '@/components/auth/RoleGuard';
import { DashboardError, DashboardLoading } from '@/components/dashboard/DashboardStates';
import { useAuth } from '@/context/AuthContext';
import { useStudentDashboardData } from '@/hooks/useStudentDashboardData';

export default function StudentDashboardPage() {
  const { userId } = useAuth();
  const { data, loading, error } = useStudentDashboardData(userId);

  const radarData = [
    { metric: 'Integrity', score: Number(data?.integrityScore ?? 0) },
    { metric: 'Skill', score: Math.min(100, Number((data?.totalPoints ?? 0) / 10)) },
    { metric: 'Challenges', score: Math.min(100, Number((data?.completedChallenges ?? 0) * 10)) },
    { metric: 'Consistency', score: Math.max(0, 100 - Number(data?.avgAiProbability ?? 0)) },
  ];

  const recentRows = (data?.recentSubmissions ?? []).map((submission) => ({
    id: submission.id,
    challenge: submission.challengeId,
    score: submission.score,
    integrity: `${(100 - submission.aiProbability).toFixed(1)}%`,
    submittedAt: submission.createdAt ? new Date(submission.createdAt).toLocaleString() : 'N/A',
  }));

  return (
    <RoleGuard allowedRole="student">
      <AuthenticatedShell title="Dashboard" subtitle="Track your validated performance and integrity in one place.">
          {loading && <DashboardLoading label="Loading student metrics" />}
          {!loading && error && <DashboardError message={error} />}

          {!loading && !error && data && (
            <>
              <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total Points" value={data.totalPoints.toLocaleString()} hint="Accumulated performance points" />
                <MetricCard label="Integrity Score" value={`${data.integrityScore.toFixed(1)}%`} hint="Lower AI probability is better" />
                <MetricCard label="Completed Challenges" value={String(data.completedChallenges)} hint="Verified coding submissions" />
                <MetricCard label="Global Rank" value={data.globalRank ? `#${data.globalRank}` : 'Unranked'} hint="Live leaderboard position" />
              </section>

              <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <SkillRadarChart title="Performance Snapshot" data={radarData} />
                <RecentSubmissionsTable rows={recentRows} />
              </section>
            </>
          )}
      </AuthenticatedShell>
    </RoleGuard>
  );
}
