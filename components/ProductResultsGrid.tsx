import type { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";

const PRIORITY_COUNT = 2;

export type ProductResultsGridProps = {
  products: Product[];
};

export function ProductResultsGrid({ products }: ProductResultsGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < PRIORITY_COUNT}
          />
        </li>
      ))}
    </ul>
  );
}
