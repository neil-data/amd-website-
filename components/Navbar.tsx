'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
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

  const onLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
                  className={`relative text-xs uppercase tracking-widest transition-colors ${active ? 'text-black' : 'text-black/65 hover:text-black'}`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-black"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  )}
                </Link>
              );
            })}

            {!isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="rounded-full border border-black/20 px-4 py-2 text-xs uppercase tracking-widest text-black transition-colors hover:border-black"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-black bg-black px-4 py-2 text-xs uppercase tracking-widest text-white transition-colors hover:bg-neutral-800"
                >
                  Get Started
                </Link>
              </>
            )}

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
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/25 lg:hidden"
            />

            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 h-screen w-[86vw] max-w-sm border-l border-black/10 bg-white px-6 py-20 shadow-2xl lg:hidden"
            >
              <nav className="space-y-2">
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

                {!isAuthenticated && (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="mt-4 block w-full rounded-lg border border-black/20 px-3 py-2 text-sm text-center text-black transition-colors hover:border-black"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-lg border border-black bg-black px-3 py-2 text-sm text-center text-white transition-colors hover:bg-neutral-800"
                    >
                      Get Started
                    </Link>
                  </>
                )}

                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="mt-4 w-full rounded-lg border border-black px-3 py-2 text-left text-sm text-black transition-colors hover:bg-black hover:text-white"
                  >
                    Logout
                  </button>
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
