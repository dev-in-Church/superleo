"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Banner = {
  src: string; // files live in /public/banners
  alt: string;
  href?: string; // optional click-through
};

const BANNERS: Banner[] = [
  { src: "/banners/banner-1.png", alt: "Banner 1", href: "/dairy" },
  { src: "/banners/banner-2.png", alt: "Banner 2", href: "/dairy" },
  { src: "/banners/banner-3.png", alt: "Banner 3" },
  // { src: "/banners/banner-4.jpg", alt: "Banner 4" },
];

// Natural size of the banner artwork. The slider uses this exact ratio at every
// screen size, so nothing is ever cropped and the height scales with the width.
const IMG_W = 2089;
const IMG_H = 753;
const INTERVAL_MS = 5000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const count = BANNERS.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearTimeout(t);
  }, [index, paused, count]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured banners"
      className="mx-auto w-full max-w-7xl overflow-hidden px-3 py-3 sm:px-6 sm:py-4 lg:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <div
        className="group relative w-full touch-pan-y select-none overflow-hidden rounded-xl bg-slate-200 sm:rounded-2xl"
        style={{ aspectRatio: `${IMG_W} / ${IMG_H}` }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
          setPaused(true);
        }}
        onTouchEnd={(e) => {
          setPaused(false);
          if (touchStartX.current === null || touchStartY.current === null)
            return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const dy = e.changedTouches[0].clientY - touchStartY.current;
          // only treat mostly-horizontal gestures as a swipe
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            go(index + (dx < 0 ? 1 : -1));
          }
          touchStartX.current = touchStartY.current = null;
        }}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {BANNERS.map((b, i) => {
            const img = (
              <Image
                src={b.src}
                alt={b.alt}
                fill
                priority={i === 0}
                draggable={false}
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover"
              />
            );
            return (
              <div
                key={b.src}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={i !== index}
                className="relative h-full w-full min-w-0 shrink-0 basis-full"
              >
                {b.href ? (
                  <Link
                    href={b.href}
                    tabIndex={i === index ? 0 : -1}
                    className="absolute inset-0 block"
                  >
                    {img}
                  </Link>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100 md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 opacity-0 shadow transition group-hover:opacity-100 focus-visible:opacity-100 md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Pill indicator: smaller on phones so it never covers the artwork */}
            <div className="absolute bottom-1.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/25 px-2 py-1 backdrop-blur-sm sm:bottom-3 sm:gap-2 sm:px-3 sm:py-1.5">
              {BANNERS.map((b, i) => (
                <button
                  key={b.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full bg-white transition-all duration-300 motion-reduce:transition-none sm:h-2 ${
                    i === index
                      ? "w-5 sm:w-7"
                      : "w-1.5 opacity-60 hover:opacity-100 sm:w-2"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
