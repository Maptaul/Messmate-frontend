"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

/** Types freely; reports the value only after the user pauses. */
export function SearchInput({
  value,
  onSearch,
  placeholder = "Search…",
  label = "Search",
}: {
  value: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  label?: string;
}) {
  const [draft, setDraft] = useState(value);
  const debounced = useDebounce(draft);

  useEffect(() => {
    if (debounced.trim() !== value) onSearch(debounced.trim());
  }, [debounced, value, onSearch]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="pr-8 pl-8"
      />
      {draft && (
        <Button
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          onClick={() => setDraft("")}
          aria-label="Clear search"
        >
          <XIcon />
        </Button>
      )}
    </div>
  );
}
