'use client';

import { PropsWithChildren } from 'react';
import FadeUp from '@/components/motion/FadeUp';

interface SectionRevealProps extends PropsWithChildren {
  className?: string;
}

export default function SectionReveal({ children, className }: SectionRevealProps) {
  return (
    <FadeUp className={className} duration={0.72} amount={0.2}>
      {children}
    </FadeUp>
  );
}
