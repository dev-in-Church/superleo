import { ProductGrid } from "@/components/bakery/product-grid";
import type { BakeryProduct } from "@/lib/types";
import { bakeryProducts } from "@/lib/mock/bakery";

async function getProducts(): Promise<BakeryProduct[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const res = await fetch(`${base}/api/bakery/products`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    return data.products as BakeryProduct[];
  } catch {
    return bakeryProducts;
  }
}

export default async function BakeryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const products = await getProducts();
  const query = (await searchParams).search?.trim().toLowerCase() ?? "";
  const filteredProducts = query
    ? products.filter((product) =>
        `${product.name} ${product.description} ${product.category}`
          .toLowerCase()
          .includes(query),
      )
    : products;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <section className="mb-10">
        <span className="text-sm font-medium uppercase tracking-widest text-primary">
          Fresh daily
        </span>
        <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">
          The Bakery
        </h1>
        <p className="mt-3 max-w-xl text-pretty text-muted-foreground">
          Handmade doughnuts, sweet mandazi, artisan bread, and celebration
          cakes. Choose pickup for a discount, or have it delivered to your
          door.
        </p>
      </section>

      <ProductGrid products={filteredProducts} />
    </main>
  );
}
