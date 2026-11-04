/**
 * Hero lighting: one cool wash behind the stage, fading to the page colour.
 *
 * The previous version layered a ramp, three blooms, a glass ribbon and a
 * wave. Together they muddied the field the owner and copy sit on. One wash
 * is enough to separate the stage from the copy column.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_78%_45%,color-mix(in_oklab,var(--primary)_12%,var(--background)),var(--background)_72%)]" />
    </div>
  );
}
