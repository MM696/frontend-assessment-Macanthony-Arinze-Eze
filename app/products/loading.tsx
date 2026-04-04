export default function ProductsLoading() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="h-4 w-48 rounded bg-neutral-200" />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square max-h-[480px] rounded-xl bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-200" />
          <div className="h-4 w-full rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
