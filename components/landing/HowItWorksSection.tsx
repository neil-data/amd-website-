'use client';

import { motion } from 'framer-motion';
import SectionReveal from '@/components/landing/SectionReveal';

const steps = ['Learn', 'Solve', 'Explain', 'Teach', 'Unlock'];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">How It Works</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl md:text-5xl">Learn → Solve → Explain → Teach → Unlock</h2>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-center"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Step {index + 1}</p>
              <h3 className="mt-2 font-heading text-lg font-medium">{step}</h3>
              {index < steps.length - 1 && (
                <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-[1px] w-6 -translate-y-1/2 bg-black/20 md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
