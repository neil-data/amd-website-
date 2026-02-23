'use client';

import { motion } from 'framer-motion';
import AuthenticatedShell from '@/components/authenticated/AuthenticatedShell';

export default function ProfilePage() {
  return (
    <AuthenticatedShell title="Profile" subtitle="Manage your public SkillRank identity and activity.">
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <h2 className="font-heading text-xl font-semibold">Profile Summary</h2>
        <p className="mt-2 text-sm text-neutral-600">Profile customization will be expanded in the next iteration.</p>
      </motion.section>
    </AuthenticatedShell>
  );
}
