'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const publicItems: NavItem[] = [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Challenges', href: '/#challenges' },
    { label: 'Leaderboard', href: '/#leaderboard' },
    { label: 'Recruiters', href: '/#recruiters' },
    { label: 'Login', href: '/login' },
    { label: 'Get Started', href: '/signup' },
  ];

  const authedItems: NavItem[] = [
    { label: 'Dashboard', href: role === 'recruiter' ? '/recruiter-dashboard' : '/dashboard' },
    { label: 'Challenges', href: '/challenges' },
    { label: 'Exchange', href: '/exchange' },
    { label: 'Leaderboard', href: '/leaderboard' },
    ...(role === 'recruiter' ? [{ label: 'Recruiters', href: '/recruiter-dashboard' }] : []),
    { label: 'Profile', href: '/profile' },
  ];

  const items = isAuthenticated ? authedItems : publicItems;

  const onLogout = () => {
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 w-full border-b border-black/10 bg-white/90 px-6 py-4 backdrop-blur md:px-12"
    >
      <div className="mx-auto max-w-[1920px]">
        <div className="flex items-center justify-between">
          <Link href="/" className="transition-transform duration-300 hover:scale-[1.01]" onClick={() => setMenuOpen(false)}>
            <BrandLogo width={180} height={40} className="h-8 w-auto md:h-9" />
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-xs uppercase tracking-widest transition-colors ${active ? 'text-black' : 'text-black/65 hover:text-black'}`}
                >
                  {item.label}
                </Link>
              );
            })}

            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-black px-4 py-2 text-xs uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
              >
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`h-[1.5px] w-5 bg-black transition-transform ${menuOpen ? 'translate-y-[4px] rotate-45' : ''}`} />
            <span className={`h-[1.5px] w-5 bg-black transition-opacity ${menuOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`h-[1.5px] w-5 bg-black transition-transform ${menuOpen ? '-translate-y-[4px] -rotate-45' : ''}`} />
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: menuOpen ? 'auto' : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden lg:hidden"
        >
          <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-black/80 transition-colors hover:bg-black/5 hover:text-black"
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full rounded-lg border border-black px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black hover:text-white"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
