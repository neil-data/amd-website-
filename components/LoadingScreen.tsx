'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3 seconds total display time
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait" onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
            key="loading-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"
        >
          <div className="relative z-10 flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tighter text-black"
            >
              <BrandLogo width={420} height={96} className="h-auto w-[260px] md:w-[340px] lg:w-[420px]" />
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-6 text-sm md:text-base font-sans tracking-[0.2em] text-neutral-600 uppercase"
            >
              Performance-Verified. Integrity-Protected.
            </motion.p>
          </div>
          
          {/* Subtle background glow */}
          <motion.div
             initial={{ opacity: 0, scale: 0.5 }}
             animate={{ opacity: 0.3, scale: 1 }}
             transition={{ duration: 2 }}
             className="absolute inset-0 bg-gradient-to-br from-neutral-300/20 via-transparent to-transparent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
