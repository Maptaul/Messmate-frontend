"use client";

import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Panel from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import UserAvatar from "@/components/ui/user-avatar";
import { useRemoveAvatar, useUploadAvatar } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { getErrorMessage } from "@/utils";
import { AVATAR_TYPES, checkUpload } from "@/utils/upload.util";

/** The photo: pick one and it uploads at once, with a progress bar. */
export default function AvatarCard({ me }: { me: Me }) {
  const t = useT();
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar();
  const { mutate: removeAvatar, isPending: removing } = useRemoveAvatar();

  const handleDone = (message: string) => {
    toast.success(message);
    // The header's copy of the photo comes from the server layout.
    router.refresh();
  };

  const handlePick = (file: File | undefined) => {
    if (input.current) input.current.value = "";
    if (!file) return;
    const problem = checkUpload(file, AVATAR_TYPES);
    if (problem) {
      toast.error(t(`upload.${problem}`));
      return;
    }
    uploadAvatar(
      { file, onProgress: setProgress },
      {
        onSuccess: () => handleDone(t("toast.photoUpdated")),
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
        onSettled: () => setProgress(null),
      },
    );
  };

  const handleRemove = () => {
    removeAvatar(undefined, {
      onSuccess: () => handleDone(t("toast.photoRemoved")),
      onError: (err) => {
        toast.error(t.dynamic(getErrorMessage(err)));
      },
    });
  };

  return (
    <Panel title={t("profile.photoTitle")}>
      <div className="flex flex-wrap items-center gap-4">
        <UserAvatar
          name={me.name}
          src={me.avatarUrl}
          variant="ink"
          className="size-16 text-xl"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={uploading || removing}
              onClick={() => input.current?.click()}
            >
              {uploading ? <Spinner /> : <ImageIcon />}
              {uploading
                ? t("profile.photoUploading")
                : t("profile.changePhoto")}
            </Button>
            {me.avatarUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={uploading || removing}
                onClick={handleRemove}
              >
                {removing && <Spinner />}
                {t("profile.photoRemove")}
              </Button>
            )}
          </div>
          {progress !== null ? (
            <Progress value={progress} className="max-w-60" />
          ) : (
            <p className="text-xs text-muted-foreground">
              {t("profile.photoHint")}
            </p>
          )}
        </div>
        <input
          ref={input}
          type="file"
          accept={AVATAR_TYPES.join(",")}
          className="sr-only"
          aria-label={t("profile.changePhoto")}
          onChange={(event) => handlePick(event.target.files?.[0])}
        />
      </div>
    </Panel>
  );
}
