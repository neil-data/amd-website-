'use client';

import { motion } from 'framer-motion';
import SectionReveal from '@/components/landing/SectionReveal';

const challenges = [
  'Frontend Optimization Sprint',
  'Prompt Integrity Diagnostics',
  'System Design Tradeoff Drill',
  'Data Reasoning Accuracy Test',
  'AI-Human Collaboration Scenario',
  'Peer Review Precision Challenge',
];

export default function ChallengesPreviewSection() {
  return (
    <section id="challenges" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Challenges Preview</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Challenge formats that expose real capability</h2>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <motion.div
              key={challenge}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3, scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="rounded-xl border border-black/10 bg-black/[0.02] p-5"
            >
              <p className="text-sm uppercase tracking-[0.16em] text-neutral-500">Challenge</p>
              <h3 className="mt-2 font-heading text-lg text-black">{challenge}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
