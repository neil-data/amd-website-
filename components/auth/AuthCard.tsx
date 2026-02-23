'use client';

import { motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

interface AuthCardProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-8"
    >
      <h1 className="font-heading text-3xl font-semibold text-black">{title}</h1>
      <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </motion.section>
  );
}
