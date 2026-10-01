"use client";

import { CopyIcon, KeyRoundIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import InlineConfirm from "@/components/ui/inline-confirm";
import Panel from "@/components/ui/panel";
import { useRegenerateJoinCode, useSuspenseMyMesses } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import { getErrorMessage, MY_MESSES_PARAMS } from "@/utils";

/** The code the manager shares; whoever enters it still needs approval. */
export default function JoinCodeCard({ messId }: { messId: string }) {
  const t = useT();
  const [confirming, setConfirming] = useState(false);

  const { data } = useSuspenseMyMesses(MY_MESSES_PARAMS);
  const { mutate: regenerate, isPending } = useRegenerateJoinCode();

  const code = data.data.find((mess) => mess.id === messId)?.joinCode;

  if (!code) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(t("toast.joinCodeCopied"));
    } catch {
      toast.error(t("errors.generic"));
    }
  };

  const handleRegenerate = () =>
    regenerate(messId, {
      onSuccess: (res) => {
        toast.success(t("toast.joinCodeChanged", { code: res.data.joinCode }));
        setConfirming(false);
      },
      onError: (err) => toast.error(t.dynamic(getErrorMessage(err))),
    });

  return (
    <Panel
      title={t("manager.members.joinCodeTitle")}
      icon={<KeyRoundIcon className="size-4 text-muted-foreground" />}
    >
      <div className="flex flex-col gap-3">
        <p className="text-[13px] text-muted-foreground">
          {t("manager.members.joinCodeBody")}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <output
            aria-label={t("manager.members.joinCodeTitle")}
            className="rounded-lg border bg-muted px-3 py-1.5 font-mono text-xl font-semibold tracking-[0.3em]"
          >
            {code}
          </output>
          <Button variant="outline" size="sm" onClick={copy}>
            <CopyIcon />
            {t("manager.members.copyCode")}
          </Button>
          {!confirming && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirming(true)}
            >
              <RefreshCwIcon />
              {t("manager.members.newCode")}
            </Button>
          )}
        </div>
        {confirming && (
          <InlineConfirm
            hint={t("manager.members.newCodeHint")}
            confirmLabel={t("manager.members.newCode")}
            onConfirm={handleRegenerate}
            onCancel={() => setConfirming(false)}
            pending={isPending}
            tone="primary"
            className="justify-start"
          />
        )}
      </div>
    </Panel>
  );
}
