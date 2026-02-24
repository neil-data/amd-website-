'use client';

import { PropsWithChildren } from 'react';
import { motion, Variants } from 'framer-motion';

interface StaggerContainerProps extends PropsWithChildren {
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

export function StaggerItem({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export default function StaggerContainer({
  children,
  className,
  stagger = 0.18,
  delayChildren = 0,
  amount = 0.2,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
