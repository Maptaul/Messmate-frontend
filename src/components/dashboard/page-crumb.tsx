"use client";

import { useEffect } from "react";
import { useCrumbStore } from "@/stores/crumb.store";

export default function PageCrumb({ label }: { label: string }) {
  const setLabel = useCrumbStore((state) => state.setLabel);

  useEffect(() => {
    setLabel(label);
    return () => setLabel(null);
  }, [label, setLabel]);

  return null;
}
