import Image from "next/image";
import { Monitor } from "lucide-react";

import type { ProductImage } from "@/types/catalog";
import { cn } from "@/lib/utils";

/**
 * A product's photo, or a labelled frame when there is none.
 *
 * Shared by the card and the detail page so both fall back identically. The
 * photo sits on a soft contact shadow, which is what stops a cut-out product
 * looking pasted onto the surface.
 */
export function ProductMedia({
  image,
  pendingLabel,
  sizes,
  priority = false,
  className,
}: {
  image: ProductImage | null;
  pendingLabel: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!image) {
    return (
      <div className={cn("flex flex-col items-center gap-2", className)}>
        <Monitor aria-hidden className="text-border-strong size-12" />
        <span className="sr-only">{pendingLabel}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain drop-shadow-[0_18px_22px_color-mix(in_oklab,var(--primary-deep)_30%,transparent)]"
      />
    </div>
  );
}

/**
 * The attribution the photo's licence requires, plus the honesty note when the
 * photo is representative rather than this exact unit.
 */
export function ProductImageCredit({
  image,
  representativeLabel,
  photoLabel,
}: {
  image: ProductImage;
  representativeLabel: string;
  photoLabel: string;
}) {
  const { credit } = image;
  return (
    <p className="text-muted text-xs leading-relaxed">
      {image.representative && (
        <span className="text-foreground font-medium">
          {representativeLabel}{" "}
        </span>
      )}
      {photoLabel}:{" "}
      <a
        href={credit.sourceUrl}
        className="hover:text-foreground underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {credit.title}
      </a>
      , {credit.author},{" "}
      <a
        href={credit.licenseUrl}
        className="hover:text-foreground underline underline-offset-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        {credit.license}
      </a>
      . {credit.changes}
    </p>
  );
}
