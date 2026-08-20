import { NextResponse } from "next/server"
import { updatePaymentStatus } from "@/lib/order-store"

// Safaricom Daraja posts the STK Push result here in production.
// In this deployment the Express backend owns the real callback; this route
// exists so the storefront can also receive callbacks if pointed here.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const stk = body?.Body?.stkCallback
    if (!stk) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Ignored" })
    }
    const checkoutRequestId = stk.CheckoutRequestID as string
    const resultCode = Number(stk.ResultCode)
    updatePaymentStatus(checkoutRequestId, resultCode === 0 ? "success" : "failed")
  } catch {
    // Always ack so Safaricom does not retry indefinitely.
  }
  // Daraja expects this exact acknowledgement shape.
  return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" })
}
