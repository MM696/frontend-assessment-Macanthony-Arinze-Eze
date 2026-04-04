import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/types/product";

vi.mock("next/image", () => ({
  default: ({
    alt,
    src,
    priority: _p,
    ...rest
  }: {
    alt: string;
    src: string;
    priority?: boolean;
    [key: string]: unknown;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={typeof src === "string" ? src : ""} {...rest} />
  ),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    prefetch?: boolean;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const product: Product = {
  id: 1,
  title: "Test Product",
  description: "A sample item for tests.",
  price: 99.5,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  category: "electronics",
  thumbnail: "https://cdn.dummyjson.com/product-images/1/thumbnail.jpg",
  images: [],
};

describe("ProductCard", () => {
  it("renders title, image, price, and category", () => {
    render(<ProductCard product={product} />);

    expect(
      screen.getByRole("heading", { name: product.title })
    ).toBeInTheDocument();
    expect(screen.getByRole("img", { name: product.title })).toHaveAttribute(
      "src",
      product.thumbnail
    );
    expect(screen.getByText("$99.50")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });
});
