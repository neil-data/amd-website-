export default function SiteFooter() {
  const links = [
    { label: 'Top', href: '#hero' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Challenges', href: '#challenges' },
    { label: 'Leaderboard', href: '#leaderboard' },
    { label: 'Recruiters', href: '#recruiters' },
  ];

  return (
    <footer className="border-t border-black/10 px-6 py-10 md:px-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-5 text-sm text-neutral-600 md:flex-row md:items-center">
        <p>© {new Date().getFullYear()} SkillRank AI</p>

        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="uppercase tracking-[0.14em] text-neutral-500 transition-all duration-300 hover:-translate-y-0.5 hover:text-black"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
