'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  History,
  Trophy,
  Bell,
  Filter,
  Search,
  Download,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StaggerContainer, { StaggerItem } from '@/components/motion/StaggerContainer';

type Page = 'recruiter' | 'records';

const CANDIDATES = [
  { name: 'Arjun Mehta', rank: 'Platinum', skills: ['React', 'Node', 'Go'], points: 12450, teachScore: 98, learnScore: 85 },
  { name: 'Priya Sharma', rank: 'Gold', skills: ['Python', 'PyTorch', 'AWS'], points: 11820, teachScore: 75, learnScore: 92 },
  { name: 'Rohan Gupta', rank: 'Gold', skills: ['Rust', 'C++', 'Security'], points: 11200, teachScore: 88, learnScore: 70 },
];

function Sidebar({ currentPage, setPage, onLogout }: { currentPage: Page; setPage: (p: Page) => void; onLogout: () => void }) {
  const menuItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'recruiter', label: 'Recruiter Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Records', icon: History },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 hidden h-screen w-64 flex-col border-r border-black bg-white md:flex"
    >
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight">SkillRank AI</h1>
      </div>
      <nav className="flex-1 space-y-2 px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full rounded-lg px-4 py-3 text-left flex items-center gap-3 transition-all ${
              currentPage === item.id ? 'bg-black text-white' : 'text-black hover:bg-black/5'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="border-t border-black p-4">
        <button onClick={onLogout} className="w-full rounded-lg px-4 py-3 text-left flex items-center gap-3 text-black transition-all hover:bg-black/5">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.aside>
  );
}

function TopNav({ setPage, onLogout }: { setPage: (p: Page) => void; onLogout: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden" onClick={() => setIsMenuOpen((prev) => !prev)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <h2 className="text-xl font-bold md:hidden">SkillRank AI</h2>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-2 rounded-full border border-black px-3 py-1.5 sm:flex">
            <Search className="h-4 w-4" />
            <input type="text" placeholder="Search..." className="w-32 bg-transparent text-sm outline-none" />
          </div>
          <Bell className="h-5 w-5 cursor-pointer" />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">HR</div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 md:hidden"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-screen w-[86vw] max-w-sm border-l border-black/10 bg-white px-6 py-20 md:hidden"
            >
              <nav className="space-y-4">
                {[
                  { label: 'Recruiter Dashboard', key: 'recruiter' as Page },
                  { label: 'Records', key: 'records' as Page },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setPage(item.key);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg font-medium"
                  >
                    {item.label}
                  </button>
                ))}
                <hr className="border-black/10" />
                <button onClick={onLogout} className="block w-full text-left text-lg font-medium text-black/60">
                  Logout
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function RecruitersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <h1 className="text-3xl font-bold">Recruiter Dashboard</h1>
            <span className="flex items-center gap-1 rounded bg-black px-2 py-0.5 text-[10px] font-bold text-white">
              <Trophy className="h-3 w-3" /> VERIFIED
            </span>
          </div>
          <p className="text-black/60">Find and hire the top technical talent based on real contributions.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">Company Profile</button>
          <button className="btn-primary">Post Opening</button>
        </div>
      </div>

      <StaggerContainer stagger={0.16} className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-1">
          <StaggerItem>
            <div className="card space-y-6">
            <h3 className="text-lg font-bold">Filter Talent</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-black/40">Minimum Rank</label>
                <select className="input-field text-sm">
                  <option>Any Rank</option>
                  <option>Platinum</option>
                  <option>Gold</option>
                  <option>Silver</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-black/40">Skill Focus</label>
                <div className="space-y-2">
                  {['React', 'Python', 'Node.js', 'Security', 'AI/ML'].map((skill) => (
                    <label key={skill} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 rounded border-black focus:ring-black" />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
              <button className="btn-primary w-full text-sm">Apply Filters</button>
            </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card border-dashed bg-black/5">
            <h4 className="mb-2 text-sm font-bold">Hiring Roles</h4>
            <div className="space-y-2">
              <div className="rounded border border-black/10 bg-white p-2">
                <p className="text-xs font-bold">Senior Frontend Eng.</p>
                <p className="text-[10px] text-black/40">3 Candidates saved</p>
              </div>
              <div className="rounded border border-black/10 bg-white p-2">
                <p className="text-xs font-bold">Backend Architect</p>
                <p className="text-[10px] text-black/40">1 Candidate saved</p>
              </div>
            </div>
            </div>
          </StaggerItem>
        </div>

        <div className="space-y-6 lg:col-span-3">
          <StaggerContainer stagger={0.15} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CANDIDATES.map((candidate) => (
              <StaggerItem key={candidate.name}>
                <div className="card group transition-all hover:border-black">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black font-bold text-white">
                      {candidate.name.split(' ').map((name) => name[0]).join('')}
                    </div>
                    <div>
                      <h3 className="cursor-pointer font-bold group-hover:underline">{candidate.name}</h3>
                      <span className="rounded border border-black px-1.5 py-0.5 text-[10px] font-bold">{candidate.rank}</span>
                    </div>
                  </div>
                  <button className="text-black/40 hover:text-black">
                    <Bell className="h-4 w-4" />
                  </button>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <span key={skill} className="rounded bg-black/5 px-2 py-0.5 text-[10px] font-bold">{skill}</span>
                  ))}
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4 border-y border-black/5 py-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-black/40">Points</p>
                    <p className="text-sm font-bold">{candidate.points.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-black/40">Teach</p>
                    <p className="text-sm font-bold">{candidate.teachScore}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase text-black/40">Learn</p>
                    <p className="text-sm font-bold">{candidate.learnScore}%</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="btn-secondary flex-1 py-2 text-xs">Shortlist</button>
                  <button className="btn-primary flex-1 py-2 text-xs">Contact</button>
                </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </StaggerContainer>
    </div>
  );
}

function RecordsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Records</h1>
          <p className="text-black/60">A complete history of your performance.</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="flex flex-wrap gap-4 rounded-xl border border-black bg-black/5 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Type:</span>
          <select className="border-none bg-transparent text-sm font-medium focus:ring-0">
            <option>All Activities</option>
            <option>Assessments</option>
            <option>Interviews</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">Date:</span>
          <select className="border-none bg-transparent text-sm font-medium focus:ring-0">
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="overflow-hidden rounded-xl border border-black"
      >
        <table className="w-full text-left">
          <thead className="border-b border-black bg-black/5">
            <tr>
              <th className="px-6 py-4 text-sm font-bold uppercase">Date</th>
              <th className="px-6 py-4 text-sm font-bold uppercase">Candidate</th>
              <th className="px-6 py-4 text-sm font-bold uppercase">Role</th>
              <th className="px-6 py-4 text-right text-sm font-bold uppercase">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {[
              { date: '2026-02-20', name: 'Arjun Mehta', role: 'Senior Frontend Eng.', res: 'Shortlisted' },
              { date: '2026-02-19', name: 'Priya Sharma', role: 'ML Engineer', res: 'Interviewed' },
              { date: '2026-02-18', name: 'Rohan Gupta', role: 'Security Engineer', res: 'Saved' },
              { date: '2026-02-16', name: 'Lena Park', role: 'Backend Architect', res: 'Rejected' },
            ].map((rec, index) => (
              <tr key={`${rec.date}-${index}`} className="transition-colors hover:bg-black/5">
                <td className="px-6 py-4 font-mono text-sm">{rec.date}</td>
                <td className="px-6 py-4 font-medium">{rec.name}</td>
                <td className="px-6 py-4 text-sm text-black/60">{rec.role}</td>
                <td className={`px-6 py-4 text-right font-mono font-bold ${rec.res === 'Rejected' ? 'text-black/40' : ''}`}>{rec.res}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

export default function RecruiterDashboardPage() {
  const [page, setPage] = useState<Page>('recruiter');
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentPage={page} setPage={setPage} onLogout={handleLogout} />

      <div className="flex flex-1 flex-col">
        <TopNav setPage={setPage} onLogout={handleLogout} />

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {page === 'recruiter' && <RecruitersPage />}
              {page === 'records' && <RecordsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
