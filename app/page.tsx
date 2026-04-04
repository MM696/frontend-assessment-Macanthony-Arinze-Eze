import { Suspense } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { SkeletonCard } from "@/components/SkeletonCard";
import { getCategories, getProducts } from "@/lib/api";
import { parseProductSearchParams } from "@/lib/url-product-params";

type SearchParams = Record<string, string | string[] | undefined>;

function ListingFallback() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="h-10 w-64 animate-pulse rounded-lg bg-neutral-200" />
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <li key={i}>
            <SkeletonCard />
          </li>
        ))}
      </ul>
    </div>
  );
}

async function ProductListing({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = parseProductSearchParams(searchParams);
  const [initialData, categories] = await Promise.all([
    getProducts(params),
    getCategories(),
  ]);

  return (
    <ProductGrid
      initialData={initialData}
      initialParams={params}
      categories={categories}
    />
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <main>
      <Suspense fallback={<ListingFallback />}>
        <ProductListing searchParams={resolvedSearchParams} />
      </Suspense>
    </main>
  );
}
