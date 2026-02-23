'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/Navbar';
import LandingPage from '@/components/landing/LandingPage';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const [loading, setLoading] = useState(true);

  return (
    <main className="relative min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>
      
      {!loading && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1 }}
           className="relative z-0 w-full h-full"
        >
          <Navbar />
          <LandingPage />
        </motion.div>
      )}
    </main>
  );
}
