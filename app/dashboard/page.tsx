'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Trophy,
  ArrowLeftRight,
  BarChart3,
  History,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Filter,
  User,
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import StaggerContainer, { StaggerItem } from '@/components/motion/StaggerContainer';
import SkillRadarChart from '@/components/authenticated/SkillRadarChart';

type Page = 'dashboard' | 'challenges' | 'exchange' | 'leaderboard';

const CHALLENGES = [
  { id: 1, name: 'Code Sprint', description: 'Solve 10 algorithm problems in 30 minutes.', difficulty: 'Hard', skill: 'DSA', points: 500 },
  { id: 2, name: 'UI Refactor', description: 'Convert a legacy component to modern React.', difficulty: 'Medium', skill: 'Web', points: 300 },
  { id: 3, name: 'Bug Hunt', description: 'Find and fix 3 critical security vulnerabilities.', difficulty: 'Expert', skill: 'Security', points: 800 },
  { id: 4, name: 'Documentation', description: 'Write clear API docs for the new endpoint.', difficulty: 'Easy', skill: 'Writing', points: 150 },
  { id: 5, name: 'Performance Audit', description: 'Reduce bundle size by at least 20%.', difficulty: 'Medium', skill: 'Web', points: 400 },
  { id: 6, name: 'Unit Testing', description: 'Achieve 90% coverage on the auth module.', difficulty: 'Hard', skill: 'Testing', points: 450 },
];

const LEADERBOARD = [
  { rank: 1, user: 'Arjun Mehta', score: 12450, skill: 'Fullstack' },
  { rank: 2, user: 'Priya Sharma', score: 11820, skill: 'AI/ML' },
  { rank: 3, user: 'Rohan Gupta', score: 11200, skill: 'Security' },
  { rank: 4, user: 'Ananya Iyer', score: 9800, skill: 'Frontend' },
  { rank: 5, user: 'You', score: 8540, isUser: true, skill: 'Backend' },
  { rank: 6, user: 'Vikram Singh', score: 7200, skill: 'DevOps' },
];

const MENTORS = [
  { name: 'Dr. Amrita Rao', skill: 'System Design', rating: 4.9, points: 200 },
  { name: 'Kabir Das', skill: 'React Performance', rating: 4.8, points: 150 },
  { name: 'Sita Ram', skill: 'Cloud Architecture', rating: 4.7, points: 180 },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'Challenge', name: 'Code Sprint', status: 'Completed', date: '2024-03-20', points: '+500' },
  { id: 2, type: 'Exchange', name: 'Points to Credits', status: 'Success', date: '2024-03-19', points: '-1000' },
  { id: 3, type: 'Challenge', name: 'Bug Hunt', status: 'Failed', date: '2024-03-18', points: '0' },
];

const RADAR_DATA = [
  { metric: 'Learning', score: 84 },
  { metric: 'Teaching', score: 76 },
  { metric: 'Challenges', score: 88 },
  { metric: 'Collaboration', score: 74 },
  { metric: 'Consistency', score: 81 },
];

function Sidebar({ currentPage, setPage, onLogout }: { currentPage: Page; setPage: (p: Page) => void; onLogout: () => void }) {
  const menuItems: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'challenges', label: 'Challenges', icon: Trophy },
    { id: 'exchange', label: 'Exchange', icon: ArrowLeftRight },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
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

function TopNav({ setPage, onLogout, userInitials }: { setPage: (p: Page) => void; onLogout: () => void; userInitials: string }) {
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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">{userInitials}</div>
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
                  { label: 'Dashboard', key: 'dashboard' as Page },
                  { label: 'Challenges', key: 'challenges' as Page },
                  { label: 'Exchange', key: 'exchange' as Page },
                  { label: 'Leaderboard', key: 'leaderboard' as Page },
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

function DashboardPage({ userName, userInitials }: { userName: string; userInitials: string }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Good morning, {userName}</h1>
          <p className="text-black/60">Here&apos;s what&apos;s happening with your account today.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          New Challenge
        </button>
      </div>

      <StaggerContainer stagger={0.16} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Rank', value: 'Gold II', sub: 'Top 5% globally' },
          { label: 'Total Points', value: '8,540', sub: '+450 this week' },
          { label: 'Sessions Taught', value: '12', sub: '4.9/5.0 rating' },
          { label: 'Sessions Learned', value: '28', sub: '5 skills mastered' },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <div className="card">
              <p className="text-sm font-medium uppercase tracking-wider text-black/60">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-xs text-black/40">{stat.sub}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <SkillRadarChart title="Skill Momentum Radar" data={RADAR_DATA} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Points Breakdown</h2>
          </div>
          <StaggerContainer stagger={0.15} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Learning', value: '3,200', icon: History },
              { label: 'Teaching', value: '2,800', icon: User },
              { label: 'Challenges', value: '2,540', icon: Trophy },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="card flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/5">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-black/40">{item.label}</p>
                    <p className="text-lg font-bold">{item.value}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="flex items-center justify-between pt-4">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <button className="text-sm font-medium underline">View all</button>
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
                  <th className="px-6 py-4 text-sm font-bold uppercase">Activity</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase">Status</th>
                  <th className="px-6 py-4 text-sm font-bold uppercase">Date</th>
                  <th className="px-6 py-4 text-right text-sm font-bold uppercase">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {RECENT_ACTIVITY.map((act) => (
                  <tr key={act.id} className="transition-colors hover:bg-black/5">
                    <td className="px-6 py-4">
                      <p className="font-medium">{act.name}</p>
                      <p className="text-xs text-black/40">{act.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full border border-black px-2 py-1 text-xs ${act.status === 'Completed' || act.status === 'Success' ? 'bg-black text-white' : ''}`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{act.date}</td>
                    <td className="px-6 py-4 text-right font-mono font-bold">{act.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold">Profile Summary</h2>
          <div className="card bg-black text-white">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-black">{userInitials}</div>
              <div>
                <p className="font-bold">{userName}</p>
                <p className="text-xs text-white/60">Student</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Level</span>
                <span>42</span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/20">
                <div className="h-full w-3/4 rounded-full bg-white" />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>12,400 XP</span>
                <span>15,000 XP</span>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg border border-white py-2 text-sm font-medium transition-all hover:bg-white hover:text-black">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-black/60">Test your skills and earn exclusive rewards.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black/5">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black/5">
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CHALLENGES.map((challenge) => (
          <motion.div key={challenge.id} whileHover={{ y: -4 }} className="card flex h-full flex-col">
            <div className="mb-2 flex items-start justify-between">
              <h3 className="text-xl font-bold">{challenge.name}</h3>
              <span className="rounded border border-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest">
                {challenge.difficulty}
              </span>
            </div>
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded bg-black px-2 py-0.5 text-xs font-bold text-white">{challenge.skill}</span>
              <span className="font-mono text-xs font-bold text-black/40">+{challenge.points} PTS</span>
            </div>
            <p className="mb-8 flex-1 text-sm text-black/60">{challenge.description}</p>
            <button className="btn-primary flex w-full items-center justify-center gap-2">
              Start Challenge
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ExchangePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Exchange Knowledge for Points</h1>
        <p className="text-black/60">Earn points by teaching, spend them to learn from the best.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="card space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white">
                  <User className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Teach &amp; Earn</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Topic</label>
                  <input type="text" placeholder="e.g. Advanced React Patterns" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Skill</label>
                    <select className="input-field">
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Mobile</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration</label>
                    <select className="input-field">
                      <option>30 mins</option>
                      <option>60 mins</option>
                      <option>90 mins</option>
                    </select>
                  </div>
                </div>
                <div className="rounded-lg border border-black/10 bg-black/5 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-black/60">Estimated Earnings</span>
                    <span className="font-bold">+150 PTS</span>
                  </div>
                </div>
                <button className="btn-primary w-full">Publish Session</button>
              </div>
            </div>

            <div className="card space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-black bg-white text-black">
                  <Trophy className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">Learn &amp; Spend</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-black/60">Browse top mentors and book a session using your points.</p>
                <div className="space-y-3">
                  {MENTORS.map((mentor) => (
                    <div key={mentor.name} className="cursor-pointer rounded-lg border border-black/10 p-3 transition-colors hover:bg-black/5 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold">{mentor.name}</p>
                        <p className="text-[10px] font-bold uppercase text-black/40">{mentor.skill}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">{mentor.rating} ★</p>
                        <p className="font-mono text-[10px]">{mentor.points} PTS</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary w-full">Browse All Mentors</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">Session History</h3>
            <div className="overflow-hidden rounded-xl border border-black">
              <table className="w-full text-left">
                <thead className="border-b border-black bg-black/5">
                  <tr>
                    <th className="px-6 py-4 text-sm font-bold uppercase">Type</th>
                    <th className="px-6 py-4 text-sm font-bold uppercase">Member</th>
                    <th className="px-6 py-4 text-sm font-bold uppercase">Skill</th>
                    <th className="px-6 py-4 text-right text-sm font-bold uppercase">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10 text-sm">
                  {[
                    { type: 'Teach', member: 'Priya Sharma', skill: 'React', points: '+150' },
                    { type: 'Learn', member: 'Dr. Amrita Rao', skill: 'System Design', points: '-200' },
                    { type: 'Teach', member: 'Rohan Gupta', skill: 'Node.js', points: '+150' },
                  ].map((session, index) => (
                    <tr key={`${session.member}-${index}`} className="transition-colors hover:bg-black/5">
                      <td className="px-6 py-4 font-medium">{session.type}</td>
                      <td className="px-6 py-4">{session.member}</td>
                      <td className="px-6 py-4 text-black/40">{session.skill}</td>
                      <td className={`px-6 py-4 text-right font-mono font-bold ${session.type === 'Learn' ? 'text-black/40' : ''}`}>{session.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card bg-black text-white">
            <p className="text-sm font-medium uppercase tracking-wider text-white/60">Your Balance</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-bold">8,540</span>
              <span className="text-xl font-medium text-white/60">Points</span>
            </div>
            <div className="mt-8 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Earned this month</span>
                <span className="font-bold">+1,240</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Spent this month</span>
                <span className="font-bold">-450</span>
              </div>
            </div>
          </div>

          <div className="card border-dashed border-black/40">
            <h4 className="mb-2 font-bold">How it works</h4>
            <ul className="space-y-3 text-xs text-black/60">
              <li className="flex gap-2"><span className="font-bold">01.</span><span>Share your expertise by hosting teaching sessions or helping in discussions.</span></li>
              <li className="flex gap-2"><span className="font-bold">02.</span><span>Earn points for every successful session and positive feedback.</span></li>
              <li className="flex gap-2"><span className="font-bold">03.</span><span>Use your points to book sessions with industry leaders or access premium content.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeaderboardPage({ userName }: { userName: string }) {
  const [activeTab, setActiveTab] = useState('Coders');
  const leaderboardRows = LEADERBOARD.map((user) => (user.isUser ? { ...user, user: userName } : user));

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold">Global Leaderboard</h1>
          <p className="text-black/60">See how you stack up against the best.</p>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <button className="flex items-center gap-2 rounded-lg border border-black px-4 py-2 text-sm font-medium hover:bg-black/5">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input type="text" placeholder="Search users..." className="input-field py-2 pl-10 text-sm" />
          </div>
        </div>
      </div>

      <div className="flex border-b border-black">
        {['Learners', 'Teachers', 'Coders'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-black/5'}`}
          >
            Top {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {leaderboardRows.slice(0, 3).map((user) => (
          <div key={user.rank} className={`card relative text-center ${user.rank === 1 ? 'z-10 scale-105 border-2 border-black bg-black text-white' : ''}`}>
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full font-bold ${user.rank === 1 ? 'bg-white text-black' : 'bg-black text-white'}`}>
              {user.rank}
            </div>
            <h3 className="text-xl font-bold">{user.user}</h3>
            <p className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${user.rank === 1 ? 'text-white/40' : 'text-black/40'}`}>{user.skill}</p>
            <p className={`mt-1 text-sm ${user.rank === 1 ? 'text-white/60' : 'text-black/60'}`}>Score: {user.score.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-black">
        <table className="w-full text-left">
          <thead className="border-b border-black bg-black/5">
            <tr>
              <th className="w-20 px-6 py-4 text-sm font-bold uppercase">Rank</th>
              <th className="px-6 py-4 text-sm font-bold uppercase">User</th>
              <th className="px-6 py-4 text-sm font-bold uppercase">Skill Focus</th>
              <th className="px-6 py-4 text-right text-sm font-bold uppercase">Total Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {leaderboardRows.map((user) => (
              <tr key={user.rank} className={`transition-colors hover:bg-black/5 ${user.isUser ? 'bg-black/5 font-bold' : ''}`}>
                <td className="px-6 py-4 font-mono">{user.rank}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-xs font-bold">
                    {user.user.split(' ').map((name) => name[0]).join('')}
                  </div>
                  {user.user}
                  {user.isUser && <span className="ml-2 rounded bg-black px-1.5 py-0.5 text-[10px] text-white">YOU</span>}
                </td>
                <td className="px-6 py-4 text-sm text-black/40">{user.skill}</td>
                <td className="px-6 py-4 text-right font-mono">{user.score.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  const [page, setPage] = useState<Page>('dashboard');
  const { logout, userName, userInitials } = useAuth();
  const router = useRouter();
  const displayName = userName ?? 'SkillRank User';

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentPage={page} setPage={setPage} onLogout={handleLogout} />

      <div className="flex flex-1 flex-col">
        <TopNav setPage={setPage} onLogout={handleLogout} userInitials={userInitials} />

        <main className="mx-auto w-full max-w-7xl flex-1 p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {page === 'dashboard' && <DashboardPage userName={displayName} userInitials={userInitials} />}
              {page === 'challenges' && <ChallengesPage />}
              {page === 'exchange' && <ExchangePage />}
              {page === 'leaderboard' && <LeaderboardPage userName={displayName} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
