'use client';

import { useEffect, useMemo, useState } from 'react';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import RankingTable, { RankingItem } from '@/components/authenticated/RankingTable';
import { apiRequest } from '@/lib/api/client';

interface LeaderboardApiRow {
  id: string;
  name: string;
  totalPoints: number;
  integrityScore: number;
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadLeaderboard() {
      try {
        setLoading(true);
        setError(null);
        const payload = await apiRequest<{ leaderboard: LeaderboardApiRow[] }>('/api/leaderboard?limit=100');
        if (!mounted) {
          return;
        }

        setRows(
          payload.leaderboard.map((row) => ({
            id: row.id,
            name: row.name,
            role: 'Candidate',
            skillScore: row.totalPoints,
            integrity: Number(row.integrityScore.toFixed(1)),
          })),
        );
      } catch (apiError) {
        const nextMessage = apiError instanceof Error ? apiError.message : 'Failed to load leaderboard.';
        if (mounted) {
          setError(nextMessage);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadLeaderboard();

    return () => {
      mounted = false;
    };
  }, []);

  const hasRows = useMemo(() => rows.length > 0, [rows.length]);

  return (
    <AuthenticatedShell title="Leaderboard" subtitle="See top ranked contributors by validated performance and integrity.">
      {loading && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-neutral-600">Loading leaderboard…</div>}
      {!loading && error && <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-red-600">{error}</div>}
      {!loading && !error && hasRows && <RankingTable rows={rows} />}
      {!loading && !error && !hasRows && (
        <div className="rounded-xl border border-black/10 bg-black/[0.03] p-4 text-sm text-neutral-600">No ranked users yet.</div>
      )}
    </AuthenticatedShell>
  );
}
