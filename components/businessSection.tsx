import Link from "next/link";
import { ArrowRight, Droplets, Wheat } from "lucide-react";

const cards = [
  {
    href: "/dairy",
    tag: "For suppliers",
    title: "Dairy Management",
    description:
      "Record milk deliveries, track morning and evening collection sessions, and keep a clear history of your contribution.",
    cta: "Open supplier portal",
    icon: Droplets,
    card: "border-[#b7d3b6] bg-[#f0f7ec] hover:border-[#5a9960] hover:shadow-[#0a6b48]/10",
    iconBox: "bg-[#17372d] text-[#dceccd]",
    tagStyle: "bg-[#dceccd] text-[#36754b]",
    ctaStyle: "text-[#0a6b48]",
    watermark: "text-[#17372d]/[0.06]",
  },
  {
    href: "/bakery",
    tag: "For everyone",
    title: "Shop Bakery Products",
    description:
      "Browse bread, cakes, and pastries from the SuperLeo bakery and order what you need in a few taps.",
    cta: "Start shopping",
    icon: Wheat,
    card: "border-[#ecd3a8] bg-[#fdf4e3] hover:border-[#c98a2b] hover:shadow-[#c98a2b]/10",
    iconBox: "bg-[#6b3f1d] text-[#fde9c4]",
    tagStyle: "bg-[#fbe3b4] text-[#8a5a12]",
    ctaStyle: "text-[#8a4b12]",
    watermark: "text-[#6b3f1d]/[0.07]",
  },
];

export function BusinessesSection() {
  return (
    <section
      id="businesses"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-[.16em] text-[#5a9960]">
          Dairy &amp; Bakery
        </p>
        <h2 className="mt-3 text-balance text-3xl font-bold tracking-[-.04em] sm:text-4xl">
          Fresh from the farm, baked with care.
        </h2>
        <p className="mt-4 text-pretty text-base leading-7 text-[#71847a]">
          Supply milk through our dairy portal, or shop from the SuperLeo
          bakery. Pick where you want to start.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2">
        {cards.map(
          ({
            href,
            tag,
            title,
            description,
            cta,
            icon: Icon,
            card,
            iconBox,
            tagStyle,
            ctaStyle,
            watermark,
          }) => (
            <Link
              key={href}
              href={href}
              className={`group relative flex min-w-0 flex-col overflow-hidden rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48] sm:p-8 ${card}`}
            >
              {/* decorative watermark, clipped by the card so it never overflows */}
              <Icon
                aria-hidden
                className={`pointer-events-none absolute -bottom-8 -right-8 size-48 transition duration-300 group-hover:scale-110 sm:size-56 ${watermark}`}
                strokeWidth={1.25}
              />

              <div className="relative flex items-start justify-between gap-4">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${iconBox}`}
                >
                  <Icon className="size-6" />
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[.12em] ${tagStyle}`}
                >
                  {tag}
                </span>
              </div>

              <h3 className="relative mt-8 text-2xl font-bold tracking-tight">
                {title}
              </h3>
              <p className="relative mt-2 max-w-md text-sm leading-6 text-[#5f7268]">
                {description}
              </p>

              <span
                className={`relative mt-8 inline-flex items-center gap-2 text-sm font-bold ${ctaStyle}`}
              >
                {cta}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
