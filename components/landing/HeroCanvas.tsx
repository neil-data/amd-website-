'use client';

export default function HeroCanvas() {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-xl border border-black/15 bg-white md:h-[460px]">
      <iframe
        src="https://my.spline.design/techinspired3dassetsairobo-6YLLIwGwru4FXJ3IusiRC84m/"
        title="AI 3D Asset"
        className="h-full w-full [filter:grayscale(1)_saturate(0)_contrast(1.08)_brightness(1.22)]"
        frameBorder="0"
        loading="lazy"
        allow="autoplay; fullscreen"
      >
      </iframe>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.52),rgba(255,255,255,0.26)_42%,rgba(0,0,0,0.05)_100%)]" />
    </div>
  );
}
