'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import SectionReveal from '@/components/landing/SectionReveal';
import { useIsMobile } from '@/hooks/useIsMobile';

const InteractiveOrbCanvas = dynamic(() => import('@/components/landing/InteractiveOrbCanvas'), {
  ssr: false,
  loading: () => <div className="h-48 w-48 animate-pulse rounded-full border border-black/10 bg-black/[0.03]" />,
});

export default function TrustCrisisSection() {
  const isMobile = useIsMobile();

  return (
    <section id="trust-crisis" className="px-6 py-24 md:px-12 md:py-32">
      <SectionReveal className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 text-center lg:grid-cols-[1fr_auto] lg:text-left">
        <motion.div
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65 }}
        >
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500">Trust Crisis</p>
        <h2 className="font-heading text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          Credentials are easy to claim. Proven performance is harder to fake.
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-neutral-700 md:text-lg">
          SkillRank AI replaces resume noise with evidence. Every signal is grounded in how people solve, explain, and teach in real scenarios.
        </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mx-auto"
          whileHover={isMobile ? undefined : { scale: 1.04, rotate: -2 }}
        >
          {isMobile ? (
            <div className="h-48 w-48 rounded-full border border-black/10 bg-black/[0.04]" />
          ) : (
            <InteractiveOrbCanvas accent="muted" />
          )}
        </motion.div>
      </SectionReveal>
    </section>
  );
}
