'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function MouseSpotlight() {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.3 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.3 });

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[5] h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0)_70%)]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  );
}
