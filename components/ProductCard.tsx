"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/image-placeholder";
import type { Product } from "@/types/product";

export type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [imgSrc, setImgSrc] = useState(
    product.thumbnail || PRODUCT_IMAGE_PLACEHOLDER
  );

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:border-neutral-300 hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="flex flex-1 flex-col outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-neutral-900"
      >
        <div className="relative aspect-square w-full bg-neutral-100">
          <Image
            src={imgSrc}
            alt={product.title}
            width={400}
            height={400}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            priority={priority}
            onError={() => setImgSrc(PRODUCT_IMAGE_PLACEHOLDER)}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h2 className="line-clamp-2 text-base font-semibold text-neutral-900">
            {product.title}
          </h2>
          <p className="text-sm capitalize text-neutral-500">{product.category}</p>
          <p className="mt-auto pt-2 text-lg font-bold text-neutral-900">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </Link>
    </article>
  );
}
