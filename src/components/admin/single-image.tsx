"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createBrowserSupabase } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/media";
import { ACCEPTED, prepareImage } from "@/lib/image-prep";
import type { ActionState } from "@/features/admin/schemas";

/**
 * One image for a record (a service). Uploads go straight to the bucket
 * under `${folder}/`, then `onSet` stores the key; the previous upload is
 * removed by the server action.
 */
export function SingleImage({
  folder,
  current,
  onSet,
}: {
  folder: string;
  current: string | null;
  onSet: (path: string | null) => Promise<ActionState>;
}) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [pending, start] = useTransition();

  async function upload(file: File) {
    setBusy(true);
    try {
      const prepared = await prepareImage(file);
      const path = `${folder}/${crypto.randomUUID()}.webp`;
      const { error } = await createBrowserSupabase()
        .storage.from(MEDIA_BUCKET)
        .upload(path, prepared.blob, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });
      if (error) throw new Error(error.message);
      const result = await onSet(path);
      if (result.status === "error") throw new Error(result.message);
      toast.success(result.message ?? "Image updated.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="bg-surface-muted border-border relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border">
        {current ? (
          <Image
            src={current}
            alt=""
            fill
            sizes="320px"
            className="object-contain p-3"
          />
        ) : (
          <p className="text-muted px-6 text-center text-sm">
            No image. The service&apos;s icon is shown instead.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy || pending}
          onClick={() => input.current?.click()}
          className="border-border hover:border-border-strong inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <ImagePlus aria-hidden className="size-4" />
          )}
          {current ? "Replace image" : "Upload image"}
        </button>
        {current && (
          <button
            type="button"
            disabled={busy || pending}
            onClick={() =>
              start(async () => {
                const result = await onSet(null);
                if (result.status === "error") toast.error(result.message);
                else {
                  toast.success(result.message ?? "Image removed.");
                  router.refresh();
                }
              })
            }
            className="text-destructive hover:bg-destructive/10 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold disabled:opacity-50"
          >
            <Trash2 aria-hidden className="size-4" />
            Remove
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept={ACCEPTED.join(",")}
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
