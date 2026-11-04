import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Brand lockup — mark, hairline divider, two-line wordmark, tagline.
 *
 * INTERIM MARK. The "C" is cut out of the supplied logo exploration
 * (`design-references/reference-03-brand-logo.jpg`, docs/DECISIONS.md D-013).
 * It is a raster cut from an exploration, which doc 02 §9 says must not become
 * the final logo: the approved mark still needs to be supplied and rebuilt as a
 * clean SVG. The wordmark is live text, so it stays crisp regardless.
 */
export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <Image
        src="/images/brand/logo-mark.png"
        alt=""
        width={299}
        height={241}
        priority
        className="h-11 w-auto shrink-0 lg:h-14"
      />

      {withWordmark && (
        <>
          <span
            aria-hidden
            className="bg-border-strong hidden h-10 w-px sm:block"
          />
          <span className="leading-none">
            <span className="text-foreground block text-[1.15rem] font-extrabold tracking-tight lg:text-[1.45rem]">
              Creative
            </span>
            <span className="text-foreground block text-[1.15rem] font-extrabold tracking-tight lg:text-[1.45rem]">
              Enterprise
            </span>
            <span className="text-muted mt-1.5 hidden text-[0.6rem] font-semibold tracking-[0.28em] uppercase sm:block">
              Sales · Service · Solutions
            </span>
          </span>
        </>
      )}
    </span>
  );
}
