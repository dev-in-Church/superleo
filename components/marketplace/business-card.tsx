import Link from "next/link";
import {
  ArrowUpRight,
  Croissant,
  Milk,
  Beef,
  ShoppingBasket,
  CupSoda,
} from "lucide-react";
import type { Business } from "@/lib/types";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  bakery: Croissant,
  dairy: Milk,
  butchery: Beef,
  grocer: ShoppingBasket,
  beverages: CupSoda,
};

export function BusinessCard({ business }: { business: Business }) {
  const Icon = ICONS[business.slug] ?? ShoppingBasket;
  const isActive = business.status === "active";

  const inner = (
    <div
      className={cn(
        "group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 transition-all",
        isActive
          ? "border-primary/30 hover:border-primary hover:shadow-lg hover:shadow-primary/10"
          : "border-border opacity-80",
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className="flex size-12 items-center justify-center rounded-lg text-primary-foreground"
          style={{ backgroundColor: business.accent }}
        >
          <Icon className="size-6" />
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            isActive
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          {isActive ? "Open now" : "Coming soon"}
        </span>
      </div>

      <div className="mt-6">
        <h3 className="font-serif text-xl text-card-foreground">
          {business.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-primary">
          {business.tagline}
        </p>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
          {business.description}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-1 text-sm font-medium">
        {isActive ? (
          <>
            <span className="text-card-foreground">Visit store</span>
            <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        ) : (
          <span className="text-muted-foreground">Launching soon</span>
        )}
      </div>
    </div>
  );

  if (isActive) {
    return (
      <Link href={business.href} className="block h-full">
        {inner}
      </Link>
    );
  }
  return <div className="h-full cursor-not-allowed">{inner}</div>;
}
