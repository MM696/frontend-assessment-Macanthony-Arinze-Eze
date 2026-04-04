"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/api";
import { paramsEqual } from "@/lib/url-product-params";
import type { ProductQueryParams } from "@/types/product";
import type { ProductsListResponse } from "@/types/product";

export function productListQueryKey(params: ProductQueryParams) {
  return ["products", params] as const;
}

export function useProducts(
  params: ProductQueryParams,
  initialData: ProductsListResponse,
  initialParams: ProductQueryParams
) {
  const initialMatch = paramsEqual(params, initialParams);

  return useQuery({
    queryKey: productListQueryKey(params),
    queryFn: () => getProducts(params),
    initialData: initialMatch ? initialData : undefined,
    staleTime: initialMatch ? 60_000 : 0,
    placeholderData: keepPreviousData,
  });
}
