export const DUMMYJSON_BASE = "https://dummyjson.com";

/**
 * Next.js extends `fetch` on the server with `cache` / `next.revalidate`.
 * In the browser those options are ignored; listing hydration uses TanStack
 * Query (`useProducts`) for client-side refetch behavior.
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
