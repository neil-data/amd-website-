'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function MouseSpotlight() {
  const isMobile = useIsMobile();
  const frameRef = useRef<number | null>(null);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.3 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.3 });

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      if (frameRef.current !== null) {
        return;
      }

      const { clientX, clientY } = event;
      frameRef.current = window.requestAnimationFrame(() => {
        mouseX.set(clientX);
        mouseY.set(clientY);
        frameRef.current = null;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
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
