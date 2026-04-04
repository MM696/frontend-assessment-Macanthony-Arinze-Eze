"use client";

import type { ProductCategory } from "@/types/product";

export type FiltersProps = {
  categories: ProductCategory[];
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  id?: string;
};

export function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  id = "category-filter",
}: FiltersProps) {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700">
        Category
      </label>
      <select
        id={id}
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 shadow-sm outline-none ring-offset-2 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-400"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
