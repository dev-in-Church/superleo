import { NextResponse } from "next/server"
import { backendFetch, isBackendConfigured } from "@/lib/api"
import { bakeryProducts } from "@/lib/mock/bakery"
import type { BakeryProduct } from "@/lib/types"

export async function GET() {
  if (isBackendConfigured()) {
    try {
      const data = await backendFetch<{ products: BakeryProduct[] }>("/api/bakery/products")
      return NextResponse.json(data)
    } catch {
      // fall through to mock
    }
  }
  return NextResponse.json({ products: bakeryProducts, source: "mock" })
}
