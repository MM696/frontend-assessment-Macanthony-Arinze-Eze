"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-neutral-900">
        Product unavailable
      </h1>
      <p className="mt-2 text-neutral-600">
        This product could not be loaded. It may have been removed or the link
        is invalid.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Back to catalog
        </Link>
      </div>
    </div>
  );
}
