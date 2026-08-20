import { NextResponse } from "next/server"
import { backendFetch, isBackendConfigured } from "@/lib/api"
import { createStoredOrder, listStoredOrders } from "@/lib/order-store"
import { calcPricing } from "@/lib/pricing"
import { bakeryProducts } from "@/lib/mock/bakery"
import type { CartItem, FulfillmentType, Order, PaymentMethod } from "@/lib/types"

export async function GET() {
  if (isBackendConfigured()) {
    try {
      const data = await backendFetch<{ orders: Order[] }>("/api/bakery/orders")
      return NextResponse.json(data)
    } catch {
      // fall through
    }
  }
  return NextResponse.json({ orders: listStoredOrders(), source: "mock" })
}

interface CreateOrderBody {
  customerName: string
  customerPhone: string
  fulfillment: FulfillmentType
  address?: string
  scheduledDate: string
  scheduledTime: string
  paymentMethod: PaymentMethod
  items: CartItem[]
}

export async function POST(req: Request) {
  const body = (await req.json()) as CreateOrderBody

  // Server-side validation
  if (
    !body.customerName ||
    !body.customerPhone ||
    !body.scheduledDate ||
    !body.scheduledTime ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  if (body.fulfillment === "delivery" && !body.address) {
    return NextResponse.json({ error: "Delivery address required" }, { status: 400 })
  }

  // Recompute prices server-side from trusted catalog — never trust client prices.
  const priceMap = new Map(bakeryProducts.map((p) => [p.id, p.price]))
  const trustedItems: CartItem[] = []
  for (const item of body.items) {
    const price = priceMap.get(item.productId)
    const qty = Number(item.quantity)
    if (price == null) {
      return NextResponse.json({ error: `Unknown product ${item.productId}` }, { status: 400 })
    }
    if (!Number.isInteger(qty) || qty <= 0 || qty > 500) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }
    trustedItems.push({ productId: item.productId, name: item.name, price, quantity: qty })
  }

  const pricing = calcPricing(trustedItems, body.fulfillment)

  if (isBackendConfigured()) {
    try {
      const data = await backendFetch<{ order: Order }>("/api/bakery/orders", {
        method: "POST",
        body: { ...body, items: trustedItems },
      })
      return NextResponse.json(data, { status: 201 })
    } catch {
      // fall through to mock
    }
  }

  // Mock: create order + simulate an M-Pesa STK push if selected.
  const checkoutRequestId = `ws_CO_${Date.now()}`
  const order = createStoredOrder({
    customerName: body.customerName,
    customerPhone: body.customerPhone,
    fulfillment: body.fulfillment,
    address: body.address,
    scheduledDate: body.scheduledDate,
    scheduledTime: body.scheduledTime,
    paymentMethod: body.paymentMethod,
    items: trustedItems,
    subtotal: pricing.subtotal,
    discount: pricing.discount,
    deliveryFee: pricing.deliveryFee,
    total: pricing.total,
    status: "pending",
    paymentStatus: body.paymentMethod === "mpesa" ? "pending" : "success",
    checkoutRequestId: body.paymentMethod === "mpesa" ? checkoutRequestId : undefined,
  })

  return NextResponse.json({ order, source: "mock" }, { status: 201 })
}
