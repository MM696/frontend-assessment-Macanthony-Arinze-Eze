"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGE_PLACEHOLDER } from "@/lib/image-placeholder";

export type ProductDetailImageProps = {
  src: string;
  alt: string;
};

export function ProductDetailImage({ src, alt }: ProductDetailImageProps) {
  const [current, setCurrent] = useState(src || PRODUCT_IMAGE_PLACEHOLDER);

  return (
    <Image
      src={current}
      alt={alt}
      width={800}
      height={800}
      priority
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="h-full w-full object-contain p-4"
      onError={() => setCurrent(PRODUCT_IMAGE_PLACEHOLDER)}
    />
  );
}
