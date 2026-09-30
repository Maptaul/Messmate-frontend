type Cell = string | number | null | undefined;

/** RFC 4180: quote a cell holding a comma, quote or line break; double its quotes. */
export function toCsv(rows: Cell[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = cell === null || cell === undefined ? "" : String(cell);
          return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(","),
    )
    .join("\r\n");
}

/** Saves text as a file. The BOM makes Excel read Bangla as UTF-8. */
export function downloadCsv(csv: string, fileName: string) {
  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

/** The API caps a page at 100 rows; an export wants every row that matches. */
export const EXPORT_PAGE_SIZE = 100;

export async function fetchAllPages<T>(
  fetchPage: (page: number) => Promise<{
    data: T[];
    meta?: { totalPages: number };
  }>,
): Promise<T[]> {
  const first = await fetchPage(1);
  const rows = [...first.data];
  for (let page = 2; page <= (first.meta?.totalPages ?? 1); page++) {
    rows.push(...(await fetchPage(page)).data);
  }
  return rows;
}
