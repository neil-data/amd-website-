'use client';

import { motion } from 'framer-motion';

interface SubmissionItem {
  id: string;
  challenge: string;
  score: number;
  integrity: string;
  submittedAt: string;
}

interface RecentSubmissionsTableProps {
  rows: SubmissionItem[];
}

export default function RecentSubmissionsTable({ rows }: RecentSubmissionsTableProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-black/10 bg-white p-4 sm:p-5"
    >
      <h2 className="font-heading text-xl font-semibold">Recent Submissions</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.16em] text-neutral-500">
              <th className="px-2 py-3">Challenge</th>
              <th className="px-2 py-3">SkillScore</th>
              <th className="px-2 py-3">Integrity</th>
              <th className="px-2 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-black/5 text-neutral-700 last:border-0">
                <td className="px-2 py-3 font-medium text-black">{row.challenge}</td>
                <td className="px-2 py-3">{row.score}</td>
                <td className="px-2 py-3">{row.integrity}</td>
                <td className="px-2 py-3">{row.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
