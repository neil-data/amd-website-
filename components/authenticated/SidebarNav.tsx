'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserRole } from '@/context/AuthContext';

export interface SidebarItem {
  label: string;
  href: string;
}

interface SidebarNavProps {
  role: UserRole | null;
  onNavigate?: () => void;
}

export function getSidebarItems(role: UserRole | null): SidebarItem[] {
  return [
    { label: 'Dashboard', href: role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'Exchange', href: '/exchange' },
    { label: 'Leaderboard', href: '/leaderboard' },
    ...(role === 'recruiter' ? [{ label: 'Recruiters', href: '/recruiter-dashboard' }] : []),
    { label: 'Profile', href: '/profile' },
  ];
}

export default function SidebarNav({ role, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const items = getSidebarItems(role);

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const active = pathname === item.href;

        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            prefetch={false}
            onClick={onNavigate}
            className={`relative block rounded-lg px-3 py-2 text-sm transition-colors ${
              active ? 'bg-black text-white' : 'text-black/70 hover:bg-black/5 hover:text-black'
            }`}
          >
            {item.label}
            {active && (
              <motion.span
                layoutId="sidebar-active-indicator"
                className="absolute inset-0 rounded-lg border border-black"
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
