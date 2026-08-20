"use client";

import { useState } from "react";
import { StorefrontHeader } from "@/components/storefront-header";
import { CartProvider } from "@/components/bakery/cart-context";
import { CartDrawer } from "@/components/bakery/cart-drawer";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <StorefrontHeader onCartClick={() => setCartOpen(true)} />
      {children}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </CartProvider>
  );
}
