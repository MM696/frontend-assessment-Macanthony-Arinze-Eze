import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Filters } from "@/components/Filters";
import type { ProductCategory } from "@/types/product";

const categories: ProductCategory[] = [
  { slug: "beauty", name: "Beauty", url: "https://dummyjson.com/..." },
  { slug: "laptops", name: "Laptops", url: "https://dummyjson.com/..." },
];

describe("Filters", () => {
  it("renders human-readable names and uses slug as value", () => {
    const onCategoryChange = vi.fn();
    render(
      <Filters
        categories={categories}
        selectedCategory=""
        onCategoryChange={onCategoryChange}
      />
    );

    expect(screen.getByRole("option", { name: "Beauty" })).toHaveValue(
      "beauty"
    );
    expect(screen.getByRole("option", { name: "Laptops" })).toHaveValue(
      "laptops"
    );
  });

  it("notifies parent with slug when selection changes", () => {
    const onCategoryChange = vi.fn();
    render(
      <Filters
        categories={categories}
        selectedCategory=""
        onCategoryChange={onCategoryChange}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "laptops" },
    });

    expect(onCategoryChange).toHaveBeenCalledWith("laptops");
  });
});
