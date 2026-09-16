import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { StorefrontShell } from "@/components/storefront-shell";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" className={`light ${sora.variable} bg-background`}>
      <body className="font-sans antialiased">
        <StorefrontShell>{children}</StorefrontShell>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
