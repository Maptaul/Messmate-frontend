"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MealStepper from "@/components/ui/meal-stepper";
import { Spinner } from "@/components/ui/spinner";
import { useSetDefaultMeals } from "@/hooks";
import { useT } from "@/i18n/i18n-provider";
import type { MessMember } from "@/types";
import { getErrorMessage } from "@/utils";

export default function MemberDefaultsDialog({
  member,
  messId,
  open,
  onOpenChange,
}: {
  member: MessMember;
  messId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const [lunch, setLunch] = useState(member.defaultLunch);
  const [dinner, setDinner] = useState(member.defaultDinner);

  const { mutate: save, isPending } = useSetDefaultMeals();

  const handleSave = () => {
    save(
      { messId, memberId: member.id, lunch, dinner },
      {
        onSuccess: () => {
          toast.success(t("manager.members.defaultsSaved"));
          onOpenChange(false);
        },
        onError: (err) => {
          toast.error(t.dynamic(getErrorMessage(err)));
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setLunch(member.defaultLunch);
          setDinner(member.defaultDinner);
        }
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-115">
        <DialogHeader>
          <DialogTitle>{t("manager.members.setDefaults")}</DialogTitle>
          <DialogDescription>{member.user.name}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-medium">{t("manager.members.lunch")}</span>
            <MealStepper
              size="lg"
              value={lunch}
              onChange={setLunch}
              decreaseLabel={t("manager.members.lessLunch")}
              increaseLabel={t("manager.members.moreLunch")}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-medium">{t("manager.members.dinner")}</span>
            <MealStepper
              size="lg"
              value={dinner}
              onChange={setDinner}
              decreaseLabel={t("manager.members.lessDinner")}
              increaseLabel={t("manager.members.moreDinner")}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("manager.members.defaultsHint")}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Spinner />}
            {t("manager.members.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
