'use client';

import { HTMLMotionProps, motion } from 'framer-motion';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  label: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export default function AnimatedButton({ label, variant = 'primary', fullWidth = true, className, ...props }: AnimatedButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors';
  const variants = {
    primary: 'border border-black bg-black text-white hover:bg-neutral-800',
    secondary: 'border border-black/20 bg-white text-black hover:border-black',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className ?? ''}`}
      {...props}
    >
      {label}
    </motion.button>
  );
}
