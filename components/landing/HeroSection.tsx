'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import BrandLogo from '@/components/BrandLogo';
import FadeUp from '@/components/motion/FadeUp';
import MagneticButton from '@/components/motion/MagneticButton';

const HeroCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse rounded-2xl border border-black/10 bg-black/[0.03] md:h-[460px]" />
  ),
});

export default function HeroSection() {
  const isMobile = useIsMobile();
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setShowCanvas(false);
      return;
    }

    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (browserWindow.requestIdleCallback) {
      const idleId = browserWindow.requestIdleCallback(() => {
        setShowCanvas(true);
      }, { timeout: 200 });

      return () => {
        if (browserWindow.cancelIdleCallback) {
          browserWindow.cancelIdleCallback(idleId);
        }
      };
    }

    const timerId = window.setTimeout(() => {
      setShowCanvas(true);
    }, 120);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isMobile]);

  return (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center px-6 pb-20 pt-32 md:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <FadeUp duration={0.62}>
            <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Performance-Verified. Integrity-Protected.</p>
          </FadeUp>

          <FadeUp duration={0.7} delay={0.06}>
            <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <BrandLogo width={520} height={112} className="h-auto w-[280px] sm:w-[360px] md:w-[460px]" />
            </h1>
          </FadeUp>

          <FadeUp duration={0.7} delay={0.12}>
            <p className="max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Verify ability through action, not claims. Build trust with measurable outcomes and explainable performance signals.
            </p>
          </FadeUp>

          <FadeUp duration={0.72} delay={0.18}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <MagneticButton className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800">
                <a href="#how-it-works">Get Started</a>
              </MagneticButton>
              <MagneticButton className="inline-flex items-center justify-center rounded-full border border-black/30 px-6 py-3 text-sm font-medium text-black transition-colors hover:border-black">
                <a href="#challenges">Explore Challenges</a>
              </MagneticButton>
            </div>
          </FadeUp>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.78, delay: 0.15, ease: 'easeOut' }}
          className="rounded-2xl border border-black/10 bg-black/[0.02] p-3"
        >
          {isMobile ? (
            <div className="flex h-[360px] w-full items-center justify-center rounded-xl border border-black/10 bg-gradient-to-b from-black/[0.05] to-transparent">
              <div className="h-28 w-28 rotate-12 rounded-xl border border-black/30 bg-black/[0.04]" />
            </div>
          ) : (
            showCanvas ? (
              <HeroCanvas />
            ) : (
              <div className="h-[360px] w-full animate-pulse rounded-2xl border border-black/10 bg-black/[0.03] md:h-[460px]" />
            )
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-5 rounded-full border border-black/40"
        >
          <div className="mx-auto mt-1 h-1.5 w-1.5 rounded-full bg-black/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
