"use client";

import { Trash2Icon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileUpload from "@/components/ui/file-upload";
import { Spinner } from "@/components/ui/spinner";
import UserAvatar from "@/components/ui/user-avatar";
import { useRemoveAvatar, useUploadAvatar } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { Me } from "@/types";
import { getErrorMessage } from "@/utils";
import { AVATAR_TYPES } from "@/utils/upload.util";

export default function AvatarCard({ me }: { me: Me }) {
  const t = useT();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { mutate: uploadAvatar, isPending: uploading } = useUploadAvatar();
  const { mutate: removeAvatar, isPending: removing } = useRemoveAvatar();

  const handleDone = (message: string) => {
    toast.success(message);
    setFile(null);
    // The header's copy of the photo comes from the server layout.
    router.refresh();
  };

  const handleUpload = () => {
    if (!file) return;
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
    <Card>
      <CardHeader>
        <CardTitle>{t("profile.photoTitle")}</CardTitle>
        <CardDescription>{t("profile.photoBody")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UserAvatar
          name={me.name}
          src={me.avatarUrl}
          className="size-20 text-xl"
        />
        <FileUpload
          label={t("profile.photoChoose")}
          hint={t("profile.photoHint")}
          file={file}
          onChange={setFile}
          allowedTypes={AVATAR_TYPES}
          progress={uploading ? progress : null}
          disabled={uploading}
        />
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!file || uploading}
            onClick={handleUpload}
          >
            {uploading ? <Spinner /> : <UploadIcon />}
            {uploading ? t("profile.photoUploading") : t("profile.photoUpload")}
          </Button>
          {me.avatarUrl && (
            <Button
              type="button"
              variant="outline"
              disabled={removing || uploading}
              onClick={handleRemove}
            >
              {removing ? <Spinner /> : <Trash2Icon />}
              {t("profile.photoRemove")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
