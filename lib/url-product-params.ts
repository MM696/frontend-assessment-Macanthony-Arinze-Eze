import type { ProductQueryParams } from "@/types/product";

export const PAGE_SIZE = 20;

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
