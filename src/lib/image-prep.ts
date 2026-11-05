/**
 * Browser-side image preparation before upload: downscale to a sensible web
 * size and re-encode as WebP. A 6 MB phone photo becomes ~200 KB, which keeps
 * the bucket small and product pages fast (doc 02 §16).
 */
export const MAX_EDGE = 1600;
export const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export type PreparedImage = {
  blob: Blob;
  width: number;
  height: number;
};

export function fitWithin(
  width: number,
  height: number,
  max = MAX_EDGE,
): { width: number; height: number } {
  const scale = Math.min(1, max / Math.max(width, height));
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP or AVIF image.");
  }
  const bitmap = await createImageBitmap(file);
  const size = fitWithin(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process images.");
  context.drawImage(bitmap, 0, 0, size.width, size.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  if (!blob) throw new Error("The image could not be converted.");
  if (blob.size > 5 * 1024 * 1024) {
    throw new Error("The image is still over 5 MB after resizing.");
  }
  return { blob, ...size };
}
