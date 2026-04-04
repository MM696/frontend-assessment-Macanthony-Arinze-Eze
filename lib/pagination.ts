export type PaginationItem =
  | { kind: "page"; page: number }
  | { kind: "ellipsis" };

/**
 * Builds a compact list of page buttons with ellipses (e.g. 1 … 4 5 6 … 12).
 */
export function getPaginationItems(
  currentPage: number,
  totalPages: number
): PaginationItem[] {
  if (totalPages <= 1) return [{ kind: "page", page: 1 }];
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => ({
      kind: "page" as const,
      page: i + 1,
    }));
  }

  const want = new Set<number>([1, totalPages, currentPage]);
  for (let d = -2; d <= 2; d++) {
    const p = currentPage + d;
    if (p >= 1 && p <= totalPages) want.add(p);
  }

  const sorted = Array.from(want).sort((a, b) => a - b);
  const out: PaginationItem[] = [];
  let prev = 0;

  for (const page of sorted) {
    if (prev > 0 && page - prev > 1) {
      out.push({ kind: "ellipsis" });
    }
    out.push({ kind: "page", page });
    prev = page;
  }

  return out;
}
