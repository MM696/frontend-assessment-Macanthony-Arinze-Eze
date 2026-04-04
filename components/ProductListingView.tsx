import { Suspense } from "react";
import { ListingControls } from "@/components/ListingControls";
import { ListingPagination } from "@/components/ListingPagination";
import { ProductEmptyState } from "@/components/ProductEmptyState";
import { ProductResultsGrid } from "@/components/ProductResultsGrid";
import type { Product, ProductCategory, ProductQueryParams } from "@/types/product";

function ListingToolbarFallback() {
  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
      aria-hidden
    >
      <div className="h-[42px] w-full max-w-md rounded-lg bg-neutral-200" />
      <div className="h-[72px] w-full max-w-xs rounded-lg bg-neutral-200" />
    </div>
  );
}

export type ProductListingViewProps = {
  products: Product[];
  total: number;
  categories: ProductCategory[];
  queryParams: ProductQueryParams;
};

export function ProductListingView({
  products,
  total,
  categories,
  queryParams,
}: ProductListingViewProps) {
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
        <Suspense fallback={<ListingToolbarFallback />}>
          <ListingControls categories={categories} />
        </Suspense>
      </header>

      <section aria-label="Product results">
        {products.length === 0 ? (
          <ProductEmptyState queryParams={queryParams} />
        ) : (
          <ProductResultsGrid products={products} />
        )}
      </section>

      {products.length > 0 && (
        <Suspense fallback={null}>
          <ListingPagination total={total} />
        </Suspense>
      )}
    </div>
  );
}
