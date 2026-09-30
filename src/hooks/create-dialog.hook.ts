"use client";

import { useState } from "react";
import useQueryParams from "./query-params.hook";

/**
 * Open state for a page's create dialog. `?new=1` (the header's quick
 * actions) opens it on arrival; closing it drops the flag from the URL.
 */
export default function useCreateDialog() {
  const { get, set } = useQueryParams();
  const [open, setOpen] = useState(false);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next && get("new")) set({ new: undefined, page: get("page") });
  };

  return [open || get("new") === "1", onOpenChange] as const;
}
