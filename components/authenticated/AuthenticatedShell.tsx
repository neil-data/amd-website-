'use client';

import { PropsWithChildren, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import SidebarNav from '@/components/authenticated/SidebarNav';
import { useAuth } from '@/context/AuthContext';

interface AuthenticatedShellProps extends PropsWithChildren {
  title: string;
  subtitle: string;
}

export default function AuthenticatedShell({ title, subtitle, children }: AuthenticatedShellProps) {
  const { role } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const header = useMemo(
    () => (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">SkillRank AI</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-black md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-neutral-600 md:text-base">{subtitle}</p>
      </motion.div>
    ),
    [title, subtitle]
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white px-4 pb-8 pt-24 sm:px-6 md:px-10">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
          <aside className="hidden rounded-2xl border border-black/10 bg-black/[0.02] p-4 lg:block lg:sticky lg:top-24 lg:h-fit">
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-neutral-500">Navigation</p>
            <SidebarNav role={role} />
          </aside>

          <section className="space-y-6">
            <div className="flex items-start justify-between gap-4 lg:hidden">
              {header}
              <button
                type="button"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="rounded-full border border-black px-3 py-2 text-xs uppercase tracking-[0.14em]"
              >
                Menu
              </button>
            </div>

            <AnimatePresence>
              {mobileOpen && (
                <motion.aside
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02] p-4 lg:hidden"
                >
                  <SidebarNav role={role} onNavigate={() => setMobileOpen(false)} />
                </motion.aside>
              )}
            </AnimatePresence>

            <div className="hidden lg:block">{header}</div>
            {children}
          </section>
        </div>
      </main>
    </>
  );
}
