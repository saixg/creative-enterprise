"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Loads the WebGL scene only in the browser, only when it can run well.
 *
 *   - three.js is code-split and lazy: it never blocks the hero's text (LCP)
 *   - no WebGL, or prefers-reduced-motion: a still CSS light core instead
 *   - off-screen or hidden tab: the render loop stops
 *   - small screens and low-core devices get the "lite" scene
 */
const ChipScene = dynamic(() => import("./chip-scene"), {
  ssr: false,
  loading: () => null,
});

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroScene({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"pending" | "3d" | "still">("pending");
  const [lite, setLite] = useState(false);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Decided once on mount from the device; not render state that changes.
    /* eslint-disable react-hooks/set-state-in-effect */
    setLite(
      window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4,
    );
    setMode(!reduce && canUseWebGL() ? "3d" : "still");
    /* eslint-enable react-hooks/set-state-in-effect */

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(Boolean(entry?.isIntersecting)),
      { rootMargin: "100px" },
    );
    io.observe(el);
    const onVisibility = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "relative [mask-image:radial-gradient(120%_95%_at_62%_45%,black_55%,transparent_88%)]",
        className,
      )}
    >
      {/* The still orb is always underneath: it is the fallback, and the
          first paint while three.js loads, so the scene fades in over it. */}
      <div
        className={cn(
          "absolute inset-0 flex items-end justify-center pb-[8%] transition-opacity duration-300 lg:items-center lg:justify-end lg:pr-[10%] lg:pb-0",
          mode === "3d" && "opacity-0",
        )}
      >
        <div className="relative aspect-square w-[min(70%,26rem)] lg:w-[34%]">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#ffffff,#cfe0ff_40%,color-mix(in_oklab,var(--primary)_55%,#9fc4ff)_75%,transparent_76%)] opacity-80 blur-[2px]" />
          <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_60%_65%,color-mix(in_oklab,var(--accent)_45%,transparent),transparent_70%)] blur-2xl" />
        </div>
      </div>
      {mode === "3d" && (
        <div className="absolute inset-0 animate-[fade-in_900ms_var(--ease-out)_both]">
          <ChipScene active={active} lite={lite} />
        </div>
      )}
    </div>
  );
}
