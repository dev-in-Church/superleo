import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { RegisterServiceWorker } from "@/components/pwa";
import "./globals.css";

export const metadata: Metadata = {
  title: "SuperLeo | Business Portal",
  description:
    "Track your SuperLeo dairy milk deliveries and collection history. Shop Bakery Products",
  generator: "SuperLeo",
  applicationName: "SuperLeo",
  appleWebApp: { capable: true, title: "SuperLeo", statusBarStyle: "default" },
  icons: {
    icon: "/icon.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#17372d",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <RegisterServiceWorker />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
