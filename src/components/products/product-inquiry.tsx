import { getTranslations } from "next-intl/server";

import { whatsappLink } from "@/lib/business-info";
import { getBusinessInfo } from "@/lib/site-content";
import { submitInquiry } from "@/features/inquiries/actions";
import { InquiryForm } from "@/components/inquiries/inquiry-form";

/**
 * The inquiry action on a product: the conversion point of an inquiry-first
 * site (doc 01 §2.1). There is no cart and no checkout.
 *
 * The form is stored in the shared database and lands in /admin/inquiries.
 * When the owner has entered a WhatsApp number in /admin/content, a WhatsApp
 * link is offered as well; it is never pointed at an invented number.
 */
export async function ProductInquiry({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [t, form, info] = await Promise.all([
    getTranslations("products"),
    getTranslations("inquiryForm"),
    getBusinessInfo(),
  ]);

  return (
    <div className="surface-card mt-8 rounded-3xl p-6 sm:p-7">
      <h2 className="text-lg font-bold">{form("productHeading")}</h2>
      <p className="text-muted mt-1 mb-5 text-sm text-pretty">
        {form("productLead")}
      </p>
      <InquiryForm
        kind="product"
        action={submitInquiry.bind(null, productId)}
        subject={productName}
        whatsappHref={whatsappLink(
          info.whatsappNumberE164,
          t("inquiryMessage", { product: productName }),
        )}
      />
    </div>
  );
}
