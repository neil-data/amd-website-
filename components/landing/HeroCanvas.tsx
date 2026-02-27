'use client';

import Image from 'next/image';

export default function HeroCanvas() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-black/15 bg-white md:h-[460px]">
      <Image
        src="/images/Screenshot (146).png"
        alt="SkillRank recruiter dashboard preview"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-top [filter:grayscale(1)_contrast(1.02)_brightness(1.02)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.52),rgba(255,255,255,0.26)_42%,rgba(0,0,0,0.05)_100%)]" />
    </div>
  );
}
