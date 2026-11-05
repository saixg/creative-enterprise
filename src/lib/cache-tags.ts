/**
 * Cache tags for public reads. Admin mutations call `updateTag` with these so
 * an edit shows on the website at once (read-your-own-writes), while visitors
 * keep getting prerendered pages the rest of the time.
 */
export const CACHE_TAGS = {
  catalogue: "catalogue",
  services: "services",
  content: "site-content",
} as const;
