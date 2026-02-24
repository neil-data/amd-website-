'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import FadeUp from '@/components/motion/FadeUp';
import StaggerContainer, { StaggerItem } from '@/components/motion/StaggerContainer';
import HoverLiftCard from '@/components/motion/HoverLiftCard';

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
        <FadeUp>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Features</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Built for measurable trust</h2>
        </FadeUp>

        <StaggerContainer stagger={0.16} className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <HoverLiftCard className="group rounded-2xl border border-black/10 bg-black/[0.02] p-6">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                  className="mb-5 overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <div className="relative aspect-[16/10] p-4">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain object-center p-2"
                    />
                  </div>
                </motion.div>

                <h3 className="break-words font-heading text-xl font-medium leading-tight text-black">{feature.title}</h3>
                <p className="mt-3 break-words text-sm leading-relaxed text-neutral-700">{feature.description}</p>
              </HoverLiftCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
