import { CheckoutForm } from "@/components/bakery/checkout-form"

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 font-serif text-3xl text-foreground sm:text-4xl">Checkout</h1>
      <CheckoutForm />
    </main>
  )
}
