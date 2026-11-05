import { describe, expect, it } from "vitest";

import {
  productSchema,
  resolveStatus,
  rupeesToPaise,
  slugify,
} from "./schemas";
import {
  looksAutomated,
  MIN_FILL_MS,
  submissionSchema,
} from "../inquiries/schema";
import { mergeBusinessInfo } from "@/lib/business-info";

const baseProduct = {
  name: "HP Victus 15",
  slug: "",
  brand: "HP",
  categoryId: "3f1c2b8e-1d2a-4c5b-9e8f-7a6b5c4d3e2f",
  summaryEn: "",
  summaryGu: "",
  descriptionEn: "",
  descriptionGu: "",
  summarySpecs: "i5\n\n16GB ",
  specs: "[]",
  price: "",
  priceIsVerified: null,
  availability: "unknown",
  isNew: null,
  isFeatured: null,
  isPlaceholder: null,
  intent: "save",
};

describe("prices", () => {
  it("converts typed rupees to integer paise", () => {
    expect(rupeesToPaise.parse("65,990")).toBe(6_599_000);
    expect(rupeesToPaise.parse("₹ 1,04,990")).toBe(10_499_000);
    expect(rupeesToPaise.parse("499.50")).toBe(49_950);
  });

  it("keeps an empty price as null (price on request), never zero", () => {
    expect(rupeesToPaise.parse("")).toBeNull();
  });

  it("rejects text that is not an amount", () => {
    expect(rupeesToPaise.safeParse("about 60k").success).toBe(false);
  });

  it("refuses a 'verified' tick without a price", () => {
    const result = productSchema.safeParse({
      ...baseProduct,
      priceIsVerified: "on",
    });
    expect(result.success).toBe(false);
  });
});

describe("product input", () => {
  it("derives the web address from the name and trims highlight lines", () => {
    const parsed = productSchema.parse(baseProduct);
    expect(parsed.slug).toBe("hp-victus-15");
    expect(parsed.summarySpecs).toEqual(["i5", "16GB"]);
    expect(parsed.isPlaceholder).toBe(false);
  });

  it("rejects a malformed web address", () => {
    expect(
      productSchema.safeParse({ ...baseProduct, slug: "Bad Slug!" }).success,
    ).toBe(false);
  });

  it("slugifies accents and punctuation", () => {
    expect(slugify("  Café Laptop (2024) ")).toBe("cafe-laptop-2024");
  });
});

describe("publishing", () => {
  it("never unpublishes a live record on a plain save", () => {
    expect(resolveStatus("save", "published")).toBe("published");
    expect(resolveStatus("save", null)).toBe("draft");
    expect(resolveStatus("publish", "draft")).toBe("published");
    expect(resolveStatus("unpublish", "published")).toBe("draft");
  });
});

describe("public submissions", () => {
  const valid = {
    name: "Asha",
    phone: "98765 43210",
    email: "",
    message: "Is this laptop available?",
    locale: "en",
  };

  it("accepts a normal inquiry and normalises the phone", () => {
    const parsed = submissionSchema.parse(valid);
    expect(parsed.phone).toBe("9876543210");
    expect(parsed.email).toBeNull();
  });

  it("rejects short phone numbers and bad emails", () => {
    expect(
      submissionSchema.safeParse({ ...valid, phone: "12345" }).success,
    ).toBe(false);
    expect(
      submissionSchema.safeParse({ ...valid, email: "nope" }).success,
    ).toBe(false);
  });

  it("treats a filled honeypot or an instant submit as automated", () => {
    const now = 1_000_000;
    expect(looksAutomated("acme", now - 10_000, now)).toBe(true);
    expect(looksAutomated("", now - 100, now)).toBe(true);
    expect(looksAutomated("", Number.NaN, now)).toBe(true);
    expect(looksAutomated("", now - MIN_FILL_MS - 1, now)).toBe(false);
  });
});

describe("business details from the admin", () => {
  it("falls back to unverified defaults when nothing valid is stored", () => {
    const info = mergeBusinessInfo({ junk: true });
    expect(info.addressLines.verified).toBe(false);
    expect(info.whatsappNumberE164).toBeNull();
  });

  it("uses the owner's details and their own confirmation ticks", () => {
    const info = mergeBusinessInfo({
      addressLines: ["Shop 4", "Rajkot"],
      postalCode: "360001",
      addressVerified: true,
      hours: [{ days: "Mon - Sat", opens: "10:00", closes: "20:00" }],
      hoursVerified: false,
      whatsappNumberE164: "+919876543210",
      phone: null,
      email: null,
    });
    expect(info.addressLines).toEqual({
      value: ["Shop 4", "Rajkot"],
      verified: true,
    });
    expect(info.hours.verified).toBe(false);
    expect(info.whatsappNumberE164).toBe("+919876543210");
  });
});
