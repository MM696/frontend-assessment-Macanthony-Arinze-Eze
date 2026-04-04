export default function ProductDetailLoading() {
  return (
    <article className="space-y-6" aria-busy>
      <div className="h-4 w-56 rounded bg-neutral-200" />
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="aspect-square w-full max-w-lg rounded-2xl bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-10 w-4/5 rounded-lg bg-neutral-200" />
          <div className="h-6 w-32 rounded bg-neutral-200" />
          <div className="h-px w-full bg-neutral-200" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-full rounded bg-neutral-200" />
            <div className="h-4 w-5/6 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
