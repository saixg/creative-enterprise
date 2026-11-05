import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { mediaUrl } from "@/lib/media";
import { parseSpecs } from "@/lib/catalog-map";
import {
  getAdminProduct,
  listCategoriesAndBrands,
} from "@/features/admin/queries";
import { Badge, Panel, PageHeader } from "@/components/admin/admin-ui";
import { ProductForm } from "@/components/admin/product-form";
import { MediaManager } from "@/components/admin/media-manager";
import { DangerButton } from "@/components/admin/danger-button";
import {
  addProductMedia,
  deleteProduct,
  deleteProductMedia,
  saveProduct,
  setPrimaryMedia,
  updateProductMedia,
} from "../actions";

const UUID = /^[0-9a-f-]{36}$/i;

export default async function EditProductPage({
  params,
}: PageProps<"/[locale]/admin/products/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  if (!UUID.test(id)) notFound();

  const [product, { categories, brands }] = await Promise.all([
    getAdminProduct(id),
    listCategoriesAndBrands(),
  ]);
  if (!product) notFound();

  const media = [...product.media]
    .sort(
      (a, b) =>
        Number(b.is_primary) - Number(a.is_primary) ||
        a.sort_order - b.sort_order,
    )
    .map((m) => ({
      id: m.id,
      src: mediaUrl(m.storage_path),
      width: m.width,
      height: m.height,
      altEn: m.alt_en ?? "",
      altGu: m.alt_gu ?? "",
      isPrimary: m.is_primary,
      isRepresentative: m.is_representative,
      hasCredit: m.credit !== null,
    }));

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
        title={product.name}
        description={
          product.is_placeholder ? (
            <Badge tone="warning">
              Placeholder record: confirm or replace its details before relying
              on it
            </Badge>
          ) : undefined
        }
      />

      <ProductForm
        key={product.updated_at}
        action={saveProduct.bind(null, product.id)}
        initial={{
          name: product.name,
          slug: product.slug,
          brand: product.brand?.name ?? "",
          categoryId: product.category_id,
          summaryEn: product.summary_en ?? "",
          summaryGu: product.summary_gu ?? "",
          descriptionEn: product.description_en ?? "",
          descriptionGu: product.description_gu ?? "",
          summarySpecs: product.summary_specs,
          specs: parseSpecs(product.specs),
          pricePaise: product.price_paise,
          priceIsVerified: product.price_is_verified,
          availability: product.availability,
          isNew: product.is_new,
          isFeatured: product.is_featured,
          isPlaceholder: product.is_placeholder,
          status: product.status,
        }}
        categories={categories}
        brands={brands}
        isNew={false}
        publicHref={`/${locale}/products/${product.slug}`}
      />

      <Panel
        title="Photos"
        description="The main photo appears on cards and at the top of the product page."
      >
        <MediaManager
          productId={product.id}
          items={media}
          actions={{
            add: addProductMedia,
            update: updateProductMedia,
            setPrimary: setPrimaryMedia,
            remove: deleteProductMedia,
          }}
        />
      </Panel>

      <Panel
        title="Delete product"
        description="Removes the product, its photos and its page. Inquiries about it are kept, without the product link."
      >
        <DangerButton
          action={deleteProduct.bind(null, product.id)}
          title={`Delete product “${product.name}”?`}
          body="Its page and photos are removed permanently. Inquiries about it are kept, without the link."
          confirmLabel="Delete product"
        >
          Delete product
        </DangerButton>
      </Panel>
    </div>
  );
}
