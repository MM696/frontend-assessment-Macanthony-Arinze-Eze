import type {
  Product,
  ProductCategory,
  ProductQueryParams,
  ProductsListResponse,
} from "@/types/product";
import { DUMMYJSON_BASE, fetchJson, serverCacheInit } from "@/lib/http";

/** Revalidate periodically so upstream shape changes (e.g. slug objects) are picked up. */
const CATEGORIES_REVALIDATE_SEC = 86_400;

export async function getCategories(): Promise<ProductCategory[]> {
  const url = `${DUMMYJSON_BASE}/products/categories`;
  return fetchJson<ProductCategory[]>(
    url,
    serverCacheInit({ revalidate: CATEGORIES_REVALIDATE_SEC })
  );
}

function normalizeQuery(params: ProductQueryParams): ProductQueryParams {
  const q = params.q?.trim() || undefined;
  const category = params.category?.trim() || undefined;
  return {
    limit: params.limit,
    skip: params.skip,
    ...(q ? { q } : {}),
    ...(category ? { category } : {}),
  };
}

const CATEGORY_BATCH = 100;
/** Parallel category page fetches per wave (limits socket pressure vs sequential loops). */
const CATEGORY_FETCH_CONCURRENCY = 6;

function collectTextMatches(products: Product[], qLower: string): Product[] {
  const out: Product[] = [];
  for (const product of products) {
    const text = `${product.title} ${product.description}`.toLowerCase();
    if (text.includes(qLower)) out.push(product);
  }
  return out;
}

async function getProductsByCategoryAndQuery(
  category: string,
  q: string,
  limit: number,
  skip: number
): Promise<ProductsListResponse> {
  const qLower = q.toLowerCase();
  const matched: Product[] = [];

  const first = await fetchJson<ProductsListResponse>(
    `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(
      category
    )}?limit=${CATEGORY_BATCH}&skip=0`,
    serverCacheInit({ revalidate: 60 })
  );

  matched.push(...collectTextMatches(first.products, qLower));

  const totalInCategory = first.total;
  const skips: number[] = [];
  for (let s = CATEGORY_BATCH; s < totalInCategory; s += CATEGORY_BATCH) {
    skips.push(s);
  }

  for (let i = 0; i < skips.length; i += CATEGORY_FETCH_CONCURRENCY) {
    const chunk = skips.slice(i, i + CATEGORY_FETCH_CONCURRENCY);
    const pages = await Promise.all(
      chunk.map((apiSkip) =>
        fetchJson<ProductsListResponse>(
          `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(
            category
          )}?limit=${CATEGORY_BATCH}&skip=${apiSkip}`,
          serverCacheInit({ revalidate: 60 })
        )
      )
    );
    for (const data of pages) {
      matched.push(...collectTextMatches(data.products, qLower));
    }
  }

  const page = matched.slice(skip, skip + limit);
  return {
    products: page,
    total: matched.length,
    skip,
    limit,
  };
}

export async function getProducts(
  params: ProductQueryParams
): Promise<ProductsListResponse> {
  const p = normalizeQuery(params);
  const limit = p.limit;
  const skip = p.skip;

  if (p.q && p.category) {
    return getProductsByCategoryAndQuery(p.category, p.q, limit, skip);
  }

  if (p.q) {
    const url = `${DUMMYJSON_BASE}/products/search?q=${encodeURIComponent(
      p.q
    )}&limit=${limit}&skip=${skip}`;
    return fetchJson<ProductsListResponse>(
      url,
      serverCacheInit({ revalidate: 60 })
    );
  }

  if (p.category) {
    const url = `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(
      p.category
    )}?limit=${limit}&skip=${skip}`;
    return fetchJson<ProductsListResponse>(
      url,
      serverCacheInit({ revalidate: 60 })
    );
  }

  const url = `${DUMMYJSON_BASE}/products?limit=${limit}&skip=${skip}`;
  return fetchJson<ProductsListResponse>(
    url,
    serverCacheInit({ revalidate: 60 })
  );
}
