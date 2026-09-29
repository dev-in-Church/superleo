"use client"

import { createContext, useContext, useState, useCallback, useMemo } from "react"
import type { BakeryProduct, CartItem } from "@/lib/types"

interface CartContextValue {
  items: CartItem[]
  count: number
  addItem: (product: BakeryProduct) => void
  removeItem: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((product: BakeryProduct) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        )
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, price: product.price, quantity: 1 },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    )
  }, [])

  const clear = useCallback(() => setItems([]), [])

  const count = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  const value = useMemo(
    () => ({ items, count, addItem, removeItem, setQuantity, clear }),
    [items, count, addItem, removeItem, setQuantity, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within a CartProvider")
  return ctx
}
