'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import SectionReveal from '@/components/landing/SectionReveal';
import { useIsMobile } from '@/hooks/useIsMobile';

const InteractiveOrbCanvas = dynamic(() => import('@/components/landing/InteractiveOrbCanvas'), {
  ssr: false,
  loading: () => <div className="h-48 w-48 animate-pulse rounded-full border border-black/10 bg-black/[0.03]" />,
});

export default function RecruitersSection() {
  const isMobile = useIsMobile();

  return (
    <section id="recruiters" className="px-6 py-24 md:px-12 md:py-32">
      <SectionReveal className="mx-auto max-w-5xl rounded-2xl border border-black/10 bg-black/[0.02] p-8 text-center md:p-12">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7 }}
            className="mx-auto"
            whileHover={isMobile ? undefined : { scale: 1.04, rotate: 2 }}
          >
            {isMobile ? (
              <div className="h-44 w-44 rounded-full border border-black/10 bg-black/[0.05]" />
            ) : (
              <InteractiveOrbCanvas accent="dark" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="text-center lg:text-left"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">For Recruiters</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Hire with confidence, not guesswork</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-700 lg:mx-0">
              Access candidate performance evidence, integrity signals, and clear role-fit indicators in one streamlined view.
            </p>
            <motion.a
              href="#"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-black bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
            >
              Request Recruiter Access
            </motion.a>
          </motion.div>
        </div>
      </SectionReveal>
    </section>
  );
}
