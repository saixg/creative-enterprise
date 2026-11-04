import { MessageCircle, PackageOpen, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { CategorySlug, Product } from "@/types/catalog";
import { buttonClasses } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import type { CatalogueItem } from "@/components/products/catalogue-browser";

/** Server-render each product's card once and hand it to the browser. */
export function toCatalogueItems(
  products: Product[],
  locale: Locale,
): CatalogueItem[] {
  return products.map((product) => ({
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: product.priceInPaise,
    node: <ProductCard product={product} locale={locale} />,
  }));
}

/**
 * A category with no products yet (D-014).
 *
 * Says plainly that the range is not listed online, rather than hiding the
 * category or padding it with invented products. The enquiry route is the
 * point: the shop may well stock it even though nothing is listed here.
 */
export async function EmptyCategory({ category }: { category: CategorySlug }) {
  const t = await getTranslations("products");
  const name = t(`categories.${category}`);

  return (
    <div className="surface-card flex flex-col items-center gap-4 rounded-3xl px-6 py-16 text-center">
      <PackageOpen aria-hidden className="text-border-strong size-12" />
      <h2 className="text-2xl font-semibold tracking-tight">
        {t("emptyCategory.title", { category: name })}
      </h2>
      <p className="text-muted max-w-lg text-pretty">
        {t("emptyCategory.body", { category: name.toLowerCase() })}
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Link href="/contact" className={buttonClasses()}>
          <MessageCircle aria-hidden className="size-4" />
          {t("emptyCategory.enquire")}
        </Link>
        <Link
          href="/products"
          className={buttonClasses({ variant: "secondary" })}
        >
          {t("backToProducts")}
        </Link>
        <Link href="/services" className={buttonClasses({ variant: "ghost" })}>
          <Wrench aria-hidden className="size-4" />
          {t("heroSecondaryCta")}
        </Link>
      </div>
    </div>
  );
}
