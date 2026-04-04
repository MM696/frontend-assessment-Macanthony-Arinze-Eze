"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";
import type { ProductCategory } from "@/types/product";

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

export type ListingControlsProps = {
  categories: ProductCategory[];
};

export function ListingControls({ categories }: ListingControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (patch: Record<string, string | undefined>) => {
      const href = buildHref(pathname, searchParams, patch);
      startTransition(() => router.replace(href, { scroll: false }));
    },
    [pathname, router, searchParams]
  );

  const urlQuery = searchParams.get("q") ?? "";
  const selectedCategory = searchParams.get("category") ?? "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <SearchBar
        urlQuery={urlQuery}
        onDebouncedQuery={(query) =>
          navigate({
            q: query || undefined,
            page: undefined,
          })
        }
      />
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) =>
          navigate({
            category: category || undefined,
            page: undefined,
          })
        }
      />
      {isPending ? (
        <span className="sr-only" aria-live="polite">
          Updating results
        </span>
      ) : null}
    </div>
  );
}
