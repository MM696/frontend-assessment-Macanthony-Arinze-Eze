import Link from "next/link";
import { ProductListingView } from "@/components/ProductListingView";
import { getCategories, getProducts } from "@/lib/api";
import { parseProductSearchParams } from "@/lib/url-product-params";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const params = parseProductSearchParams(resolvedSearchParams);

  try {
    const [data, categories] = await Promise.all([
      getProducts(params),
      getCategories(),
    ]);

    return (
      <main>
        <ProductListingView
          products={data.products}
          total={data.total}
          categories={categories}
          queryParams={params}
        />
      </main>
    );
  } catch {
    return (
      <main>
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          <p>Could not load products. The API may be unreachable.</p>
          <Link
            href="/"
            className="mt-2 inline-block font-medium underline underline-offset-2"
          >
            Start over
          </Link>
        </div>
      </main>
    );
  }
}
