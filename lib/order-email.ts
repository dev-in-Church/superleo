import type { Order } from "@/lib/types"

export async function notifyOrderRequest(order: Order) {
  const apiKey = process.env.RESEND_API_KEY
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL

  if (!apiKey || !recipient) {
    return { sent: false, reason: "Resend is not configured" }
  }

  const items = order.items
    .map((item) => `<li>${item.quantity} × ${escapeHtml(item.name)} — ${formatKES(item.price * item.quantity)}</li>`)
    .join("")

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `order-request/${order.id}`,
    },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || "Superleo Bakery <onboarding@resend.dev>",
      to: [recipient],
      subject: `New bakery order request ${order.id}`,
      html: `<h2>New order request ${order.id}</h2><p><strong>${escapeHtml(order.customerName)}</strong> · ${escapeHtml(order.customerPhone)}</p><p>${order.fulfillment === "delivery" ? `Delivery to: ${escapeHtml(order.address || "")}` : "Pickup"}</p><p>Requested for ${escapeHtml(order.scheduledDate)} at ${escapeHtml(order.scheduledTime)}</p><ul>${items}</ul><p><strong>Total: ${formatKES(order.total)}</strong></p>`,
    }),
  })

  if (!response.ok) {
    const message = await response.text()
    console.error("[v0] Resend order notification failed:", message)
    return { sent: false, reason: "Resend rejected the email" }
  }

  return { sent: true }
}

function formatKES(amount: number) {
  return `KES ${amount.toLocaleString("en-KE")}`
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character)
}
