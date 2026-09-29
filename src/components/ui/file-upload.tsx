"use client";

import { FileTextIcon, ImagePlusIcon, XIcon } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useT } from "@/i18n/i18n-provider";
import { checkUpload } from "@/utils/upload.util";

/**
 * Picks one file, checks type and size before anything is sent, and previews
 * it (an image thumbnail, or a PDF chip). `progress` (0–100) shows a bar while
 * the parent is uploading.
 */
export default function FileUpload({
  label,
  hint,
  file,
  onChange,
  allowedTypes,
  progress,
  disabled,
}: {
  label: string;
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

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm leading-snug font-medium">
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
        {file ? (
          <>
            {previewUrl ? (
              // A blob: URL can't go through next/image; it is a local preview only.
              // biome-ignore lint/performance/noImgElement: local blob preview
              <img
                src={previewUrl}
                alt={t("upload.preview", { name: file.name })}
                className="size-14 shrink-0 rounded-md object-cover"
              />
            ) : (
              <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-muted">
                <FileTextIcon className="size-6 text-muted-foreground" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              aria-label={t("upload.remove")}
              onClick={() => {
                onChange(null);
                setProblem(null);
              }}
            >
              <XIcon />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => input.current?.click()}
          >
            <ImagePlusIcon />
            {t("upload.choose")}
          </Button>
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

      {progress !== null && progress !== undefined && (
        <div className="space-y-1">
          <Progress value={progress} />
          <output className="block text-xs text-muted-foreground">
            {t("upload.uploading", { percent: progress })}
          </output>
        </div>
      )}

      {problem ? (
        <p role="alert" className="text-sm text-destructive">
          {t(`upload.${problem}`)}
        </p>
      ) : (
        hint && <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
