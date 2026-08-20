export type BusinessStatus = "active" | "coming-soon"

export interface Business {
  slug: string
  name: string
  tagline: string
  description: string
  status: BusinessStatus
  accent: string
  href: string
}

export type ProductCategory = "doughnuts" | "mandazi" | "bread" | "cakes"

export interface BakeryProduct {
  id: string
  name: string
  category: ProductCategory
  description: string
  price: number
  image: string
  available: boolean
}

export type FulfillmentType = "pickup" | "delivery"

export type PaymentMethod = "mpesa" | "cash"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
}

export type OrderStatus =
  | "pending"
  | "in_production"
  | "ready"
  | "out_for_delivery"
  | "completed"
  | "cancelled"

export type PaymentStatus = "pending" | "success" | "failed"

export interface Order {
  id: string
  customerName: string
  customerPhone: string
  fulfillment: FulfillmentType
  address?: string
  scheduledDate: string
  scheduledTime: string
  paymentMethod: PaymentMethod
  items: CartItem[]
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  checkoutRequestId?: string
  createdAt: string
}

export type UserRole =
  | "admin"
  | "production"
  | "delivery"
  | "sales"
  | "retailer"
  | "customer"

export interface InventoryItem {
  id: string
  name: string
  unit: string
  stock: number
  minLevel: number
  costPerUnit: number
}

export interface ProductionLog {
  id: string
  productId: string
  productName: string
  quantity: number
  date: string
  staff: string
}

export interface DeliveryStop {
  orderId: string
  customerName: string
  address: string
  lat: number
  lng: number
  sequence: number
}
