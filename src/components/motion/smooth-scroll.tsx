"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Inertial wheel scrolling for the public site (Lenis, D-020).
 *
 * Why: the depth and glass scenes read as one continuous surface when the
 * page glides instead of stepping per wheel notch. Guard rails:
 *   - off entirely under prefers-reduced-motion (native scroll, instant)
 *   - touch keeps the platform's own scrolling (syncTouch off)
 *   - in-page anchor links still work, offset for the sticky header
 *   - never mounted in /admin, where forms must scroll natively
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.12,
      syncTouch: false,
      anchors: { offset: -96 },
    });
    return () => lenis.destroy();
  }, []);
  return null;
}
