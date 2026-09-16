"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, Check } from "lucide-react";
import type { BakeryProduct, ProductCategory } from "@/lib/types";
import { formatKES } from "@/lib/pricing";
import { useCart } from "./cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WhatsAppOrderButton } from "../whatsapp-order-button";

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "doughnuts", label: "Doughnuts" },
  { value: "mandazi", label: "Mandazi" },
  { value: "bread", label: "Bread" },
  { value: "cakes", label: "Cakes" },
];

export function ProductGrid({ products }: { products: BakeryProduct[] }) {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const { addItem } = useCart();
  const [added, setAdded] = useState<string | null>(null);

  const filtered =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);

  function handleAdd(product: BakeryProduct) {
    addItem(product);
    setAdded(product.id);
    setTimeout(
      () => setAdded((cur) => (cur === product.id ? null : cur)),
      1000,
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
              category === cat.value
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium capitalize text-card-foreground shadow-sm backdrop-blur-sm">
                {product.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-balance font-serif text-lg leading-snug text-card-foreground">
                  {product.name}
                </h3>
                <span className="whitespace-nowrap rounded-full bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
                  {formatKES(product.price)}
                </span>
              </div>

              <p className="mt-1.5 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => handleAdd(product)}
                  variant={added === product.id ? "secondary" : "default"}
                  className="w-full transition-all"
                >
                  {added === product.id ? (
                    <>
                      <Check className="size-4" /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="size-4" /> Add to cart
                    </>
                  )}
                </Button>

                <WhatsAppOrderButton product={product} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
