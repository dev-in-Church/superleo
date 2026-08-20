import { notFound } from "next/navigation"
import { OrderStatus } from "@/components/bakery/order-status"
import { getStoredOrder } from "@/lib/order-store"

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = getStoredOrder(id)

  if (!order) notFound()

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <OrderStatus initialOrder={order} />
    </main>
  )
}
