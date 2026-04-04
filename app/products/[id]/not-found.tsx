import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Product not found
      </h1>
      <p className="mt-2 text-neutral-600">
        We couldn&apos;t find a product for this link.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Back to catalog
      </Link>
    </main>
  );
}
