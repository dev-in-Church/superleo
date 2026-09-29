// In-memory order store for the PREVIEW ONLY (mock fallback path).
// In production, the Next.js API routes proxy to the Express backend and this
// store is never used. Kept on globalThis so it survives module reloads in dev.

import type { Order, PaymentStatus } from "./types"
import { sampleOrders } from "./mock/bakery"

interface Store {
  orders: Map<string, Order>
  seq: number
}

const g = globalThis as unknown as { __superleoStore?: Store }

function getStore(): Store {
  if (!g.__superleoStore) {
    const orders = new Map<string, Order>()
    for (const o of sampleOrders) orders.set(o.id, o)
    g.__superleoStore = { orders, seq: 2000 }
  }
  return g.__superleoStore
}

export function getStoredOrder(id: string): Order | undefined {
  return getStore().orders.get(id)
}

export function listStoredOrders(): Order[] {
  return Array.from(getStore().orders.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  )
}

export function createStoredOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const store = getStore()
  store.seq += 1
  const full: Order = {
    ...order,
    id: `ORD-${store.seq}`,
    createdAt: new Date().toISOString(),
  }
  store.orders.set(full.id, full)
  return full
}

export function updatePaymentStatus(
  checkoutRequestId: string,
  status: PaymentStatus,
): Order | undefined {
  const store = getStore()
  for (const order of store.orders.values()) {
    if (order.checkoutRequestId === checkoutRequestId || order.id === checkoutRequestId) {
      order.paymentStatus = status
      return order
    }
  }
  return undefined
}
