import type { ProductQueryParams } from "@/types/product";

/** Smaller page = less LCP work per navigation (mobile Lighthouse). */
export const PAGE_SIZE = 8;

type SearchParamsInput = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseProductSearchParams(
  input: SearchParamsInput | URLSearchParams
): ProductQueryParams {
  const get = (key: string) => {
    if (input instanceof URLSearchParams) {
      const v = input.get(key);
      return v ?? undefined;
    }
    return first(input[key]);
  };

  const qRaw = get("q");
  const categoryRaw = get("category");
  const pageRaw = get("page");
  const q = qRaw?.trim() || undefined;
  const category = categoryRaw?.trim() || undefined;
  const pageNum = Math.max(1, parseInt(pageRaw || "1", 10) || 1);

  return {
    limit: PAGE_SIZE,
    skip: (pageNum - 1) * PAGE_SIZE,
    ...(q ? { q } : {}),
    ...(category ? { category } : {}),
  };
}

export function paramsEqual(
  a: ProductQueryParams,
  b: ProductQueryParams
): boolean {
  return (
    a.skip === b.skip &&
    a.limit === b.limit &&
    a.q === b.q &&
    a.category === b.category
  );
}

export function pageFromSkip(skip: number): number {
  return Math.floor(skip / PAGE_SIZE) + 1;
}

/** Build `/?q=…&category=…&page=…` for server-rendered `<Link>` actions. */
export function productListingHref(input: {
  q?: string;
  category?: string;
  page?: number;
}): string {
  const sp = new URLSearchParams();
  if (input.q?.trim()) sp.set("q", input.q.trim());
  if (input.category?.trim()) sp.set("category", input.category.trim());
  if (input.page != null && input.page > 1) sp.set("page", String(input.page));
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}

export function clearSearchHrefFromParams(p: ProductQueryParams): string {
  return productListingHref({
    category: p.category,
    page: 1,
  });
}

export function clearCategoryHrefFromParams(p: ProductQueryParams): string {
  return productListingHref({
    q: p.q,
    page: 1,
  });
}
