"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { LockKeyhole } from "lucide-react";

import { signIn, type SignInState } from "@/app/[locale]/admin/actions";
import { buttonClasses } from "@/components/ui/button";

const initial: SignInState = { error: null };

const field =
  "border-border-strong bg-surface text-foreground focus-visible:outline-focus-ring h-12 w-full rounded-xl border px-4 text-base focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Admin sign-in form. Labels sit above inputs (never placeholder-as-label);
 * the error is announced to screen readers and tied to the form.
 */
export function SignInForm() {
  const t = useTranslations("admin.signIn");
  const [state, action, pending] = useActionState(signIn, initial);

  return (
    <form
      action={action}
      className="grid gap-5"
      aria-describedby={state.error ? "sign-in-error" : undefined}
    >
      <div className="grid gap-2">
        <label htmlFor="email" className="text-sm font-semibold">
          {t("email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={field}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className="text-sm font-semibold">
          {t("password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={field}
        />
      </div>

      {state.error && (
        <p
          id="sign-in-error"
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm"
        >
          {t(`errors.${state.error}`)}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={buttonClasses({ size: "lg", className: "w-full" })}
      >
        <LockKeyhole aria-hidden className="size-4" />
        {pending ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
