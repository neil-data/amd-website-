'use client';

import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import RankingTable, { RankingItem } from '@/components/authenticated/RankingTable';

const rankingRows: RankingItem[] = [
  { id: 'r1', name: 'Ava Chen', role: 'Frontend Engineer', skillScore: 98, integrity: 96 },
  { id: 'r2', name: 'Noah Singh', role: 'ML Product Builder', skillScore: 95, integrity: 94 },
  { id: 'r3', name: 'Lena Park', role: 'Data Analyst', skillScore: 93, integrity: 95 },
  { id: 'r4', name: 'Mason Reed', role: 'Full-Stack Developer', skillScore: 91, integrity: 90 },
  { id: 'r5', name: 'Iris Gomez', role: 'AI Research Associate', skillScore: 89, integrity: 92 },
  { id: 'r6', name: 'Elijah Brooks', role: 'Backend Engineer', skillScore: 87, integrity: 91 },
];

export default function LeaderboardPage() {
  return (
    <AuthenticatedShell title="Leaderboard" subtitle="See top ranked contributors by validated performance and integrity.">
      <RankingTable rows={rankingRows} />
    </AuthenticatedShell>
  );
}
