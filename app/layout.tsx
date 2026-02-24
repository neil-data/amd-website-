import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';
import AuthProviderClient from '@/components/providers/AuthProviderClient';
import PageTransitionProvider from '@/components/providers/PageTransitionProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

export const metadata: Metadata = {
  title: 'SkillRank AI',
  description: 'Performance-Verified. Integrity-Protected.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={clsx(inter.variable, spaceGrotesk.variable)}>
      <body className="antialiased bg-white text-black selection:bg-black selection:text-white">
        <AuthProviderClient>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </AuthProviderClient>
      </body>
    </html>
  );
}
