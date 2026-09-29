"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber } from "@/lib/format";
import type { Meta } from "@/types";

/** 1 … 4 5 6 … 12 — the current page, its neighbours and both ends. */
export function pageWindow(page: number, totalPages: number): (number | "…")[] {
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  return sorted.flatMap((n, index) =>
    index > 0 && n - sorted[index - 1] > 1 ? (["…", n] as const) : [n],
  );
}

export function TablePagination({
  meta,
  onPageChange,
}: {
  meta: Meta | undefined;
  onPageChange: (page: number) => void;
}) {
  const t = useT();
  const locale = useLocale();

  if (!meta || meta.totalPages <= 1) return null;

  const { page, totalPages, total, limit } = meta;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const go = (target: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    if (target >= 1 && target <= totalPages && target !== page) {
      onPageChange(target);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        {t("common.showingRange", {
          from: formatNumber(from, locale),
          to: formatNumber(to, locale),
          total: formatNumber(total, locale),
        })}
      </p>
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text={t("common.previous")}
              aria-label={t("common.previousPage")}
              href={`?page=${page - 1}`}
              onClick={go(page - 1)}
              aria-disabled={page === 1}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {pageWindow(page, totalPages).map((entry, index) =>
            entry === "…" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: an ellipsis has no identity
              <PaginationItem key={`gap-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationLink
                  href={`?page=${entry}`}
                  isActive={entry === page}
                  onClick={go(entry)}
                >
                  {formatNumber(entry, locale)}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              text={t("common.next")}
              aria-label={t("common.nextPage")}
              href={`?page=${page + 1}`}
              onClick={go(page + 1)}
              aria-disabled={page === totalPages}
              className={
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : undefined
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
