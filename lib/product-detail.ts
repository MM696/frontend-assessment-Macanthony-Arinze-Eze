import { cache } from "react";
import type { Product } from "@/types/product";
import { DUMMYJSON_BASE, fetchJson, serverCacheInit } from "@/lib/http";

export const getProductById = cache(async (id: number): Promise<Product> => {
  const url = `${DUMMYJSON_BASE}/products/${id}`;
  return fetchJson<Product>(url, serverCacheInit({ revalidate: 60 }));
});
