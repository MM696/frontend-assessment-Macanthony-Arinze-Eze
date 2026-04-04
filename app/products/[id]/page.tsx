import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ProductDetailImage } from "@/components/ProductDetailImage";
import { getProductById } from "@/lib/product-detail";

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return { title: "Product" };
  }
  try {
    const product = await getProductById(id);
    const description =
      product.description.length > 160
        ? `${product.description.slice(0, 157)}…`
        : product.description;
    return {
      title: product.title,
      description,
      openGraph: {
        title: product.title,
        description,
        images: [
          {
            url: product.thumbnail,
            width: 800,
            height: 800,
            alt: product.title,
          },
        ],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

async function ProductDetailBody({ id }: { id: number }) {
  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return (
    <article className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: product.title },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-sm">
          <ProductDetailImage
            src={product.thumbnail}
            alt={product.title}
          />
        </div>

        <div className="space-y-4">
          <header>
            <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">
              {product.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 lg:text-4xl">
              {product.title}
            </h1>
            <p className="mt-4 text-3xl font-semibold text-neutral-900">
              ${product.price.toFixed(2)}
            </p>
          </header>

          <section aria-labelledby="product-description">
            <h2 id="product-description" className="sr-only">
              Description
            </h2>
            <p className="leading-relaxed text-neutral-700">
              {product.description}
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}

function ProductDetailFallback() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="h-4 w-56 animate-pulse rounded bg-neutral-200" />
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="aspect-square max-w-lg animate-pulse rounded-2xl bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-10 w-4/5 animate-pulse rounded-lg bg-neutral-200" />
          <div className="h-6 w-28 animate-pulse rounded bg-neutral-200" />
          <div className="h-24 w-full animate-pulse rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    notFound();
  }

  return (
    <main>
      <Suspense fallback={<ProductDetailFallback />}>
        <ProductDetailBody id={id} />
      </Suspense>
    </main>
  );
}
