"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Check } from "lucide-react"
import type { BakeryProduct, ProductCategory } from "@/lib/types"
import { formatKES } from "@/lib/pricing"
import { useCart } from "./cart-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const CATEGORIES: { value: ProductCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "doughnuts", label: "Doughnuts" },
  { value: "mandazi", label: "Mandazi" },
  { value: "bread", label: "Bread" },
  { value: "cakes", label: "Cakes" },
]

export function ProductGrid({ products }: { products: BakeryProduct[] }) {
  const [category, setCategory] = useState<ProductCategory | "all">("all")
  const { addItem } = useCart()
  const [added, setAdded] = useState<string | null>(null)

  const filtered =
    category === "all" ? products : products.filter((p) => p.category === category)

  function handleAdd(product: BakeryProduct) {
    addItem(product)
    setAdded(product.id)
    setTimeout(() => setAdded((cur) => (cur === product.id ? null : cur)), 1000)
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              category === cat.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif text-lg text-card-foreground">{product.name}</h3>
                <span className="whitespace-nowrap font-semibold text-primary">
                  {formatKES(product.price)}
                </span>
              </div>
              <p className="mt-1 flex-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              <Button
                onClick={() => handleAdd(product)}
                variant={added === product.id ? "secondary" : "default"}
                className="mt-4 w-full"
              >
                {added === product.id ? (
                  <>
                    <Check className="size-4" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="size-4" /> Add to cart
                  </>
                )}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
