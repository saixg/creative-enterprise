/**
 * Where an image lives.
 *
 * `storage_path` / `image_path` columns hold one of two things:
 *   - a path under /public, starting with "/" (the seeded reference and
 *     Commons images that ship with the site), or
 *   - an object key in the public `media` Storage bucket (admin uploads).
 *
 * The bucket is public for downloads only; uploads are admin-only by policy
 * (supabase/migrations/20261105090000_catalogue_admin.sql).
 */
export const MEDIA_BUCKET = "media";

export function mediaUrl(path: string): string {
  if (path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

/** True for an object key in the bucket (as opposed to a bundled asset). */
export function isStoredMedia(path: string): boolean {
  return !path.startsWith("/");
}
