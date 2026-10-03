"use client";

import { useEffect } from "react";
import { useLocale, useT } from "@/i18n/i18n-provider";
import { formatNumber } from "@/utils/format.util";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

export const getButtonArray = (
  totalPages: number,
  page: number,
): (number | "ellipsis")[] => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
};

interface Props {
  totalPages: number;
  handlePageChange: (page: number) => void;
  page: number;
  /** With both, the row also says "Showing 11–20 of 128". */
  total?: number;
  limit?: number;
}

export default function TablePagination({
  totalPages,
  handlePageChange,
  page,
  total,
  limit,
}: Props) {
  const t = useT();
  const locale = useLocale();

  // A page past the end (an old bookmark, a list that shrank) moves to the last one.
  useEffect(() => {
    if (totalPages > 0 && page > totalPages) handlePageChange(totalPages);
  }, [page, totalPages, handlePageChange]);

  const goToPage = (page: number) => {
    handlePageChange(page);
  };

  const showing =
    total && limit
      ? t("common.showingRange", {
          from: formatNumber((page - 1) * limit + 1, locale),
          to: formatNumber(Math.min(page * limit, total), locale),
          total: formatNumber(total, locale),
        })
      : null;

  if (totalPages <= 1) {
    return showing ? <p className="text-muted-foreground">{showing}</p> : null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {showing && <p className="text-muted-foreground">{showing}</p>}
      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text={t("common.previous")}
              onClick={() => goToPage(page - 1)}
              aria-disabled={page === 1}
              className={
                page === 1 ? "pointer-events-none opacity-50" : undefined
              }
            />
          </PaginationItem>
          {getButtonArray(totalPages, page).map((item, index) =>
            item === "ellipsis" ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: an ellipsis has no identity
              <PaginationItem key={`ellipsis${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  onClick={() => handlePageChange(item)}
                  isActive={page === item}
                >
                  {formatNumber(item, locale)}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              text={t("common.next")}
              onClick={() => goToPage(page + 1)}
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
