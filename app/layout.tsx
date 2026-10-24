import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SuperLeo | Supplier Portal',
  description: 'Track your SuperLeo dairy milk deliveries and collection history.',
  generator: 'SuperLeo',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#17372d',
  userScalable: false,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
