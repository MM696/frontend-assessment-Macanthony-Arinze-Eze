"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export type SearchBarProps = {
  /** Current query from the URL (controlled source of truth). */
  urlQuery: string;
  /** Called when the debounced input differs from what should be applied to the URL. */
  onDebouncedQuery: (query: string) => void;
  debounceMs?: number;
  id?: string;
};

export function SearchBar({
  urlQuery,
  onDebouncedQuery,
  debounceMs = 300,
  id = "product-search",
}: SearchBarProps) {
  const [input, setInput] = useState(urlQuery);
  const debounced = useDebounce(input, debounceMs);

  useEffect(() => {
    setInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (debounced !== input) return;
    const next = debounced.trim();
    if (next === urlQuery.trim()) return;
    onDebouncedQuery(next);
  }, [debounced, input, onDebouncedQuery, urlQuery]);

  return (
    <div className="w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        name="q"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search by title or description…"
        autoComplete="off"
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 shadow-sm outline-none ring-offset-2 transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400"
      />
    </div>
  );
}
