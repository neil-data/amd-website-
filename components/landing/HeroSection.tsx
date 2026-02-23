'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import BrandLogo from '@/components/BrandLogo';

const HeroCanvas = dynamic(() => import('@/components/landing/HeroCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] w-full animate-pulse rounded-2xl border border-black/10 bg-black/[0.03] md:h-[460px]" />
  ),
});

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section id="hero" className="relative flex min-h-screen w-full items-center justify-center px-6 pb-20 pt-32 md:px-12">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.24em] text-neutral-400"
          >
            Performance-Verified. Integrity-Protected.
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
          >
            <BrandLogo width={520} height={112} className="h-auto w-[280px] sm:w-[360px] md:w-[460px]" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-base leading-relaxed text-neutral-700 md:text-lg"
          >
            Verify ability through action, not claims. Build trust with measurable outcomes and explainable performance signals.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Get Started
            </a>
            <a
              href="#challenges"
              className="inline-flex items-center justify-center rounded-full border border-black/30 px-6 py-3 text-sm font-medium text-black transition-colors hover:border-black"
            >
              Explore Challenges
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-black/10 bg-black/[0.02] p-3"
        >
          {isMobile ? (
            <div className="flex h-[360px] w-full items-center justify-center rounded-xl border border-black/10 bg-gradient-to-b from-black/[0.05] to-transparent">
              <div className="h-28 w-28 rotate-12 rounded-xl border border-black/30 bg-black/[0.04]" />
            </div>
          ) : (
            <HeroCanvas />
          )}
        </motion.div>
      </div>
    </section>
  );
}
