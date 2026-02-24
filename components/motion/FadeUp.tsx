'use client';

import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface FadeUpProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
}

export default function FadeUp({
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.25,
}: FadeUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
