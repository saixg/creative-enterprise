"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createBrowserSupabase } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/media";
import { ACCEPTED, prepareImage } from "@/lib/image-prep";
import type { ActionState } from "@/features/admin/schemas";
import { Badge, inputClass } from "@/components/admin/admin-ui";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { cn } from "@/lib/utils";

export type MediaItem = {
  id: string;
  src: string;
  width: number | null;
  height: number | null;
  altEn: string;
  altGu: string;
  isPrimary: boolean;
  isRepresentative: boolean;
  hasCredit: boolean;
};

type Actions = {
  add: (
    productId: string,
    file: { path: string; width: number; height: number; alt: string },
  ) => Promise<ActionState>;
  update: (
    mediaId: string,
    values: { altEn: string; altGu: string; isRepresentative: boolean },
  ) => Promise<ActionState>;
  setPrimary: (productId: string, mediaId: string) => Promise<ActionState>;
  remove: (mediaId: string) => Promise<ActionState>;
};

function report(result: ActionState) {
  if (result.status === "success" && result.message)
    toast.success(result.message);
  if (result.status === "error" && result.message) toast.error(result.message);
  return result.status === "success";
}

/**
 * Product photos: upload (resized to WebP in the browser), choose the main
 * photo, write alt text in both languages, flag representative photos, and
 * remove. Uploads go straight to the `media` bucket under the admin's own
 * session; the bucket policy rejects anyone who is not an admin.
 */
export function MediaManager({
  productId,
  items,
  actions,
}: {
  productId: string;
  items: MediaItem[];
  actions: Actions;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [pending, startTransition] = useTransition();
  const [dragging, setDragging] = useState(false);
  const [removing, setRemoving] = useState<MediaItem | null>(null);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files).slice(0, 8);
    if (!list.length) return;
    setUploading((n) => n + list.length);
    const supabase = createBrowserSupabase();
    for (const file of list) {
      try {
        const prepared = await prepareImage(file);
        const path = `products/${productId}/${crypto.randomUUID()}.webp`;
        const { error } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, prepared.blob, {
            contentType: "image/webp",
            cacheControl: "31536000",
          });
        if (error) throw new Error(error.message);
        report(
          await actions.add(productId, {
            path,
            width: prepared.width,
            height: prepared.height,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          }),
        );
      } catch (error) {
        toast.error(
          `${file.name}: ${error instanceof Error ? error.message : "upload failed"}`,
        );
      } finally {
        setUploading((n) => n - 1);
      }
    }
    router.refresh();
  }

  const run = (fn: () => Promise<ActionState>) =>
    startTransition(async () => {
      if (report(await fn())) router.refresh();
    });

  return (
    <div className="grid gap-4">
      <button
        type="button"
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={cn(
          "border-border-strong hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragging && "border-primary bg-primary/5",
        )}
      >
        {uploading ? (
          <Loader2 aria-hidden className="text-primary size-7 animate-spin" />
        ) : (
          <ImagePlus aria-hidden className="text-primary size-7" />
        )}
        <span className="text-sm font-semibold">
          {uploading
            ? `Uploading ${uploading} photo${uploading > 1 ? "s" : ""}…`
            : "Drop photos here, or choose files"}
        </span>
        <span className="text-muted text-xs">
          JPEG, PNG, WebP or AVIF. Resized to 1600px and converted to WebP.
        </span>
      </button>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          if (e.target.files) void upload(e.target.files);
          e.target.value = "";
        }}
      />

      {items.length === 0 ? (
        <p className="text-muted text-sm">
          No photos yet. The website shows a labelled frame until one is added.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              busy={pending}
              onPrimary={() =>
                run(() => actions.setPrimary(productId, item.id))
              }
              onRemove={() => setRemoving(item)}
              onSave={(values) => run(() => actions.update(item.id, values))}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={removing !== null}
        title={`Remove photo${removing?.altEn ? ` “${removing.altEn}”` : ""}?`}
        body={
          removing?.isPrimary
            ? "This is the main photo. The next photo becomes the main one. The file is deleted permanently."
            : "The file is deleted permanently."
        }
        confirmLabel="Remove photo"
        pending={pending}
        onCancel={() => setRemoving(null)}
        onConfirm={() => {
          const target = removing;
          if (!target) return;
          startTransition(async () => {
            if (report(await actions.remove(target.id))) router.refresh();
            setRemoving(null);
          });
        }}
      />
    </div>
  );
}

function MediaCard({
  item,
  busy,
  onPrimary,
  onRemove,
  onSave,
}: {
  item: MediaItem;
  busy: boolean;
  onPrimary: () => void;
  onRemove: () => void;
  onSave: (values: {
    altEn: string;
    altGu: string;
    isRepresentative: boolean;
  }) => void;
}) {
  const [altEn, setAltEn] = useState(item.altEn);
  const [altGu, setAltGu] = useState(item.altGu);
  const [representative, setRepresentative] = useState(item.isRepresentative);
  const dirty =
    altEn !== item.altEn ||
    altGu !== item.altGu ||
    representative !== item.isRepresentative;

  return (
    <li className="border-border overflow-hidden rounded-2xl border">
      <div className="bg-surface-muted relative aspect-[4/3]">
        <Image
          src={item.src}
          alt={item.altEn}
          fill
          sizes="(min-width: 640px) 320px, 90vw"
          className="object-contain p-3"
        />
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.isPrimary && (
            <Badge tone="primary">
              <Star aria-hidden className="size-3 fill-current" />
              Main photo
            </Badge>
          )}
          {item.hasCredit && <Badge>Credited</Badge>}
        </div>
      </div>
      <div className="grid gap-3 p-3">
        <label className="grid gap-1 text-xs font-semibold">
          Alt text (English)
          <input
            value={altEn}
            maxLength={200}
            onChange={(e) => setAltEn(e.target.value)}
            className={cn(inputClass, "h-9")}
          />
        </label>
        <label className="grid gap-1 text-xs font-semibold">
          Alt text (Gujarati)
          <input
            value={altGu}
            lang="gu"
            maxLength={200}
            onChange={(e) => setAltGu(e.target.value)}
            className={cn(inputClass, "h-9")}
          />
        </label>
        <label className="flex items-start gap-2 text-xs">
          <input
            type="checkbox"
            checked={representative}
            onChange={(e) => setRepresentative(e.target.checked)}
            className="accent-primary mt-0.5"
          />
          <span>
            <span className="font-semibold">Representative photo</span>
            <span className="text-muted block">
              Shows the model line, not this exact unit. Customers are told.
            </span>
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {dirty && (
            <button
              type="button"
              disabled={busy}
              onClick={() =>
                onSave({ altEn, altGu, isRepresentative: representative })
              }
              className="bg-primary text-primary-foreground h-8 rounded-full px-3 text-xs font-semibold disabled:opacity-50"
            >
              Save details
            </button>
          )}
          {!item.isPrimary && (
            <button
              type="button"
              disabled={busy}
              onClick={onPrimary}
              className="border-border hover:border-border-strong h-8 rounded-full border px-3 text-xs font-semibold disabled:opacity-50"
            >
              Make main photo
            </button>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={onRemove}
            className="text-destructive hover:bg-destructive/10 ms-auto inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold disabled:opacity-50"
          >
            <Trash2 aria-hidden className="size-3.5" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
