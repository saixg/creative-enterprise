import { MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonClasses } from "@/components/ui/button";
import { businessInfo } from "@/lib/business-info";

/**
 * The inquiry action on a product — the conversion point of an inquiry-first
 * site (doc 01 §2.1). There is no cart and no checkout.
 *
 * Two honest states:
 *   - a WhatsApp number is configured → a real deep link with a prefilled
 *     message naming the product
 *   - no number configured (today) → the action is disabled and says why,
 *     rather than linking to an invented number or pretending to submit a form
 *     that has no backend (doc 03 §3, §8)
 *
 * The stored inquiry form arrives with the backend milestone and replaces the
 * disabled state; the WhatsApp branch stays.
 */
export async function ProductInquiry({ productName }: { productName: string }) {
  const t = await getTranslations("products");
  const number = businessInfo.whatsappNumberE164;

  if (!number) {
    return (
      <div className="mt-8">
        <button
          type="button"
          disabled
          className={buttonClasses({ size: "lg" })}
          aria-describedby="inquiry-unavailable"
        >
          <MessageCircle aria-hidden className="size-4" />
          {t("requestQuote")}
        </button>
        <p id="inquiry-unavailable" className="text-warm mt-3 text-sm">
          {t("inquiryUnavailable")}
        </p>
      </div>
    );
  }

  const message = t("inquiryMessage", { product: productName });

  return (
    <div className="mt-8">
      <a
        href={`https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClasses({ size: "lg" })}
      >
        <MessageCircle aria-hidden className="size-4" />
        {t("requestQuote")}
      </a>
      <p className="text-muted mt-3 text-sm">{t("inquiryLead")}</p>
    </div>
  );
}
