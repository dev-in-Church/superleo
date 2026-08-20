"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const ads = [
  {
    image: "/bakery/doughnuts.png",
    eyebrow: "Weekend treat",
    title: "Sweeten the weekend",
    body: "Fresh doughnuts from KSh 120",
    href: "/bakery",
    color: "bg-[#d9b98c]",
  },
  {
    image: "/bakery/cakes.png",
    eyebrow: "Made to celebrate",
    title: "Cakes worth sharing",
    body: "Order your perfect cake today",
    href: "/bakery",
    color: "bg-[#e6c8b8]",
  },
  {
    image: "/bakery/bread.png",
    eyebrow: "Baked this morning",
    title: "Good bread, good day",
    body: "Warm loaves delivered fresh",
    href: "/bakery",
    color: "bg-[#c7a36b]",
  },
];

export function AdCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % ads.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, []);

  const ad = ads[active];
  return (
    <div
      className={`relative min-h-[225px] overflow-hidden ${ad.color} sm:min-h-[270px]`}
    >
      <div className="absolute inset-0 bg-black/5" />
      <Image
        key={ad.image}
        src={ad.image}
        alt=""
        fill
        className="object-cover object-center transition-opacity duration-500"
        priority={active === 0}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" />
      <div className="relative z-10 flex h-full min-h-[225px] flex-col justify-center px-7 py-7 text-primary-foreground sm:min-h-[270px] sm:px-10">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/80">
          <Sparkles className="size-3.5" /> {ad.eyebrow}
        </div>
        <h2 className="mt-2 max-w-xs font-serif text-3xl leading-none sm:text-4xl">
          {ad.title}
        </h2>
        <p className="mt-3 text-sm text-primary-foreground/85">{ad.body}</p>
        <Link
          href={ad.href}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground hover:bg-card"
        >
          Shop now <ArrowRight className="size-3.5" />
        </Link>
      </div>
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5">
        <button
          aria-label="Previous promotion"
          onClick={() => setActive((active - 1 + ads.length) % ads.length)}
          className="rounded-full bg-card/75 p-1.5 text-foreground hover:bg-card"
        >
          <ChevronLeft className="size-4" />
        </button>
        {ads.map((item, index) => (
          <button
            key={item.title}
            aria-label={`Show promotion ${index + 1}`}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${index === active ? "w-6 bg-card" : "w-1.5 bg-card/55"}`}
          />
        ))}
        <button
          aria-label="Next promotion"
          onClick={() => setActive((active + 1) % ads.length)}
          className="rounded-full bg-card/75 p-1.5 text-foreground hover:bg-card"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
