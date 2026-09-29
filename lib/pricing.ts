import type { CartItem, FulfillmentType } from "./types"

// Pickup gets a discount to incentivize collection; delivery adds a fee.
export const PICKUP_DISCOUNT_RATE = 0.05 // 5% off subtotal
export const DELIVERY_FEE = 150 // KES flat fee

export interface PriceBreakdown {
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

export function calcPricing(
  items: CartItem[],
  fulfillment: FulfillmentType,
): PriceBreakdown {
  const subtotal = calcSubtotal(items)
  const discount =
    fulfillment === "pickup" ? Math.round(subtotal * PICKUP_DISCOUNT_RATE) : 0
  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE : 0
  const total = subtotal - discount + deliveryFee
  return { subtotal, discount, deliveryFee, total }
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount)
}
