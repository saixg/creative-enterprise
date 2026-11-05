import { ChevronLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { listCategoriesAndBrands } from "@/features/admin/queries";
import { PageHeader } from "@/components/admin/admin-ui";
import { emptyProduct, ProductForm } from "@/components/admin/product-form";
import { saveProduct } from "../actions";

export default async function NewProductPage({
  params,
}: PageProps<"/[locale]/admin/products/new">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { categories, brands } = await listCategoriesAndBrands();

  return (
    <div className="grid max-w-6xl gap-8">
      <PageHeader
        eyebrow={
          <Link
            href="/admin/products"
            className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm"
          >
            <ChevronLeft aria-hidden className="size-4" />
            Products
          </Link>
        }
        title="New product"
        description="Save first, then add photos. Nothing is visible on the website until you publish."
      />
      <ProductForm
        action={saveProduct.bind(null, null)}
        initial={emptyProduct}
        categories={categories}
        brands={brands}
        isNew
        publicHref={null}
      />
    </div>
  );
}
