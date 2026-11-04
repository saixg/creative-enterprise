import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER MARK — not the approved logo.
 *
 * Doc 02 §9 and docs/DECISIONS.md D-008: the exploratory logo concepts are not
 * approved artwork, and the owner will supply the real mark. This is a neutral
 * geometric stand-in built from tokens so nothing downstream depends on final
 * artwork. Replace with the supplied SVG; do not promote this to the real logo.
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
      <svg
        viewBox="0 0 40 40"
        role="img"
        aria-label="Creative Enterprise"
        className="size-9 shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="11"
          fill="var(--primary)"
        />
        <path
          d="M27.5 14.5a9 9 0 1 0 0 11"
          fill="none"
          stroke="var(--primary-foreground)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {withWordmark && (
        <span className="leading-tight">
          <span className="block text-base font-semibold tracking-tight">
            Creative Enterprise
          </span>
          <span className="text-muted block text-[10px] font-medium tracking-[0.2em] uppercase">
            Sales · Service · Solutions
          </span>
        </span>
      )}
    </span>
  );
}
