"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Lock, Send } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import type { SubmissionState } from "@/features/inquiries/schema";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initial: SubmissionState = { status: "idle" };

const field =
  "w-full rounded-xl border border-border-strong bg-surface px-4 text-base text-foreground placeholder:text-muted/70 " +
  "transition-[border-color,box-shadow] focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 " +
  "aria-[invalid=true]:border-destructive";

/**
 * The inquiry-first conversion point: a short form stored in the shared
 * database and shown to the admin in /admin/inquiries or /admin/requests.
 * No account, no cart (doc 01 §2.1, D-006).
 *
 * Collecting a phone number here is NOT marketing consent (doc 01 §5.2); the
 * form says so in plain words.
 */
type Props = {
  kind: "product" | "service";
  action: (
    state: SubmissionState,
    formData: FormData,
  ) => Promise<SubmissionState>;
  /** The product or service name, shown as context. */
  subject: string;
  whatsappHref?: string | null;
};

export function InquiryForm(props: Props) {
  // Remounting the inner form is the reset: fresh action state, fresh timer.
  const [instance, setInstance] = useState(0);
  return (
    <InquiryFormInner
      key={instance}
      {...props}
      onReset={() => setInstance((i) => i + 1)}
    />
  );
}

function InquiryFormInner({
  kind,
  action,
  subject,
  whatsappHref,
  onReset,
}: Props & { onReset: () => void }) {
  const t = useTranslations("inquiryForm");
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [state, formAction, pending] = useActionState(action, initial);
  const startedAt = useRef<HTMLInputElement>(null);
  const success = useRef<HTMLDivElement>(null);

  // Stamp when the form appeared, for the bot timing check. Written to the
  // DOM directly: it is not render state.
  useEffect(() => {
    if (startedAt.current) startedAt.current.value = String(Date.now());
  }, []);
  useEffect(() => {
    if (state.status === "success") success.current?.focus();
  }, [state]);

  const errors = state.errors ?? {};
  const id = (name: string) => `${kind}-${name}`;
  const invalid = (name: keyof typeof errors) =>
    errors[name]
      ? { "aria-invalid": true, "aria-describedby": id(`${name}-error`) }
      : {};

  const isMessage = kind === "product";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <motion.div
          key="done"
          ref={success}
          tabIndex={-1}
          role="status"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-start gap-3 rounded-2xl outline-none"
        >
          <span className="bg-success/15 text-success flex size-11 items-center justify-center rounded-full">
            <CheckCircle2 aria-hidden className="size-6" />
          </span>
          <h3 className="text-lg font-bold">{t("successTitle")}</h3>
          <p className="text-muted text-sm text-pretty">{t("successBody")}</p>
          <button
            type="button"
            onClick={onReset}
            className="text-primary text-sm font-semibold hover:underline"
          >
            {t("sendAnother")}
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={formAction}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-4"
          noValidate
        >
          <input type="hidden" name="locale" value={locale} />
          <input
            ref={startedAt}
            type="hidden"
            name="startedAt"
            defaultValue=""
          />
          {/* Honeypot: invisible to people, tempting to bots. */}
          <div
            aria-hidden
            className="absolute -left-[9999px] h-px w-px overflow-hidden"
          >
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <p className="text-muted text-sm">
            <span className="text-foreground font-semibold">{subject}</span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor={id("name")} className="text-sm font-semibold">
                {t("name")}
              </label>
              <input
                id={id("name")}
                name="name"
                autoComplete="name"
                maxLength={120}
                required
                className={cn(field, "h-12")}
                {...invalid("name")}
              />
              {errors.name && (
                <p id={id("name-error")} className="text-destructive text-xs">
                  {t(`errors.${errors.name}`)}
                </p>
              )}
            </div>
            <div className="grid gap-1.5">
              <label htmlFor={id("phone")} className="text-sm font-semibold">
                {t("phone")}
              </label>
              <input
                id={id("phone")}
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={20}
                required
                placeholder="+91"
                className={cn(field, "h-12")}
                {...invalid("phone")}
              />
              {errors.phone ? (
                <p id={id("phone-error")} className="text-destructive text-xs">
                  {t(`errors.${errors.phone}`)}
                </p>
              ) : (
                <p className="text-muted text-xs">{t("phoneHint")}</p>
              )}
            </div>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor={id("email")} className="text-sm font-semibold">
              {t("email")}{" "}
              <span className="text-muted font-normal">({t("optional")})</span>
            </label>
            <input
              id={id("email")}
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              className={cn(field, "h-12")}
              {...invalid("email")}
            />
            {errors.email && (
              <p id={id("email-error")} className="text-destructive text-xs">
                {t(`errors.${errors.email}`)}
              </p>
            )}
          </div>

          <div className="grid gap-1.5">
            <label htmlFor={id("message")} className="text-sm font-semibold">
              {isMessage ? t("message") : t("description")}
            </label>
            <textarea
              id={id("message")}
              name="message"
              rows={4}
              maxLength={2000}
              required
              placeholder={
                isMessage
                  ? t("messagePlaceholder")
                  : t("descriptionPlaceholder")
              }
              className={cn(field, "min-h-28 py-3 leading-relaxed")}
              {...invalid("message")}
            />
            {errors.message && (
              <p id={id("message-error")} className="text-destructive text-xs">
                {t(`errors.${errors.message}`)}
              </p>
            )}
          </div>

          {state.formError && (
            <p
              role="alert"
              className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm"
            >
              {t(`errors.${state.formError}`)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={pending}
              className={buttonClasses({ size: "lg" })}
            >
              {pending ? (
                <Loader2 aria-hidden className="size-4 animate-spin" />
              ) : (
                <Send aria-hidden className="size-4" />
              )}
              {pending ? t("sending") : t("submit")}
            </button>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-semibold hover:underline"
              >
                {t("whatsappAlt")}
              </a>
            )}
          </div>

          <p className="text-muted flex gap-2 text-xs text-pretty">
            <Lock aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            {t("privacy")}
          </p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
