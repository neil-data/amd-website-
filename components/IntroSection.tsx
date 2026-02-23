'use client';

import { motion } from 'framer-motion';

export default function IntroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden snap-start">
      
      {/* Background Grid - Minimalist */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Main Content */}
      <div className="z-10 flex flex-col items-center justify-center text-center px-4 md:px-0 max-w-5xl mx-auto">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-4 md:mb-6">
            SkillRank AI
          </h1>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="font-sans text-lg md:text-xl lg:text-2xl text-neutral-400 max-w-xl mx-auto leading-relaxed tracking-wide"
        >
          Performance-Verified. Integrity-Protected.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 flex flex-col items-center gap-2 cursor-pointer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="text-xs uppercase tracking-[0.2em] text-neutral-500 font-sans">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
          className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"
        />
      </motion.div>
    </section>
  );
}
