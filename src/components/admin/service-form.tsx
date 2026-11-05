"use client";

import { useActionState, useState } from "react";
import { Eye, Globe, Info } from "lucide-react";

import { idle, slugify, type ActionState } from "@/features/admin/schemas";
import { serviceIconKeys, type ServiceIcon } from "@/lib/services-map";
import {
  Badge,
  describedBy,
  Field,
  inputClass,
  Panel,
  textareaClass,
  Toggle,
} from "@/components/admin/admin-ui";
import {
  FormAlert,
  SubmitButton,
  useActionToast,
} from "@/components/admin/form-feedback";

export type ServiceFormValues = {
  nameEn: string;
  nameGu: string;
  slug: string;
  icon: ServiceIcon;
  summaryEn: string;
  summaryGu: string;
  problemEn: string;
  problemGu: string;
  coversEn: string[];
  coversGu: string[];
  signsEn: string[];
  signsGu: string[];
  sortOrder: number;
  imageIsPhoto: boolean;
  isConfirmed: boolean;
  status: "draft" | "published";
};

export const emptyService: ServiceFormValues = {
  nameEn: "",
  nameGu: "",
  slug: "",
  icon: "repair",
  summaryEn: "",
  summaryGu: "",
  problemEn: "",
  problemGu: "",
  coversEn: [],
  coversGu: [],
  signsEn: [],
  signsGu: [],
  sortOrder: 0,
  imageIsPhoto: false,
  isConfirmed: false,
  status: "draft",
};

const iconLabels: Record<ServiceIcon, string> = {
  repair: "Repair (wrench)",
  screen: "Screen",
  upgrades: "Upgrades (chip)",
  software: "Software",
  cctv: "CCTV camera",
  printer: "Printer",
  amc: "Maintenance (shield)",
  network: "Network",
  support: "Support (headset)",
};

/** Two columns per text: English, then Gujarati, side by side. */
function Pair({
  base,
  label,
  hint,
  values,
  errors,
  rows,
  max,
}: {
  base: string;
  label: string;
  hint?: string;
  values: { en: string; gu: string };
  errors: Record<string, string | undefined>;
  rows: number;
  max?: number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {(["En", "Gu"] as const).map((suffix) => {
        const id = `${base}${suffix}`;
        return (
          <Field
            key={id}
            id={id}
            label={`${label} (${suffix === "En" ? "English" : "Gujarati"})`}
            hint={hint}
            error={errors[id]}
            optional={suffix === "Gu"}
          >
            <textarea
              id={id}
              name={id}
              lang={suffix === "Gu" ? "gu" : undefined}
              rows={rows}
              maxLength={max}
              defaultValue={suffix === "En" ? values.en : values.gu}
              className={textareaClass}
              {...describedBy(id, hint, errors[id])}
            />
          </Field>
        );
      })}
    </div>
  );
}

/**
 * Service editor. The copy fields match what the service page renders:
 * summary, the problem it solves, what it covers, and the signs you need it.
 */
export function ServiceForm({
  action,
  initial,
  isNew,
  publicHref,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  initial: ServiceFormValues;
  isNew: boolean;
  publicHref: string | null;
}) {
  const [state, formAction] = useActionState(action, idle);
  useActionToast(state);
  const errors = state.errors ?? {};

  const [name, setName] = useState(initial.nameEn);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.slug));
  const shownSlug = slugTouched ? slug : slugify(name);

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <FormAlert state={state} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid content-start gap-6">
          <Panel title="Name">
            <div className="grid gap-5 md:grid-cols-2">
              <Field id="nameEn" label="Name (English)" error={errors.nameEn}>
                <input
                  id="nameEn"
                  name="nameEn"
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  {...describedBy("nameEn", null, errors.nameEn)}
                />
              </Field>
              <Field
                id="nameGu"
                label="Name (Gujarati)"
                optional
                error={errors.nameGu}
              >
                <input
                  id="nameGu"
                  name="nameGu"
                  lang="gu"
                  maxLength={120}
                  defaultValue={initial.nameGu}
                  className={inputClass}
                />
              </Field>
              <Field
                id="slug"
                label="Web address"
                hint={`/services/${shownSlug || "…"}`}
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
              <Field id="icon" label="Icon">
                <select
                  id="icon"
                  name="icon"
                  defaultValue={initial.icon}
                  className={inputClass}
                >
                  {serviceIconKeys.map((key) => (
                    <option key={key} value={key}>
                      {iconLabels[key]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel
            title="Page copy"
            description="Describe what the service is and who it helps. Do not state prices, turnaround times or warranties unless you are committing to them."
          >
            <div className="grid gap-6">
              <Pair
                base="summary"
                label="Summary"
                rows={3}
                max={400}
                values={{ en: initial.summaryEn, gu: initial.summaryGu }}
                errors={errors}
              />
              <Pair
                base="problem"
                label="The problem it solves"
                rows={3}
                max={600}
                values={{ en: initial.problemEn, gu: initial.problemGu }}
                errors={errors}
              />
              <Pair
                base="covers"
                label="What it covers"
                hint="One item per line."
                rows={5}
                values={{
                  en: initial.coversEn.join("\n"),
                  gu: initial.coversGu.join("\n"),
                }}
                errors={errors}
              />
              <Pair
                base="signs"
                label="Signs you need it"
                hint="One item per line."
                rows={5}
                values={{
                  en: initial.signsEn.join("\n"),
                  gu: initial.signsGu.join("\n"),
                }}
                errors={errors}
              />
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
            </div>
          </Panel>

          <Panel title="Settings">
            <div className="grid gap-3">
              <Toggle
                name="isConfirmed"
                label="Confirmed by the owner"
                description="Until ticked, the page carries a “being confirmed” label."
                defaultChecked={initial.isConfirmed}
              />
              <Toggle
                name="imageIsPhoto"
                label="Image is a photo"
                description="Photos fill the frame; cut-out renders float on it."
                defaultChecked={initial.imageIsPhoto}
              />
              <Field
                id="sortOrder"
                label="Display order"
                hint="Lower numbers come first."
              >
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={initial.sortOrder}
                  className={inputClass}
                  {...describedBy("sortOrder", true, errors.sortOrder)}
                />
              </Field>
              <p className="text-muted flex gap-2 text-xs text-pretty">
                <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                The first service in order gets the large tile on the services
                page.
              </p>
            </div>
          </Panel>
        </aside>
      </div>
    </form>
  );
}
