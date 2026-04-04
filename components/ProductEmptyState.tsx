import Link from "next/link";
import {
  clearCategoryHrefFromParams,
  clearSearchHrefFromParams,
  productListingHref,
} from "@/lib/url-product-params";
import type { ProductQueryParams } from "@/types/product";

export type ProductEmptyStateProps = {
  queryParams: ProductQueryParams;
};

export function ProductEmptyState({ queryParams }: ProductEmptyStateProps) {
  const hasQ = Boolean(queryParams.q?.trim());
  const hasCat = Boolean(queryParams.category?.trim());

  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center"
      role="status"
    >
      <p className="text-lg font-medium text-neutral-800">No products found</p>
      <p className="mt-2 max-w-md text-sm text-neutral-600">
        Try a different search term or clear the category filter to see more
        results.
      </p>
      {(hasQ || hasCat) && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {hasQ && (
            <Link
              href={clearSearchHrefFromParams(queryParams)}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
            >
              Clear search
            </Link>
          )}
          {hasCat && (
            <Link
              href={clearCategoryHrefFromParams(queryParams)}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm hover:bg-neutral-50"
            >
              Clear category
            </Link>
          )}
          <Link
            href={productListingHref({})}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Reset filters
          </Link>
        </div>
      )}
    </div>
  );
}
