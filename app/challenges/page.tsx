'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';
import DifficultyTag from '@/components/authenticated/DifficultyTag';
import ChallengeFilters from '@/components/authenticated/ChallengeFilters';

interface ChallengeItem {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  duration: string;
}

const challengeList: ChallengeItem[] = [
  { id: 'c1', title: 'Frontend Optimization Sprint', difficulty: 'Intermediate', category: 'Frontend', duration: '45 min' },
  { id: 'c2', title: 'Prompt Integrity Diagnostics', difficulty: 'Advanced', category: 'AI', duration: '60 min' },
  { id: 'c3', title: 'Data Reasoning Accuracy Test', difficulty: 'Beginner', category: 'Analytics', duration: '30 min' },
  { id: 'c4', title: 'System Design Tradeoff Drill', difficulty: 'Advanced', category: 'Architecture', duration: '75 min' },
  { id: 'c5', title: 'Peer Review Precision Challenge', difficulty: 'Intermediate', category: 'Collaboration', duration: '40 min' },
  { id: 'c6', title: 'AI-Human Collaboration Scenario', difficulty: 'Intermediate', category: 'AI', duration: '50 min' },
];

export default function ChallengesPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All');

  const filtered = useMemo(() => {
    return challengeList.filter((challenge) => {
      const matchesSearch = challenge.title.toLowerCase().includes(search.toLowerCase());
      const matchesDifficulty = difficulty === 'All' || challenge.difficulty === difficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [search, difficulty]);

  return (
    <AuthenticatedShell title="Challenges" subtitle="Browse and attempt challenges that verify real skill.">
      <ChallengeFilters search={search} setSearch={setSearch} difficulty={difficulty} setDifficulty={setDifficulty} />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((challenge, index) => (
          <motion.article
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            className="rounded-2xl border border-black/10 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">{challenge.category}</p>
            <h2 className="mt-2 font-heading text-xl font-semibold">{challenge.title}</h2>
            <div className="mt-4 flex items-center justify-between">
              <DifficultyTag level={challenge.difficulty} />
              <span className="text-sm text-neutral-600">{challenge.duration}</span>
            </div>
          </motion.article>
        ))}
      </section>
    </AuthenticatedShell>
  );
}
