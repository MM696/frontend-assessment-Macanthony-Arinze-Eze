export const DUMMYJSON_BASE = "https://dummyjson.com";

/**
 * Next.js extends `fetch` on the server with `cache` / `next.revalidate`.
 * Listing data is fetched in server components; client navigations re-run RSC.
 */
export function serverCacheInit(options: {
  revalidate?: number;
  forceStatic?: boolean;
}): RequestInit {
  if (typeof window !== "undefined") {
    return {};
  }
  if (options.forceStatic) {
    return { cache: "force-cache" };
  }
  return { next: { revalidate: options.revalidate ?? 60 } };
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
