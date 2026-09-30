"use client";

import {
  CircleCheckIcon,
  FileTextIcon,
  FileXIcon,
  UploadIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/i18n/i18n-provider";
import { checkUpload } from "@/utils/upload.util";

/**
 * Picks one file (click or drop), checks type and size before anything is
 * sent, and previews it (an image thumbnail, or a PDF tile). `progress`
 * (0–100) shows a bar while the parent is uploading.
 */
export default function FileUpload({
  label,
  prompt,
  hint,
  file,
  onChange,
  allowedTypes,
  progress,
  disabled,
}: {
  label: string;
  /** The line inside the empty drop zone. */
  prompt?: string;
  hint?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  allowedTypes: string[];
  progress?: number | null;
  disabled?: boolean;
}) {
  const t = useT();
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [problem, setProblem] = useState<"tooLarge" | "wrongType" | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (chosen: File | undefined) => {
    if (!chosen) return;
    const found = checkUpload(chosen, allowedTypes);
    setProblem(found);
    if (!found) onChange(chosen);
    // Let the same file be chosen again after a rejection.
    if (input.current) input.current.value = "";
  };

  const clear = () => {
    onChange(null);
    setProblem(null);
  };

  const uploading = progress !== null && progress !== undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-medium">{label}</span>

      {problem ? (
        <div
          role="alert"
          className="tone-r flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5"
        >
          <FileXIcon className="size-4 shrink-0" />
          <span className="flex-1">{t(`upload.${problem}`)}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => input.current?.click()}
          >
            {t("upload.chooseAnother")}
          </Button>
        </div>
      ) : file ? (
        <div className="flex items-center gap-3 rounded-xl border p-3">
          {previewUrl ? (
            // A blob: URL can't go through next/image; it is a local preview only.
            // biome-ignore lint/performance/noImgElement: local blob preview
            <img
              src={previewUrl}
              alt={t("upload.preview", { name: file.name })}
              className="size-12 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <span className="grid size-12 shrink-0 place-items-center rounded-lg bg-muted">
              <FileTextIcon className="size-5 text-muted-foreground" />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="truncate font-medium">{file.name}</span>
            {uploading ? (
              <>
                <Progress value={progress} />
                <output className="text-xs text-muted-foreground">
                  {t("upload.uploading", { percent: progress })}
                </output>
              </>
            ) : (
              <span className="flex items-center gap-1 text-xs text-(--tone-g-fg)">
                <CircleCheckIcon className="size-3.5" />
                {t("upload.size", { size: (file.size / 1024).toFixed(0) })}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled || uploading}
            onClick={clear}
          >
            {t("upload.remove")}
          </Button>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            if (!disabled) pick(event.dataTransfer.files[0]);
          }}
          className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed p-5 text-center transition-colors hover:bg-muted/60 has-disabled:cursor-not-allowed has-disabled:opacity-60"
        >
          <UploadIcon className="size-6 text-muted-foreground" />
          <span className="font-medium">{prompt ?? t("upload.choose")}</span>
          {hint && (
            <span className="text-xs text-muted-foreground">{hint}</span>
          )}
        </label>
      )}

      <input
        ref={input}
        id={id}
        type="file"
        accept={allowedTypes.join(",")}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => pick(event.target.files?.[0])}
      />
    </div>
  );
}
