'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionReveal from '@/components/landing/SectionReveal';

const features = [
  {
    title: 'Performance Verification',
    description: 'Validated outcomes from timed, role-specific challenge execution.',
    image: '/features/performance-verification.svg',
  },
  {
    title: 'AI Probability Detection',
    description: 'Behavioral analysis estimates human vs assisted generation patterns.',
    image: '/features/ai-probability-detection.svg',
  },
  {
    title: 'Integrity Score',
    description: 'Composite trust index based on consistency, transparency, and process.',
    image: '/features/integrity-score.svg',
  },
  {
    title: 'Skill Exchange',
    description: 'Peer-to-peer growth loops where expertise is demonstrated and shared.',
    image: '/features/skill-exchange.svg',
  },
  {
    title: 'Recruiter Trust Dashboard',
    description: 'Clear, ranked candidate evidence with role-fit confidence signals.',
    image: '/features/recruiter-trust-dashboard.svg',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Features</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Built for measurable trust</h2>
        </SectionReveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover="hover"
              whileTap={{ scale: 0.995 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.07 }}
              className="group rounded-2xl border border-black/10 bg-black/[0.02] p-6"
            >
              <motion.div
                variants={{
                  hover: { y: -2 },
                }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mb-5 overflow-hidden rounded-xl border border-black/10 bg-white"
              >
                <motion.div
                  variants={{
                    hover: { scale: 1.03 },
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex aspect-[16/9] items-center justify-center p-3"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={640}
                    height={360}
                    className="h-full w-full object-contain object-center"
                  />
                </motion.div>
              </motion.div>

              <h3 className="break-words font-heading text-xl font-medium leading-tight text-black">{feature.title}</h3>
              <p className="mt-3 break-words text-sm leading-relaxed text-neutral-700">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
