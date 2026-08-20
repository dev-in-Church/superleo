"use client";

import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "./cart-context";
import { calcSubtotal, formatKES } from "@/lib/pricing";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, setQuantity, removeItem, count } = useCart();
  const subtotal = calcSubtotal(items);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={open}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="flex items-center gap-2 font-serif text-lg text-card-foreground">
            <ShoppingBag className="size-5 text-primary" />
            Your Cart ({count})
          </h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <ShoppingBag className="mb-3 size-10 opacity-40" />
              <p>Your cart is empty.</p>
              <p className="text-sm">Add some fresh treats to get started.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-card-foreground">
                      {item.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatKES(item.price)} each
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        aria-label={`Decrease ${item.name}`}
                        onClick={() =>
                          setQuantity(item.productId, item.quantity - 1)
                        }
                        className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        aria-label={`Increase ${item.name}`}
                        onClick={() =>
                          setQuantity(item.productId, item.quantity + 1)
                        }
                        className="flex size-7 items-center justify-center rounded-md border border-border text-foreground hover:bg-muted"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-medium text-card-foreground">
                      {formatKES(item.price * item.quantity)}
                    </span>
                    <button
                      aria-label={`Remove ${item.name}`}
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border px-6 py-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-card-foreground">
                {formatKES(subtotal)}
              </span>
            </div>
            <p className="mb-3 text-xs text-muted-foreground">
              Delivery fee or pickup discount applied at checkout.
            </p>
            <Link
              href="/bakery/checkout"
              onClick={onClose}
              className={cn(buttonVariants(), "w-full")}
            >
              Proceed to checkout
            </Link>
          </footer>
        )}
      </aside>
    </>
  );
}
