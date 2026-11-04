import { describe, expect, it } from "vitest";

import { businessInfo, storeDetailsVerified } from "./business-info";

/**
 * These tests encode doc 03 §3: unconfirmed business facts must never be
 * presented as verified, and contact details must never be invented.
 *
 * When the owner confirms a detail, the corresponding expectation here is
 * updated in the same change — which is the point. Flipping a `verified` flag
 * should be a deliberate, reviewable edit, not something that drifts in.
 */
describe("business info", () => {
  it("does not claim unconfirmed store details are verified", () => {
    expect(businessInfo.addressLines.verified).toBe(false);
    expect(businessInfo.hours.verified).toBe(false);
    expect(storeDetailsVerified).toBe(false);
  });

  it("invents no contact details", () => {
    expect(businessInfo.whatsappNumberE164).toBeNull();
    expect(businessInfo.phone).toBeNull();
    expect(businessInfo.email).toBeNull();
  });

  it("publishes no satisfaction rating without a source", () => {
    expect(businessInfo.satisfactionRating.value).toBeNull();
    expect(businessInfo.satisfactionRating.verified).toBe(false);
  });
});
