import type { Metadata } from "next";

// Standalone page: nothing in the site links here, and search engines are told
// not to index it. Share the URL (or a QR code) directly.
export const metadata: Metadata = {
  title: "Menu | SuperLeo Restaurant",
  description: "SuperLeo Restaurant official food and beverage menu.",
  robots: { index: false, follow: false },
};

const LOGO =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/superleo-Qcna9ovPl4HLITmsrTIfNSJelc9ykc.png";

type Item = { name: string; price: number };
type Section = { id: string; title: string; short: string; items: Item[] };

const sections: Section[] = [
  {
    id: "snacks",
    title: "Snacks & Beverages",
    short: "Snacks & Beverages",
    items: [
      { name: "Mandazi", price: 20 },
      { name: "Chapati", price: 20 },
      { name: "Mahamri", price: 20 },
      { name: "Toast Mayai", price: 40 },
      { name: "Doughnut", price: 20 },
      { name: "Samosa", price: 10 },
      { name: "Tea (cup)", price: 30 },
      { name: "Tea (glass)", price: 20 },
      { name: "Fresh Milk", price: 35 },
      { name: "Maziwa Mala", price: 40 },
      // { name: "Nofu", price: 30 },
      { name: "Soda (300ml)", price: 40 },
      { name: "Soda (500ml)", price: 70 },
      { name: "Fries (Chipo) Half", price: 50 },
      { name: "Fries (Chipo) Full", price: 100 },
    ],
  },
  {
    id: "ugali",
    title: "Traditional Ugali Meals",
    short: "Ugali Meals",
    items: [
      { name: "Ugali with Vegetables (Mboga)", price: 70 },
      { name: "Ugali with Traditional Greens (Kienyeji)", price: 100 },
      { name: "Ugali/Beef", price: 180 },
      { name: "Ugali/Matumbo", price: 150 },
      { name: "Ugali Combo with Greens (Mix Kienyeji)", price: 130 },
      { name: "Ugali Combo with Beef (Mix Nyama)", price: 150 },
      { name: "Plain Ugali", price: 50 },
    ],
  },
  {
    id: "rice-beans",
    title: "Rice, Beans & Legume Mains",
    short: "Rice & Beans",
    items: [
      { name: "Githeri", price: 50 },
      { name: "Rice Plain", price: 50 },
      { name: "Rice & Beans", price: 100 },
      { name: "Rice & Ndengu / Lentils", price: 80 },
      { name: "Chapati & Ndengu", price: 80 },
      { name: "Chapati & Beans", price: 90 },
    ],
  },
];

export default function RestaurantMenuPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f9f5] text-[#17372d]">
      {/* Brand */}
      <header className="px-4 pb-6 pt-10 text-center sm:pt-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO}
          alt="SuperLeo"
          className="mx-auto h-auto w-44 sm:w-56"
        />
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[.45em] text-[#17372d] sm:text-xs">
          Restaurant
        </p>
        <p className="mt-5 text-sm text-[#a89870] sm:text-base">
          Official Food &amp; Beverage Menu
        </p>
      </header>

      {/* Jump links */}
      <nav
        aria-label="Menu sections"
        className="sticky top-0 z-10 border-y border-[#dce6dd] bg-[#f7f9f5]/90 backdrop-blur"
      >
        <ul className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:justify-center [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                className="block rounded-full border border-[#c8d8cb] bg-white px-4 py-1.5 text-sm font-semibold transition hover:border-[#5a9960] hover:text-[#0a6b48] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48]"
              >
                {section.short}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu */}
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-8 sm:gap-6 sm:py-10">
        {sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="scroll-mt-20 rounded-3xl border border-[#dce6dd] bg-white p-5 sm:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                id={`${section.id}-title`}
                className="text-lg font-bold text-[#1f4a35] sm:text-xl"
              >
                {section.title}
              </h2>
              <span className="shrink-0 rounded-full bg-[#eef6eb] px-3 py-1 text-xs font-bold text-[#3e7c48]">
                {section.items.length} items
              </span>
            </div>
            <div className="mt-3 h-px bg-[#d9c9a3]" />

            <ul className="mt-2">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline gap-3 py-2.5"
                >
                  <span className="min-w-0 text-[15px]">{item.name}</span>
                  <span
                    aria-hidden
                    className="min-w-4 flex-1 -translate-y-1 border-b border-dotted border-[#c8d8cb]"
                  />
                  <span className="shrink-0 text-[15px] font-bold tabular-nums">
                    KSh {item.price}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="pb-6 text-center text-xs text-[#809087]">
          All prices are in Kenya Shillings (KSh).
        </p>
      </div>
    </main>
  );
}
