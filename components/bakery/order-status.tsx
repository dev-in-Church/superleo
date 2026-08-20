"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Smartphone,
} from "lucide-react";
import type { Order, PaymentStatus } from "@/lib/types";
import { formatKES } from "@/lib/pricing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STATUS_STEPS: { key: Order["status"]; label: string }[] = [
  { key: "pending", label: "Order placed" },
  { key: "in_production", label: "In production" },
  { key: "ready", label: "Ready" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "completed", label: "Completed" },
];

export function OrderStatus({ initialOrder }: { initialOrder: Order }) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    initialOrder.paymentStatus,
  );

  useEffect(() => {
    if (order.paymentMethod !== "mpesa" || paymentStatus !== "pending") return;

    let active = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payments/mpesa/status?checkoutRequestId=${order.checkoutRequestId ?? order.id}`,
          { cache: "no-store" },
        );
        if (!res.ok) return;
        const data = await res.json();
        if (active && data.status && data.status !== "pending") {
          setPaymentStatus(data.status);
          clearInterval(interval);
        }
      } catch {
        // keep polling
      }
    }, 2500);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [order, paymentStatus]);

  const currentStepIndex = STATUS_STEPS.findIndex(
    (s) => s.key === order.status,
  );

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <PaymentBadge status={paymentStatus} method={order.paymentMethod} />
          <h1 className="mt-4 font-serif text-2xl text-card-foreground">
            Order {order.id}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you, {order.customerName}. We&apos;ve received your order.
          </p>
        </div>

        {/* Payment status message */}
        {order.paymentMethod === "mpesa" && (
          <div className="mt-6 rounded-lg bg-muted p-4 text-center text-sm">
            {paymentStatus === "pending" && (
              <p className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Check your phone and enter your M-Pesa PIN to complete
                payment...
              </p>
            )}
            {paymentStatus === "success" && (
              <p className="font-medium text-primary">
                Payment received. Karibu!
              </p>
            )}
            {paymentStatus === "failed" && (
              <p className="text-destructive">
                Payment failed or was cancelled. Please contact us to retry.
              </p>
            )}
          </div>
        )}

        {/* Progress */}
        <div className="mt-8">
          <ol className="flex flex-col gap-4">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              return (
                <li key={step.key} className="flex items-center gap-3">
                  <span
                    className={`flex size-6 items-center justify-center rounded-full text-xs ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : i + 1}
                  </span>
                  <span
                    className={
                      done ? "text-card-foreground" : "text-muted-foreground"
                    }
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Details */}
        <dl className="mt-8 grid gap-3 border-t border-border pt-6 text-sm">
          <Row
            label="Fulfillment"
            value={order.fulfillment === "pickup" ? "Pickup" : "Delivery"}
          />
          {order.address && <Row label="Address" value={order.address} />}
          <Row
            label="Scheduled"
            value={`${order.scheduledDate} at ${order.scheduledTime}`}
          />
          <Row
            label="Items"
            value={`${order.items.reduce((s, i) => s + i.quantity, 0)} items`}
          />
          <Row label="Total" value={formatKES(order.total)} strong />
        </dl>

        <Button asChild className="mt-8 w-full">
          <Link href="/bakery">Back to bakery</Link>
        </Button>
      </div>
    </div>
  );
}

function PaymentBadge({
  status,
  method,
}: {
  status: PaymentStatus;
  method: Order["paymentMethod"];
}) {
  if (method === "cash") {
    return (
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Clock className="size-7" />
      </span>
    );
  }
  if (status === "success") {
    return (
      <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="size-7" />
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="size-7" />
      </span>
    );
  }
  return (
    <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Smartphone className="size-7" />
    </span>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={
          strong ? "font-semibold text-primary" : "text-card-foreground"
        }
      >
        {value}
      </dd>
    </div>
  );
}
