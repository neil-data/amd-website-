'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export default function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.28 }}
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-5"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="mt-3 font-heading text-3xl font-semibold text-black">{value}</p>
      <p className="mt-1 text-sm text-neutral-600">{hint}</p>
    </motion.article>
  );
}
