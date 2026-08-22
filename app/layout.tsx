import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { StorefrontShell } from "@/components/storefront-shell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Superleo",
  description: "Superleo — coming soon.",
  icons: "/icon.png",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#2f5d3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${fraunces.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <StorefrontShell>{children}</StorefrontShell>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
