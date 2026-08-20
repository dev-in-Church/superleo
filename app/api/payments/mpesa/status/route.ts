import { NextResponse } from "next/server"
import { backendFetch, isBackendConfigured } from "@/lib/api"
import { getStoredOrder, updatePaymentStatus } from "@/lib/order-store"

// Tracks first-poll time per checkout so the mock can "settle" after a delay,
// simulating the customer entering their M-Pesa PIN.
const g = globalThis as unknown as { __mpesaPolls?: Map<string, number> }
function polls() {
  if (!g.__mpesaPolls) g.__mpesaPolls = new Map()
  return g.__mpesaPolls
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const checkoutRequestId = searchParams.get("checkoutRequestId")
  if (!checkoutRequestId) {
    return NextResponse.json({ error: "checkoutRequestId required" }, { status: 400 })
  }

  if (isBackendConfigured()) {
    try {
      const data = await backendFetch<{ status: string }>(
        `/api/payments/mpesa/status?checkoutRequestId=${checkoutRequestId}`,
      )
      return NextResponse.json(data)
    } catch {
      // fall through
    }
  }

  // Mock: resolve to success ~5s after the first status poll.
  const map = polls()
  const first = map.get(checkoutRequestId)
  const now = Date.now()
  if (!first) {
    map.set(checkoutRequestId, now)
    return NextResponse.json({ status: "pending", source: "mock" })
  }
  if (now - first >= 5000) {
    updatePaymentStatus(checkoutRequestId, "success")
    return NextResponse.json({ status: "success", source: "mock" })
  }
  const order = getStoredOrder(checkoutRequestId)
  return NextResponse.json({ status: order?.paymentStatus ?? "pending", source: "mock" })
}
