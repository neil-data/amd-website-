'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface RankingItem {
  id: string;
  name: string;
  role: string;
  skillScore: number;
  integrity: number;
}

type SortKey = 'skillScore' | 'integrity';

interface RankingTableProps {
  rows: RankingItem[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function RankingTable({ rows, selectedId, onSelect }: RankingTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('skillScore');

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [rows, sortKey]);

  const topThree = sorted.slice(0, 3);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-black">Ranking Table</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortKey('skillScore')}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              sortKey === 'skillScore' ? 'bg-black text-white' : 'border border-black/20 text-black'
            }`}
          >
            Sort: SkillScore
          </button>
          <button
            type="button"
            onClick={() => setSortKey('integrity')}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.14em] ${
              sortKey === 'integrity' ? 'bg-black text-white' : 'border border-black/20 text-black'
            }`}
          >
            Sort: Integrity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {topThree.map((item, index) => (
          <motion.article
            key={item.id}
            layout
            className="rounded-2xl border border-black/10 bg-black/[0.03] p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Top {index + 1}</p>
            <p className="mt-2 font-heading text-xl font-semibold">{item.name}</p>
            <p className="text-sm text-neutral-600">{item.role}</p>
          </motion.article>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 text-xs uppercase tracking-[0.16em] text-neutral-500">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">SkillScore</th>
              <th className="px-4 py-3">Integrity</th>
              {onSelect && <th className="px-4 py-3">Logs</th>}
            </tr>
          </thead>
          <AnimatePresence initial={false}>
            <tbody>
              {sorted.map((row, index) => (
                <motion.tr
                  layout
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onSelect?.(row.id)}
                  className={`border-b border-black/5 last:border-0 transition-colors ${
                    onSelect ? 'cursor-pointer hover:bg-black/[0.03]' : ''
                  } ${selectedId === row.id ? 'bg-black/[0.05]' : ''}`}
                >
                  <td className="px-4 py-3 font-medium">#{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-black">{row.name}</td>
                  <td className="px-4 py-3 text-neutral-700">{row.role}</td>
                  <td className="px-4 py-3">{row.skillScore}</td>
                  <td className="px-4 py-3">{row.integrity}</td>
                  {onSelect && (
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onSelect(row.id); }}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          selectedId === row.id
                            ? 'bg-black text-white'
                            : 'border border-black/20 text-black hover:border-black/60'
                        }`}
                      >
                        {selectedId === row.id ? 'Viewing' : 'View Logs'}
                      </button>
                    </td>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
    </section>
  );
}
