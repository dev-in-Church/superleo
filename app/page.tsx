import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock3, Sparkles, Truck } from "lucide-react";
import { AdCarousel } from "@/components/marketplace/ad-carousel";
import { BusinessCard } from "@/components/marketplace/business-card";
import { STOREFRONT_HEADER_SPACE } from "@/components/storefront-header";
import { businesses } from "@/lib/mock/bakery";

const categories = [
  { label: "Fresh bakery", code: "BA", href: "/bakery" },
  { label: "Dairy & eggs", code: "DA", href: "#businesses" },
  { label: "Groceries", code: "GR", href: "#businesses" },
  { label: "Meat & poultry", code: "MP", href: "#businesses" },
  { label: "Drinks", code: "DR", href: "#businesses" },
];

export default function Page() {
  const activeCount = businesses.filter(
    (business) => business.status === "active",
  ).length;

  return (
    <main
      className={`${STOREFRONT_HEADER_SPACE} min-h-screen bg-background text-foreground pt-32`}
    >
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8 lg:pt-5">
        <div className="grid overflow-hidden rounded-sm bg-primary shadow-xl shadow-primary/10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="flex min-h-[225px] flex-col justify-center px-6 py-7 sm:min-h-[270px] sm:px-10 lg:min-h-[320px] lg:px-12">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground/75">
              <Sparkles className="size-3.5" /> SuperLeo Fresh Market
            </div>
            <h1 className="mt-3 max-w-xl text-balance font-serif text-4xl leading-[1.02] tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Everything your home loves, in one place.
            </h1>
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
              Fresh bakes, everyday essentials and trusted local businesses, all
              delivered simply.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-medium text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <Truck className="size-4" /> Same-day delivery
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" /> Fresh every morning
              </span>
            </div>
          </div>
          <AdCarousel />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">
            Shop by category
          </h2>
          <Link
            href="#businesses"
            className="hidden items-center gap-1 text-sm font-semibold text-primary sm:flex"
          >
            View all <ChevronRight className="size-4" />
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.label}
              href={category.href}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3.5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-xs font-bold tracking-wide text-primary">
                {category.code}
              </span>
              <span className="text-sm font-semibold group-hover:text-primary">
                {category.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="businesses"
        className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      >
        <div className="mb-5 flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              One marketplace
            </p>
            <h2 className="mt-1 font-serif text-3xl text-foreground">
              Explore our stores
            </h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {activeCount} open · {businesses.length - activeCount} coming soon
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard key={business.slug} business={business} />
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/superleo-logo.png"
              alt="SuperLeo"
              width={120}
              height={33}
              className="h-7 w-auto object-contain"
            />
            <span>Shop local. Shop SuperLeo.</span>
          </div>
          <span>Bomet, Kenya · © {new Date().getFullYear()} SuperLeo</span>
        </div>
      </footer>
    </main>
  );
}
