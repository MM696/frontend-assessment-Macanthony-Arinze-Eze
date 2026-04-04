"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { getPaginationItems } from "@/lib/pagination";
import {
  PAGE_SIZE,
  pageFromSkip,
  parseProductSearchParams,
} from "@/lib/url-product-params";
import type {
  ProductCategory,
  ProductQueryParams,
  ProductsListResponse,
} from "@/types/product";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { SkeletonCard } from "./SkeletonCard";

const FiltersDynamic = dynamic(
  () => import("./Filters").then((m) => ({ default: m.Filters })),
  {
    loading: () => (
      <div
        className="h-[72px] w-full max-w-xs animate-pulse rounded-lg bg-neutral-200"
        aria-hidden
      />
    ),
    ssr: true,
  }
);

export type ProductGridProps = {
  initialData: ProductsListResponse;
  initialParams: ProductQueryParams;
  categories: ProductCategory[];
};

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

function EmptyState({
  onClearSearch,
  onClearCategory,
  onResetAll,
}: {
  onClearSearch?: () => void;
  onClearCategory?: () => void;
  onResetAll?: () => void;
}) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center"
      role="status"
    >
      <p className="text-lg font-medium text-neutral-800">No products found</p>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Try a different search term or clear the category filter to see more
        results.
      </p>
      {(onClearSearch || onClearCategory || onResetAll) && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {onClearSearch && (
            <button
              type="button"
              onClick={onClearSearch}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
            >
              Clear search
            </button>
          )}
          {onClearCategory && (
            <button
              type="button"
              onClick={onClearCategory}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
            >
              Clear category
            </button>
          )}
          {onResetAll && (
            <button
              type="button"
              onClick={onResetAll}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Reset filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductGrid({
  initialData,
  initialParams,
  categories,
}: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = useMemo(
    () => parseProductSearchParams(searchParams),
    [searchParams]
  );

  const { data, isFetching, isError, error, refetch } = useProducts(
    params,
    initialData,
    initialParams
  );

  const urlQuery = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";
  const currentPage = pageFromSkip(params.skip);
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  const navigate = useCallback(
    (patch: Record<string, string | undefined>) => {
      const href = buildHref(pathname, searchParams, patch);
      router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const onDebouncedQuery = useCallback(
    (query: string) => {
      navigate({
        q: query || undefined,
        page: undefined,
      });
    },
    [navigate]
  );

  const onCategoryChange = useCallback(
    (category: string) => {
      navigate({
        category: category || undefined,
        page: undefined,
      });
    },
    [navigate]
  );

  const goToPage = useCallback(
    (page: number) => {
      const safe = Math.min(Math.max(1, page), totalPages);
      navigate({ page: safe <= 1 ? undefined : String(safe) });
    },
    [navigate, totalPages]
  );

  const products = data?.products ?? [];
  const showSkeletonOverlay = isFetching && products.length === 0;

  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages]
  );

  const clearSearch = useCallback(
    () => navigate({ q: undefined, page: undefined }),
    [navigate]
  );
  const clearCategory = useCallback(
    () => navigate({ category: undefined, page: undefined }),
    [navigate]
  );
  const resetFilters = useCallback(
    () =>
      navigate({
        q: undefined,
        category: undefined,
        page: undefined,
      }),
    [navigate]
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Content Explorer
          </h1>
          <p className="mt-1 text-neutral-600">
            Browse DummyJSON products with search, filters, and shareable URLs.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <SearchBar urlQuery={urlQuery} onDebouncedQuery={onDebouncedQuery} />
          <FiltersDynamic
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
      </header>

      {isError && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p>{error instanceof Error ? error.message : "Something went wrong."}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-medium underline"
          >
            Try again
          </button>
        </div>
      )}

      <section aria-label="Product results" className="relative">
        {showSkeletonOverlay ? (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i}>
                <SkeletonCard />
              </li>
            ))}
          </ul>
        ) : (
          <>
            {isFetching && products.length > 0 && (
              <div
                className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-white/40 backdrop-blur-[1px]"
                aria-hidden
              />
            )}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.length === 0 ? (
                <EmptyState
                  onClearSearch={urlQuery ? clearSearch : undefined}
                  onClearCategory={
                    selectedCategory ? clearCategory : undefined
                  }
                  onResetAll={
                    urlQuery || selectedCategory ? resetFilters : undefined
                  }
                />
              ) : (
                products.map((product, index) => (
                  <li key={product.id}>
                    <ProductCard product={product} priority={index < 4} />
                  </li>
                ))
              )}
            </ul>
          </>
        )}
      </section>

      {products.length > 0 && (
        <nav
          className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-200 pt-6"
          aria-label="Pagination"
        >
          <p className="text-sm text-neutral-600">
            Page {currentPage} of {totalPages}
            <span className="mx-2 text-neutral-400" aria-hidden>
              ·
            </span>
            <span className="text-neutral-500">{data?.total ?? 0} items</span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(1)}
              disabled={currentPage <= 1 || isFetching}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              First
            </button>
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1 || isFetching}
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
                    disabled={isFetching}
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
              disabled={currentPage >= totalPages || isFetching}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage >= totalPages || isFetching}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-800 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
