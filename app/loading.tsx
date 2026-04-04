import { SkeletonCard } from "@/components/SkeletonCard";

export default function RootLoading() {
  return (
    <main aria-busy>
      <div className="space-y-8">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-neutral-200" />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
