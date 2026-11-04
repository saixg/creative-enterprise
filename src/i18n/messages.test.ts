import { describe, expect, it } from "vitest";

import en from "./messages/en.json";
import gu from "./messages/gu.json";

/** Flatten to dotted key paths so a missing nested key is caught, not just a missing namespace. */
function keyPaths(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [prefix];
  }

  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) =>
    keyPaths(v, prefix ? `${prefix}.${k}` : k),
  );
}

describe("message catalogues", () => {
  const enKeys = keyPaths(en).sort();
  // `_status` is the review-pending marker on the Gujarati catalogue, not a
  // translatable string.
  const guKeys = keyPaths(gu)
    .filter((k) => k !== "_status")
    .sort();

  it("Gujarati defines every English key", () => {
    const missing = enKeys.filter((k) => !guKeys.includes(k));
    expect(missing, `missing in gu.json: ${missing.join(", ")}`).toEqual([]);
  });

  it("Gujarati defines no keys English lacks", () => {
    const extra = guKeys.filter((k) => !enKeys.includes(k));
    expect(extra, `extra in gu.json: ${extra.join(", ")}`).toEqual([]);
  });

  it("has no empty strings in either catalogue", () => {
    const empties = [
      ...keyPaths(en).map((k) => ["en", k] as const),
      ...keyPaths(gu).map((k) => ["gu", k] as const),
    ].filter(([locale, path]) => {
      const source: unknown = locale === "en" ? en : gu;
      const value = path
        .split(".")
        .reduce<unknown>(
          (acc, part) => (acc as Record<string, unknown>)?.[part],
          source,
        );
      return typeof value === "string" && value.trim() === "";
    });

    expect(empties).toEqual([]);
  });

  it("still marks the Gujarati catalogue as awaiting fluent-speaker review", () => {
    // Guard against the review marker being dropped before the review happens.
    // Remove this test in the same change that removes `_status`, once a fluent
    // speaker has signed the translations off.
    expect(gu).toHaveProperty("_status");
    expect(gu._status).toMatch(/NOT REVIEWED/);
  });
});
