# Content Explorer

Production-style Next.js app that lists [DummyJSON](https://dummyjson.com/docs/products) products with search, category filters, pagination, and detail pages.

## Setup ( 5 commands)

```bash
npm install
npm run dev
npm run build
npm start
npm test
```

For local development, run `npm install` then `npm run dev` and open [http://localhost:3000](http://localhost:3000). Use `npm run build` and `npm start` for a production-like run, and `npm test` for unit tests.

---

## Architecture decisions

- **App Router and RSC-first listing**: The home route is an async Server Component that loads products and categories with `getProducts` / `getCategories`. Search, filters, and pagination are small client components that call `router.replace`; each URL change triggers a fresh server render (no client-side list cache).
- **API boundary**: All HTTP calls live under `lib/` (`lib/api.ts` for lists/categories, `lib/product-detail.ts` for the single-product fetch used only on the server). UI never calls `fetch` directly.
- **Server revalidation**: List/detail `fetch` uses `next: { revalidate: 60 }` on the server. Client navigations re-run the server component so data always comes from RSC + the same `lib/api` helpers.
- **Per-request deduplication**: `getProductById` is wrapped in React `cache()` so `generateMetadata` and the detail page share one fetch per request.
- **Strict types**: Shared shapes live in `types/product.ts`; TypeScript `strict` mode is enabled.

---

## Performance optimizations (what & why)

1. **`next/image`** - Fixed `width` / `height`, `sizes`, and `priority` on the first grid cards and the hero image on the detail route to reduce LCP and unnecessary bytes.
2. **`next/font` (Inter)** - Self-hosted font via CSS variables to remove extra render-blocking requests and reduce CLS from font swap (Next 14.2’s `next/font/google` set does not include Geist, so Inter is used).
3. **Next.js `fetch` caching** - Category list uses `next: { revalidate: 86_400 }` (daily) so CDN responses stay fast but API shape changes are not permanent. Product lists and detail use `revalidate: 60`. Combined **search and category** loads category pages in **parallel waves** (bounded concurrency) instead of strictly sequential requests, cutting wall-clock time for large categories.
4. **Small client islands** - Only `ListingControls` (search + filters), `ListingPagination`, and `ProductCard` (image error state) ship as client components; the product grid HTML is server-rendered.
5. **Skeletons and stable card geometry** - Route `loading.tsx` and `SkeletonCard` mirror card layout without `animate-pulse` to cut main-thread work during transitions.

---

## Pagination vs infinite scroll

**Pagination (URL `?page=`)** is used because it pairs naturally with shareable filters (`q`, `category`, `page`), matches DummyJSON’s `limit` / `skip` API, and keeps DOM size bounded for performance and accessibility.

---

## Trade-offs & limitations

- **Search and category together** - DummyJSON has no single endpoint for both. The app loads all pages of a category (batch size 100, up to `total` from the API), filters by the query string in memory, then paginates. Wall-clock time is improved with parallel fetches (`CATEGORY_FETCH_CONCURRENCY`), but CPU and memory still scale with category size.
- **Soft navigations** - Filter/pagination changes use `router.replace` and show `loading.tsx` while the server refetches; there is no in-memory client cache of the list.
- **Third-party images** - Remote patterns allow DummyJSON CDN hosts; broken thumbnails fall back to a tiny inline SVG in `ProductCard`.

---

## Deployment

- **Cloudflare**: Use [ `@cloudflare/next-on-pages` ](https://github.com/cloudflare/next-on-pages) or Workers equivalents so dynamic routes and `fetch` caching behave as expected. Static assets and images benefit from Cloudflare’s edge cache; ISR/revalidate semantics depend on the adapter—validate in staging.

---

## Future improvements

- E2E tests (Playwright) for URL ↔ UI sync.
- Dedicated server actions or Route Handlers to proxy DummyJSON and unify cache policy.
- Virtualized grid for very large result sets if infinite scroll is added later.

---

## Bonus notes

- **Suspense** - `ListingControls` / `ListingPagination` sit inside `<Suspense>` because they use `useSearchParams`. Product detail wraps the async body in `<Suspense>` with a skeleton fallback.
- **Accessibility** - Semantic regions, labels, breadcrumb nav, and focus styles on interactive elements; run Lighthouse on a production build for a real score.
