/** Catalogue types. These mirror docs/ARCHITECTURE.md §4.1. */

export type CategorySlug =
  "laptops" | "desktops" | "components" | "accessories";

export type Availability = "in_stock" | "on_order" | "unavailable" | "unknown";

export type Spec = {
  label: string;
  value: string;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Short spec line shown on the card, e.g. "Ryzen 7 · 16GB · 512GB SSD". */
  summarySpecs: string[];
  specs: Spec[];
  /**
   * Integer PAISE, never a float — floating point money accumulates rounding
   * error. `null` means no price has been supplied, and the UI must then say
   * "price on request" rather than guess.
   */
  priceInPaise: number | null;
  /** False until the owner confirms this exact price is current. */
  priceIsVerified: boolean;
  availability: Availability;
  isNew: boolean;
  /**
   * True for any record not supplied by the owner. Placeholder rows must be
   * visibly marked in the UI and must never be presented as real catalogue
   * data (docs/DECISIONS.md D-003, doc 03 §3).
   */
  isPlaceholder: boolean;
};
