'use client';

import { motion } from 'framer-motion';
import SectionReveal from '@/components/landing/SectionReveal';

const rankings = [
  { name: 'Ava Chen', score: 98, role: 'Frontend Engineer' },
  { name: 'Noah Singh', score: 95, role: 'ML Product Builder' },
  { name: 'Lena Park', score: 93, role: 'Data Analyst' },
  { name: 'Mason Reed', score: 91, role: 'Full-Stack Developer' },
  { name: 'Iris Gomez', score: 89, role: 'AI Research Associate' },
];

export default function LeaderboardPreviewSection() {
  return (
    <section id="leaderboard" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Leaderboard Preview</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Performance ranking, transparent by design</h2>
        </SectionReveal>

        <div className="mt-10 space-y-3">
          {rankings.map((entry, index) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-black/10 bg-black/[0.02] p-4"
            >
              <span className="w-8 text-center font-heading text-xl text-neutral-600">{index + 1}</span>
              <div>
                <p className="font-medium text-black">{entry.name}</p>
                <p className="text-sm text-neutral-600">{entry.role}</p>
              </div>
              <span className="font-heading text-lg text-black">{entry.score}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
