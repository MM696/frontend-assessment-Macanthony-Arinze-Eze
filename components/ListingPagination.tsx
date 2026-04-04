"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { getPaginationItems } from "@/lib/pagination";
import {
  PAGE_SIZE,
  pageFromSkip,
  parseProductSearchParams,
} from "@/lib/url-product-params";

function buildHref(
  pathname: string,
  current: URLSearchParams,
  patch: Record<string, string | undefined>
): string {
  const next = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, value);
  }
  const qs = next.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export type ListingPaginationProps = {
  total: number;
};

export function ListingPagination({ total }: ListingPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const params = useMemo(
    () => parseProductSearchParams(searchParams),
    [searchParams]
  );

  const currentPage = pageFromSkip(params.skip);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const navigate = (patch: Record<string, string | undefined>) => {
    const href = buildHref(pathname, searchParams, patch);
    startTransition(() => router.replace(href, { scroll: false }));
  };

  const goToPage = (page: number) => {
    const safe = Math.min(Math.max(1, page), totalPages);
    navigate({ page: safe <= 1 ? undefined : String(safe) });
  };

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6"
      aria-label="Pagination"
    >
      <p className="text-sm text-neutral-600">
        Page {currentPage} of {totalPages}
        <span className="mx-2 text-neutral-400" aria-hidden>
          ·
        </span>
        <span className="text-neutral-500">{total} items</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => goToPage(1)}
          disabled={currentPage <= 1 || isPending}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          First
        </button>
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <div
          className="flex flex-wrap items-center gap-1"
          role="group"
          aria-label="Page numbers"
        >
          {paginationItems.map((item, idx) =>
            item.kind === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-neutral-400"
                aria-hidden
              >
                …
              </span>
            ) : (
              <button
                key={item.page}
                type="button"
                onClick={() => {
                  if (item.page !== currentPage) goToPage(item.page);
                }}
                disabled={isPending}
                aria-label={`Page ${item.page}`}
                aria-current={item.page === currentPage ? "page" : undefined}
                className={`min-w-[2.25rem] rounded-lg px-2 py-2 text-sm font-medium transition ${
                  item.page === currentPage
                    ? "cursor-default bg-neutral-900 text-white"
                    : "border border-neutral-300 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50 disabled:opacity-50"
                }`}
              >
                {item.page}
              </button>
            )
          )}
        </div>
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
        <button
          type="button"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage >= totalPages || isPending}
          className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </nav>
  );
}
