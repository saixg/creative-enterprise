import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * The owner portrait — the human anchor of the hero (reference 02).
 *
 * The image is the REAL owner, cropped from
 * `design-references/reference-02-owner-hero.jpg` (docs/DECISIONS.md D-012).
 * Never substitute a generated person, and never alter identity, body or
 * clothing — doc 02 §4 and doc 03 §9.
 *
 * **Why it is framed rather than cut out:** the crop carries the reference's
 * own pale-blue background. With no transparent original available, a feathered
 * mask still reads as a rectangle with a halo. Presenting it as a deliberately
 * framed photograph is the honest interim: it looks composed rather than badly
 * cut out, and it swaps cleanly for a real cutout later — drop a transparent
 * PNG in and remove the frame classes.
 */
export function OwnerPortrait({
  alt,
  className,
}: {
  alt: string;
  className?: string;
}) {
  return (
    <div className={cn("relative mx-auto w-fit", className)}>
      {/* Contact glow beneath the frame. One of at most two glows in this
          viewport, per the design system's budget. */}
      <div
        aria-hidden
        className="bg-primary/20 absolute inset-x-6 -bottom-3 h-10 rounded-[50%] blur-2xl"
      />

      <div className="border-border/80 bg-surface shadow-raised relative overflow-hidden rounded-[2rem] border">
        <Image
          src="/images/owner-portrait.webp"
          alt={alt}
          width={310}
          height={420}
          priority
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 260px, 200px"
          className="h-auto w-[200px] sm:w-[260px] lg:w-[320px]"
        />

        {/* Settles the photo's own background into our surface at the base,
            so the frame does not end on a hard horizontal edge. */}
        <div
          aria-hidden
          className="from-background/70 absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
        />
      </div>
    </div>
  );
}
