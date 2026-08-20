"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  Store,
  Smartphone,
  Banknote,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "./cart-context";
import { calcPricing, formatKES, DELIVERY_FEE } from "@/lib/pricing";
import type { FulfillmentType, PaymentMethod } from "@/lib/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-card-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();

  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [payment, setPayment] = useState<PaymentMethod>("mpesa");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pricing = useMemo(
    () => calcPricing(items, fulfillment),
    [items, fulfillment],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!name || !phone || !date || !time) {
      setError("Please fill in all required fields.");
      return;
    }
    if (fulfillment === "delivery" && !address) {
      setError("Please provide a delivery address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bakery/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          fulfillment,
          address: fulfillment === "delivery" ? address : undefined,
          scheduledDate: date,
          scheduledTime: time,
          paymentMethod: payment,
          items,
        }),
      });
      if (!res.ok) throw new Error("Failed to place order");
      const data = await res.json();
      clear();
      router.push(`/bakery/order/${data.order.id}`);
    } catch {
      setError("Something went wrong placing your order. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-card-foreground">Your cart is empty.</p>
        <Button asChild className="mt-4">
          <Link href="/bakery">Browse the bakery</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
    >
      <div className="flex flex-col gap-8">
        {/* Fulfillment */}
        <fieldset>
          <legend className="mb-3 font-serif text-lg text-foreground">
            Fulfillment
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard
              active={fulfillment === "pickup"}
              onClick={() => setFulfillment("pickup")}
              icon={<Store className="size-5" />}
              title="Pickup"
              subtitle="5% off your order"
            />
            <OptionCard
              active={fulfillment === "delivery"}
              onClick={() => setFulfillment("delivery")}
              icon={<Truck className="size-5" />}
              title="Delivery"
              subtitle={`+${formatKES(DELIVERY_FEE)} fee`}
            />
          </div>
        </fieldset>

        {/* Details */}
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 font-serif text-lg text-foreground">
            Your details
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">Full name *</span>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                Phone (M-Pesa) *
              </span>
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="2547XXXXXXXX"
                inputMode="numeric"
              />
            </label>
          </div>
          {fulfillment === "delivery" && (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                Delivery address *
              </span>
              <input
                className={inputClass}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Estate, street, house no."
              />
            </label>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                Preferred {fulfillment} date *
              </span>
              <input
                type="date"
                className={inputClass}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium text-foreground">
                Preferred time *
              </span>
              <input
                type="time"
                className={inputClass}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        {/* Payment */}
        <fieldset>
          <legend className="mb-3 font-serif text-lg text-foreground">
            Payment method
          </legend>
          <div className="grid grid-cols-2 gap-3">
            <OptionCard
              active={payment === "mpesa"}
              onClick={() => setPayment("mpesa")}
              icon={<Smartphone className="size-5" />}
              title="M-Pesa"
              subtitle="STK push to your phone"
            />
            <OptionCard
              active={payment === "cash"}
              onClick={() => setPayment("cash")}
              icon={<Banknote className="size-5" />}
              title="Cash"
              subtitle="Pay on pickup/delivery"
            />
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="font-serif text-lg text-card-foreground">
          Order summary
        </h2>
        <ul className="mt-4 flex flex-col gap-2 border-b border-border pb-4 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-2">
              <span className="text-muted-foreground">
                {item.quantity} &times; {item.name}
              </span>
              <span className="text-card-foreground">
                {formatKES(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-2 text-sm">
          <Row label="Subtotal" value={formatKES(pricing.subtotal)} />
          {pricing.discount > 0 && (
            <Row
              label="Pickup discount"
              value={`-${formatKES(pricing.discount)}`}
              accent
            />
          )}
          {pricing.deliveryFee > 0 && (
            <Row label="Delivery fee" value={formatKES(pricing.deliveryFee)} />
          )}
        </dl>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span className="font-serif text-lg text-card-foreground">Total</span>
          <span className="font-serif text-xl font-semibold text-primary">
            {formatKES(pricing.total)}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" disabled={submitting} className="mt-6 w-full">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Placing order...
            </>
          ) : payment === "mpesa" ? (
            "Pay with M-Pesa"
          ) : (
            "Place order"
          )}
        </Button>
        <Link
          href="/bakery"
          className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Continue shopping
        </Link>
      </aside>
    </form>
  );
}

function OptionCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors",
        active
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-2 font-medium",
          active ? "text-primary" : "text-foreground",
        )}
      >
        {icon}
        {title}
      </span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "text-primary" : "text-card-foreground"}>
        {value}
      </dd>
    </div>
  );
}
