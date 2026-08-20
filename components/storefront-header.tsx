"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  MapPin,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/bakery/cart-context";

const links = [
  { label: "All categories", href: "/#businesses" },
  { label: "Bakery & cakes", href: "/bakery" },
  { label: "Groceries", href: "/#businesses" },
  { label: "Dairy", href: "/#businesses" },
  { label: "Meat & poultry", href: "/#businesses" },
  { label: "Drinks", href: "/#businesses" },
];

export function StorefrontHeader({ onCartClick }: { onCartClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { count } = useCart();

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed)
      window.location.href = `/bakery?search=${encodeURIComponent(trimmed)}`;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-card/95 shadow-sm backdrop-blur-md">
      <div className="bg-primary px-4 py-1.5 text-center text-[11px] font-semibold tracking-wide text-primary-foreground">
        Fresh picks, delivered across Bomet. Free delivery on orders over KSh
        3,000.
      </div>
      <div className="mx-auto flex h-[68px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-5 lg:px-8">
        <button
          className="rounded-md p-2 text-foreground lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        <Link href="/" className="shrink-0" aria-label="SuperLeo home">
          <Image
            src="/superleo-logo.png"
            alt="SuperLeo"
            width={178}
            height={48}
            priority
            className="h-9 w-auto object-contain sm:h-10"
          />
        </Link>
        <button className="hidden items-center gap-2 rounded-md px-2 py-2 text-left text-xs text-muted-foreground hover:bg-muted lg:flex">
          <MapPin className="size-4 text-primary" />
          <span>
            Deliver to <strong className="text-foreground">Bomet</strong>
          </span>
          <ChevronDown className="size-3.5" />
        </button>
        <form
          onSubmit={handleSearch}
          className="relative ml-auto flex min-w-0 flex-1 max-w-2xl"
        >
          <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <input
            aria-label="Search products and stores"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, stores and more..."
            className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </form>
        <Link
          href="/bakery"
          className="hidden text-sm font-semibold text-foreground hover:text-primary xl:block"
        >
          Explore bakery
        </Link>
        <button
          type="button"
          aria-label={`Shopping cart${count ? `, ${count} items` : ""}`}
          onClick={onCartClick}
          className="relative rounded-md p-2.5 text-foreground hover:bg-muted"
        >
          <ShoppingCart className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </button>
      </div>
      <nav
        className="hidden h-10 items-center gap-7 overflow-x-auto border-t border-border/70 px-4 text-sm sm:px-6 lg:flex lg:px-8"
        aria-label="Store categories"
      >
        {links.map((link, index) => (
          <Link
            key={link.label}
            href={link.href}
            className={
              index === 0
                ? "whitespace-nowrap font-semibold text-primary"
                : "whitespace-nowrap text-muted-foreground hover:text-primary"
            }
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {menuOpen && (
        <nav
          className="border-t border-border bg-card px-5 py-4 lg:hidden"
          aria-label="Mobile store categories"
        >
          <div className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export const STOREFRONT_HEADER_SPACE = "pt-[101px] lg:pt-[141px]";
