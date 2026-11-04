/**
 * The hero's lighting — reference 02's lavender-blue field.
 *
 * Three layers, back to front:
 *   1. a horizontal ramp: clean white where the copy sits, cooling to lavender
 *      and periwinkle behind the owner
 *   2. soft blooms that give the panels something to glow against
 *   3. the sweeping glass ribbon that arcs behind the owner, and the deep blue
 *      wave in the lower-left corner
 *
 * All colour comes from tokens via `color-mix`, so the field is the same
 * palette as everything else rather than a separately-invented gradient.
 * Purely decorative, so the whole thing is hidden from assistive technology.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* 1. base ramp */}
      <div className="absolute inset-0 bg-[linear-gradient(102deg,var(--background)_0%,var(--background)_30%,color-mix(in_oklab,var(--accent-soft)_9%,var(--background))_56%,color-mix(in_oklab,var(--primary)_13%,var(--background))_100%)]" />

      {/* 2. blooms */}
      <div className="absolute inset-0 bg-[radial-gradient(48%_58%_at_74%_30%,color-mix(in_oklab,var(--accent-soft)_24%,transparent),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(36%_42%_at_96%_64%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(30%_36%_at_8%_8%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_70%)]" />

      {/* 3a. glass ribbon behind the owner */}
      <svg
        viewBox="0 0 1000 700"
        preserveAspectRatio="none"
        className="absolute top-[6%] right-0 h-[86%] w-[62%] opacity-90"
      >
        <defs>
          <linearGradient id="hero-ribbon" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
            <stop
              offset="0.35"
              stopColor="var(--accent-soft)"
              stopOpacity="0.22"
            />
            <stop offset="0.7" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hero-ribbon-edge" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="var(--surface)" stopOpacity="0" />
            <stop offset="0.45" stopColor="var(--surface)" stopOpacity="0.95" />
            <stop offset="1" stopColor="var(--surface)" stopOpacity="0" />
          </linearGradient>
          <filter
            id="hero-ribbon-blur"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* broad translucent band */}
        <path
          d="M40 640 C 220 470, 420 560, 600 400 S 880 120, 1000 60 L 1000 190 C 860 250, 760 470, 580 560 S 240 690, 40 690 Z"
          fill="url(#hero-ribbon)"
          filter="url(#hero-ribbon-blur)"
        />
        {/* bright leading edge — the light catching the glass */}
        <path
          d="M40 640 C 220 470, 420 560, 600 400 S 880 120, 1000 60"
          fill="none"
          stroke="url(#hero-ribbon-edge)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M20 600 C 230 430, 450 520, 640 350 S 900 90, 1000 20"
          fill="none"
          stroke="url(#hero-ribbon-edge)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* 3b. deep wave, lower left */}
      <svg
        viewBox="0 0 600 260"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-[22%] w-[42%]"
      >
        <defs>
          <linearGradient id="hero-wave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0.55" />
            <stop
              offset="0.6"
              stopColor="var(--accent-soft)"
              stopOpacity="0.18"
            />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 120 C 120 70, 260 190, 420 170 S 560 210, 600 260 L 0 260 Z"
          fill="url(#hero-wave)"
        />
        <path
          d="M0 150 C 140 100, 280 210, 440 196 S 570 230, 600 260"
          fill="none"
          stroke="var(--surface)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
