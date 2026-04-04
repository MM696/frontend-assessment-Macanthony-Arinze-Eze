export function SkeletonCard() {
  return (
    <article
      className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm"
      aria-hidden
    >
      <div className="aspect-square w-full animate-pulse bg-neutral-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
        <div className="mt-auto h-6 w-24 animate-pulse rounded bg-neutral-200" />
      </div>
    </article>
  );
}
