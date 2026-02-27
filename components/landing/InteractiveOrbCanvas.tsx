'use client';

import Image from 'next/image';

interface OrbProps {
  accent?: 'dark' | 'muted';
}

export default function InteractiveOrbCanvas({ accent = 'dark' }: OrbProps) {
  const overlayClass =
    accent === 'dark'
      ? 'bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.4),rgba(255,255,255,0.18)_42%,rgba(0,0,0,0.08)_100%)]'
      : 'bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.54),rgba(255,255,255,0.28)_42%,rgba(0,0,0,0.05)_100%)]';

  return (
    <div className="relative h-48 w-48 overflow-hidden rounded-2xl border border-black/10 bg-white md:h-56 md:w-56">
      <Image
        src="/images/Screenshot (146).png"
        alt="SkillRank dashboard snapshot"
        fill
        sizes="(max-width: 768px) 192px, 224px"
        className="object-cover object-center [filter:grayscale(1)_contrast(1.04)_brightness(1.04)]"
      />
      <div className={`pointer-events-none absolute inset-0 ${overlayClass}`} />
    </div>
  );
}
