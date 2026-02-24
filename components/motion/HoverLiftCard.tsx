'use client';

import { PropsWithChildren } from 'react';
import { motion } from 'framer-motion';

interface HoverLiftCardProps extends PropsWithChildren {
  className?: string;
}

export default function HoverLiftCard({ children, className }: HoverLiftCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
