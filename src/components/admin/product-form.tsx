"use client";

import { useActionState, useState } from "react";
import { Eye, Globe, Info } from "lucide-react";

import type { Spec } from "@/types/catalog";
import { idle, slugify, type ActionState } from "@/features/admin/schemas";
import {
  Badge,
  describedBy,
  Field,
  inputClass,
  Panel,
  textareaClass,
  Toggle,
} from "@/components/admin/admin-ui";
import { SpecRows } from "@/components/admin/spec-rows";
import {
  FormAlert,
  SubmitButton,
  useActionToast,
} from "@/components/admin/form-feedback";

export type ProductFormValues = {
  name: string;
  slug: string;
  brand: string;
  categoryId: string;
  summaryEn: string;
  summaryGu: string;
  descriptionEn: string;
  descriptionGu: string;
  summarySpecs: string[];
  specs: Spec[];
  /** Integer paise or null. */
  pricePaise: number | null;
  priceIsVerified: boolean;
  availability: "in_stock" | "on_order" | "unavailable" | "unknown";
  isNew: boolean;
  isFeatured: boolean;
  isPlaceholder: boolean;
  status: "draft" | "published";
};

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  brand: "",
  categoryId: "",
  summaryEn: "",
  summaryGu: "",
  descriptionEn: "",
  descriptionGu: "",
  summarySpecs: [],
  specs: [],
  pricePaise: null,
  priceIsVerified: false,
  availability: "unknown",
  isNew: false,
  isFeatured: false,
  isPlaceholder: false,
  status: "draft",
};

const availabilityOptions = [
  ["unknown", "Not stated (ask the store)"],
  ["in_stock", "In stock"],
  ["on_order", "Available to order"],
  ["unavailable", "Unavailable"],
] as const;

const rupees = (paise: number | null) =>
  paise === null ? "" : String(paise / 100);

/**
 * Product editor. One form, three outcomes chosen by the button pressed:
 * Save (keeps the current status), Publish, Unpublish. Every field that
 * could carry an unverified claim (price, availability, placeholder) is
 * explicit and defaults to the cautious value (doc 03 §3).
 */
export function ProductForm({
  action,
  initial,
  categories,
  brands,
  isNew,
  publicHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial: ProductFormValues;
  categories: { id: string; name: string }[];
  brands: string[];
  isNew: boolean;
  publicHref: string | null;
}) {
  const [state, formAction] = useActionState(action, idle);
  useActionToast(state);
  const errors = state.errors ?? {};

  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const shownSlug = slugTouched ? slug : slugify(name);

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <FormAlert state={state} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid content-start gap-6">
          <Panel title="Basics">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="name"
                label="Product name"
                error={errors.name}
                className="sm:col-span-2"
              >
                <input
                  id="name"
                  name="name"
                  required
                  maxLength={160}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  {...describedBy("name", null, errors.name)}
                />
              </Field>
              <Field
                id="slug"
                label="Web address"
                hint={`/products/${shownSlug || "…"}`}
                error={errors.slug}
              >
                <input
                  id="slug"
                  name="slug"
                  maxLength={80}
                  value={shownSlug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  className={inputClass}
                  {...describedBy("slug", true, errors.slug)}
                />
              </Field>
              <Field id="brand" label="Brand" optional error={errors.brand}>
                <input
                  id="brand"
                  name="brand"
                  list="brand-options"
                  maxLength={60}
                  defaultValue={initial.brand}
                  className={inputClass}
                  {...describedBy("brand", null, errors.brand)}
                />
                <datalist id="brand-options">
                  {brands.map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </Field>
              <Field
                id="categoryId"
                label="Category"
                error={errors.categoryId}
                className="sm:col-span-2"
              >
                <select
                  id="categoryId"
                  name="categoryId"
                  defaultValue={initial.categoryId}
                  className={inputClass}
                  {...describedBy("categoryId", null, errors.categoryId)}
                >
                  <option value="" disabled>
                    Choose a category
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel
            title="Description"
            description="Shown on the product page. Gujarati is optional; English shows when it is empty."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                id="summaryEn"
                label="Short summary (English)"
                optional
                error={errors.summaryEn}
              >
                <textarea
                  id="summaryEn"
                  name="summaryEn"
                  rows={3}
                  maxLength={300}
                  defaultValue={initial.summaryEn}
                  className={textareaClass}
                />
              </Field>
              <Field
                id="summaryGu"
                label="Short summary (Gujarati)"
                optional
                error={errors.summaryGu}
              >
                <textarea
                  id="summaryGu"
                  name="summaryGu"
                  lang="gu"
                  rows={3}
                  maxLength={300}
                  defaultValue={initial.summaryGu}
                  className={textareaClass}
                />
              </Field>
              <Field
                id="descriptionEn"
                label="Full description (English)"
                optional
                error={errors.descriptionEn}
              >
                <textarea
                  id="descriptionEn"
                  name="descriptionEn"
                  rows={6}
                  maxLength={4000}
                  defaultValue={initial.descriptionEn}
                  className={textareaClass}
                />
              </Field>
              <Field
                id="descriptionGu"
                label="Full description (Gujarati)"
                optional
                error={errors.descriptionGu}
              >
                <textarea
                  id="descriptionGu"
                  name="descriptionGu"
                  lang="gu"
                  rows={6}
                  maxLength={4000}
                  defaultValue={initial.descriptionGu}
                  className={textareaClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Specifications"
            description="Only enter specifications you have checked against the actual unit."
          >
            <div className="grid gap-6">
              <Field
                id="summarySpecs"
                label="Card highlights"
                hint="One per line, up to 6. Shown on product cards, e.g. Ryzen 7 · 16GB · 512GB SSD."
                error={errors.summarySpecs}
              >
                <textarea
                  id="summarySpecs"
                  name="summarySpecs"
                  rows={4}
                  defaultValue={initial.summarySpecs.join("\n")}
                  className={textareaClass}
                  {...describedBy("summarySpecs", true, errors.summarySpecs)}
                />
              </Field>
              <div className="grid gap-2">
                <p className="text-sm font-semibold">Specification table</p>
                <SpecRows
                  name="specs"
                  initial={initial.specs}
                  error={errors.specs}
                />
              </div>
            </div>
          </Panel>
        </div>

        <aside className="grid content-start gap-6 xl:sticky xl:top-6 xl:self-start">
          <Panel title="Publishing">
            <div className="grid gap-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted text-sm">Status</span>
                {initial.status === "published" ? (
                  <Badge tone="success">
                    <Globe aria-hidden className="size-3" />
                    Live on website
                  </Badge>
                ) : (
                  <Badge>Draft</Badge>
                )}
              </div>
              {publicHref && initial.status === "published" && (
                <a
                  href={publicHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
                >
                  <Eye aria-hidden className="size-4" />
                  View on website
                </a>
              )}
              <div className="grid gap-2">
                {initial.status === "published" ? (
                  <>
                    <SubmitButton intent="save">Save changes</SubmitButton>
                    <SubmitButton intent="unpublish" variant="secondary">
                      Unpublish
                    </SubmitButton>
                  </>
                ) : (
                  <>
                    <SubmitButton intent="publish">
                      {isNew ? "Create and publish" : "Publish"}
                    </SubmitButton>
                    <SubmitButton intent="save" variant="secondary">
                      {isNew ? "Save as draft" : "Save draft"}
                    </SubmitButton>
                  </>
                )}
              </div>
              <p className="text-muted flex gap-2 text-xs text-pretty">
                <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                Publishing only updates the website. WhatsApp promotion is a
                separate step that arrives with the campaigns milestone.
              </p>
            </div>
          </Panel>

          <Panel title="Price & availability">
            <div className="grid gap-4">
              <Field
                id="price"
                label="Price (₹)"
                optional
                hint="Leave empty to show “Price on request”."
                error={errors.price}
              >
                <input
                  id="price"
                  name="price"
                  inputMode="decimal"
                  placeholder="65990"
                  defaultValue={rupees(initial.pricePaise)}
                  className={inputClass}
                  {...describedBy("price", true, errors.price)}
                />
              </Field>
              <Toggle
                name="priceIsVerified"
                label="Price is confirmed and current"
                description="Unticked prices show a “not verified” note to customers."
                defaultChecked={initial.priceIsVerified}
              />
              <Field id="availability" label="Availability">
                <select
                  id="availability"
                  name="availability"
                  defaultValue={initial.availability}
                  className={inputClass}
                >
                  {availabilityOptions.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Labels">
            <div className="grid gap-2.5">
              <Toggle
                name="isNew"
                label="New arrival"
                description="Shows in New Arrivals with a “New” tag."
                defaultChecked={initial.isNew}
              />
              <Toggle
                name="isFeatured"
                label="Featured"
                description="Listed first in the catalogue."
                defaultChecked={initial.isFeatured}
              />
              <Toggle
                name="isPlaceholder"
                label="Placeholder data"
                description="Untick once you have confirmed this is a real product you sell."
                defaultChecked={initial.isPlaceholder}
              />
            </div>
          </Panel>
        </aside>
      </div>
    </form>
  );
}
