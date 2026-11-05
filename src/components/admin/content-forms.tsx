"use client";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";

import type { OpeningHours, StoredBusiness } from "@/lib/business-info";
import type { Announcement } from "@/lib/site-content";
import { idle, type ActionState } from "@/features/admin/schemas";
import {
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
import { cn } from "@/lib/utils";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

export function BusinessForm({
  action,
  initial,
  saved,
}: {
  action: Action;
  initial: StoredBusiness;
  saved: boolean;
}) {
  const [state, formAction] = useActionState(action, idle);
  useActionToast(state);
  const errors = state.errors ?? {};
  const [hours, setHours] = useState<(OpeningHours & { key: number })[]>(() =>
    initial.hours.map((h, key) => ({ ...h, key })),
  );
  const [nextKey, setNextKey] = useState(initial.hours.length);

  return (
    <form action={formAction} className="grid gap-6" noValidate>
      <FormAlert state={state} />
      {!saved && (
        <p className="border-warm/40 bg-warm/10 text-warning rounded-xl border px-4 py-3 text-sm text-pretty">
          These are the values read off the design reference. None is confirmed,
          so the website shows them with an “awaiting confirmation” notice.
          Correct them, tick “confirmed”, and save.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Contact"
          description="Shown on the website and used for WhatsApp buttons. Leave empty to hide."
        >
          <div className="grid gap-4">
            <Field
              id="whatsapp"
              label="WhatsApp number"
              optional
              hint="Customers tap this to message you."
              error={errors.whatsapp}
            >
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                defaultValue={initial.whatsappNumberE164 ?? ""}
                className={inputClass}
                {...describedBy("whatsapp", true, errors.whatsapp)}
              />
            </Field>
            <Field
              id="phone"
              label="Phone number"
              optional
              error={errors.phone}
            >
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                placeholder="+91 98765 43210"
                defaultValue={initial.phone ?? ""}
                className={inputClass}
                {...describedBy("phone", null, errors.phone)}
              />
            </Field>
            <Field id="email" label="Email" optional error={errors.email}>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={initial.email ?? ""}
                className={inputClass}
                {...describedBy("email", null, errors.email)}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Store address">
          <div className="grid gap-4">
            <Field
              id="addressLines"
              label="Address"
              hint="One line per row."
              error={errors.addressLines}
            >
              <textarea
                id="addressLines"
                name="addressLines"
                rows={4}
                defaultValue={initial.addressLines.join("\n")}
                className={textareaClass}
                {...describedBy("addressLines", true, errors.addressLines)}
              />
            </Field>
            <Field
              id="postalCode"
              label="PIN code"
              optional
              error={errors.postalCode}
            >
              <input
                id="postalCode"
                name="postalCode"
                inputMode="numeric"
                maxLength={12}
                defaultValue={initial.postalCode}
                className={inputClass}
              />
            </Field>
            <Toggle
              name="addressVerified"
              label="Address is confirmed"
              description="Removes the “awaiting confirmation” notice from the address."
              defaultChecked={initial.addressVerified}
            />
          </div>
        </Panel>
      </div>

      <Panel
        title="Opening hours"
        description="24-hour times. Add a row per group of days."
      >
        <input
          type="hidden"
          name="hours"
          value={JSON.stringify(
            hours.map(({ days, opens, closes }) => ({ days, opens, closes })),
          )}
        />
        <div className="grid gap-3">
          {hours.map((row, index) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2"
            >
              <label className="grid gap-1 text-xs font-semibold">
                Days
                <input
                  value={row.days}
                  maxLength={40}
                  placeholder="Mon - Sat"
                  onChange={(e) =>
                    setHours((all) =>
                      all.map((h) =>
                        h.key === row.key ? { ...h, days: e.target.value } : h,
                      ),
                    )
                  }
                  className={inputClass}
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold">
                Opens
                <input
                  type="time"
                  value={row.opens}
                  onChange={(e) =>
                    setHours((all) =>
                      all.map((h) =>
                        h.key === row.key ? { ...h, opens: e.target.value } : h,
                      ),
                    )
                  }
                  className={cn(inputClass, "w-32")}
                />
              </label>
              <label className="grid gap-1 text-xs font-semibold">
                Closes
                <input
                  type="time"
                  value={row.closes}
                  onChange={(e) =>
                    setHours((all) =>
                      all.map((h) =>
                        h.key === row.key
                          ? { ...h, closes: e.target.value }
                          : h,
                      ),
                    )
                  }
                  className={cn(inputClass, "w-32")}
                />
              </label>
              <button
                type="button"
                aria-label={`Remove row ${index + 1}`}
                onClick={() =>
                  setHours((all) => all.filter((h) => h.key !== row.key))
                }
                className="text-muted hover:text-destructive hover:bg-surface-muted flex size-11 items-center justify-center rounded-xl"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
          {errors.hours && (
            <p role="alert" className="text-destructive text-xs">
              {errors.hours}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={hours.length >= 7}
              onClick={() => {
                setHours((all) => [
                  ...all,
                  { key: nextKey, days: "", opens: "10:00", closes: "19:00" },
                ]);
                setNextKey((k) => k + 1);
              }}
              className="text-primary hover:bg-primary/5 inline-flex h-10 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold disabled:opacity-40"
            >
              <Plus aria-hidden className="size-4" />
              Add row
            </button>
            <div className="min-w-72">
              <Toggle
                name="hoursVerified"
                label="Hours are confirmed"
                defaultChecked={initial.hoursVerified}
              />
            </div>
          </div>
        </div>
      </Panel>

      <div>
        <SubmitButton>Save store details</SubmitButton>
      </div>
    </form>
  );
}

export function AnnouncementForm({
  action,
  initial,
  locale,
}: {
  action: Action;
  initial: Announcement;
  locale: "en" | "gu";
}) {
  const [state, formAction] = useActionState(action, idle);
  useActionToast(state);
  const errors = state.errors ?? {};
  const id = (name: string) => `${name}-${locale}`;

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <FormAlert state={state} />
      <Toggle
        id={id("enabled")}
        name="enabled"
        label="Show the banner"
        defaultChecked={initial.enabled}
      />
      <Field
        id={id("text")}
        label="Message"
        hint="One short line, up to 160 characters."
        error={errors.text}
      >
        <input
          id={id("text")}
          name="text"
          lang={locale === "gu" ? "gu" : undefined}
          maxLength={160}
          defaultValue={initial.text}
          className={inputClass}
          {...describedBy(id("text"), true, errors.text)}
        />
      </Field>
      <Field
        id={id("href")}
        label="Link"
        optional
        hint="A page on this site, like /services."
        error={errors.href}
      >
        <input
          id={id("href")}
          name="href"
          maxLength={200}
          placeholder="/services"
          defaultValue={initial.href ?? ""}
          className={inputClass}
          {...describedBy(id("href"), true, errors.href)}
        />
      </Field>
      <div>
        <SubmitButton>
          Save {locale === "gu" ? "Gujarati" : "English"} banner
        </SubmitButton>
      </div>
    </form>
  );
}
