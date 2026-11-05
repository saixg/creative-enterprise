/**
 * Hero lighting, after reference 02: a lavender-blue field lit from behind
 * the owner, two slow light blooms that drift (scenery, not chrome; static
 * under reduced motion), and the sweeping light ribbon that curves behind
 * the stage.
 *
 * Everything is transform/opacity on fixed layers, so the drift costs no
 * layout or paint of the content above it.
 */
export function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base field: cool lavender, brightest behind the stage. */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_75%_40%,#e4e9ff_0%,#eef1ff_38%,#f7f8ff_70%,var(--background)_100%)]" />

      {/* Drifting blooms. */}
      <div
        className="animate-drift absolute top-[-12%] right-[-8%] size-[48rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_65%)] blur-2xl"
        style={{ ["--drift-delay" as string]: "-4s" }}
      />
      <div
        className="animate-drift absolute bottom-[-25%] left-[30%] size-[40rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-soft)_22%,transparent),transparent_65%)] blur-2xl"
        style={{ ["--drift-delay" as string]: "-11s" }}
      />
      <div className="absolute top-[18%] left-[-10%] size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_65%)] blur-2xl" />

      {/* Light ribbon: one sweeping band of light behind the stage. */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="ribbon" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="0.7" stopColor="#c9d6ff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ribbon-edge" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#7c97ff" stopOpacity="0" />
            <stop offset="0.55" stopColor="#7c97ff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c97ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M560 860 C 820 700, 1040 760, 1500 470 L 1500 560 C 1080 820, 840 760, 600 900 Z"
          fill="url(#ribbon)"
        />
        <path
          d="M560 860 C 820 700, 1040 760, 1500 470"
          fill="none"
          stroke="url(#ribbon-edge)"
          strokeWidth="2"
        />
      </svg>

      {/* Fade into the page below. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--background))]" />
    </div>
  );
}
