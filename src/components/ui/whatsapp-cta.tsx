import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { businessInfo } from "@/lib/business-info";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * WhatsApp contact action.
 *
 * The owner has not supplied a WhatsApp number. Doc 03 §3 forbids inventing
 * contact details, so with no number configured this renders nothing at all
 * rather than a dead link or a made-up number.
 */
export async function WhatsAppCta({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  const number = businessInfo.whatsappNumberE164;
  if (!number) return null;

  const t = await getTranslations("common");

  return (
    <a
      href={`https://wa.me/${number.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonClasses({ variant: "secondary" }), className)}
    >
      <MessageCircle aria-hidden className="size-4" />
      {label ?? t("whatsapp")}
    </a>
  );
}
