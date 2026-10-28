"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Cake,
  Clock,
  Cookie,
  Wheat,
  CheckCircle2,
  ChevronRight,
  Droplets,
  LogOut,
  Menu,
  ShieldCheck,
  Truck,
  User,
  X,
  ClipboardCheck,
  History,
  Sunrise,
  Sunset,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import useSWR from "swr";
import { apiRequest, authApi, supplierApi } from "@/lib/api";
import HeroSlider from "./heroSlider";
import { BusinessesSection } from "./businessSection";

export const logoUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/superleo-Qcna9ovPl4HLITmsrTIfNSJelc9ykc.png";

export function SiteHeader() {
  const navLinks = [
    { href: "/", label: "Home", match: (p: string) => p === "/" },
    {
      href: "/dairy",
      label: "Dairy Management",
      match: (p: string) => p.startsWith("/dairy"),
    },
    {
      href: "/bakery",
      label: "Bakery",
      match: (p: string) => p.startsWith("/bakery"),
    },
  ];

  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // The account / sign-in option only exists on dairy pages
  // (/dairy, /dairy/login, /dairy/register, /dairy/supplier, ...).
  const isDairy = pathname === "/dairy" || pathname.startsWith("/dairy/");

  // A null key means SWR doesn't fetch, so other pages never hit /auth/me.
  const { data: user } = useSWR(
    isDairy ? "/auth/me" : null,
    () => authApi.me(),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const name = isDairy ? user?.full_name || undefined : undefined;

  function logout() {
    sessionStorage.removeItem("superleo_token");
    window.location.href = "/dairy/login";
  }

  // Close menus whenever the route changes
  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Close the account dropdown on outside click or Escape
  useEffect(() => {
    if (!accountOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node))
        setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48]";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#dce6dd]/80 bg-[#f7f9f5]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link
          href="/"
          aria-label="SuperLeo home"
          className={`shrink-0 rounded-lg ${focusRing}`}
        >
          <img src={logoUrl} alt="SuperLeo" className="h-auto w-32 sm:w-40" />
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label="Main"
          className="hidden items-center gap-1 text-sm font-semibold text-[#64766b] md:flex"
        >
          {navLinks.map(({ href, label, match }) => {
            const active = match(pathname);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 transition ${focusRing} ${
                  active
                    ? "bg-[#dceccd] text-[#0a6b48]"
                    : "hover:bg-[#eef5e8] hover:text-[#0a6b48]"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {isDairy &&
            (name ? (
              <div ref={accountRef} className="relative ml-3">
                <button
                  onClick={() => setAccountOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  className={`inline-flex items-center gap-2 rounded-full border border-[#c8d8cb] bg-white py-1.5 pl-1.5 pr-3 text-[#17372d] transition hover:border-[#5a9960] ${focusRing}`}
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-[#dceccd] text-xs font-bold uppercase text-[#0a6b48]">
                    {name.charAt(0)}
                  </span>
                  <span className="max-w-[9rem] truncate">{name}</span>
                  <ChevronDown
                    className={`size-4 transition-transform ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-12 w-52 rounded-2xl border border-[#dce6dd] bg-white p-2 text-[#17372d] shadow-xl"
                  >
                    <Link
                      href="/dairy/supplier"
                      role="menuitem"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-[#f2f7f0]"
                    >
                      <LayoutDashboard className="size-4 text-[#0a6b48]" />
                      My dashboard
                    </Link>
                    <button
                      onClick={logout}
                      role="menuitem"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/dairy/login"
                className={`ml-3 rounded-full bg-[#0a6b48] px-5 py-2.5 text-white shadow-lg shadow-[#0a6b48]/15 transition hover:bg-[#085a3d] ${focusRing}`}
              >
                Supplier sign in
              </Link>
            ))}
        </nav>

        <button
          className={`-mr-2 flex size-10 items-center justify-center rounded-xl md:hidden ${focusRing}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile nav */}
      {open && (
        <div
          id="mobile-nav"
          className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-[#dce6dd] bg-white px-4 py-4 sm:px-6 md:hidden"
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 text-sm font-semibold"
          >
            {navLinks.map(({ href, label, match }) => {
              const active = match(pathname);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-xl px-3 py-3 ${
                    active
                      ? "bg-[#dceccd] text-[#0a6b48]"
                      : "hover:bg-[#f2f7f0]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {isDairy && (
              <div className="mt-2 border-t border-[#e4eae3] pt-3">
                {name ? (
                  <>
                    <div className="mb-1 flex items-center gap-3 px-3 py-2">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#dceccd] text-sm font-bold uppercase text-[#0a6b48]">
                        {name.charAt(0)}
                      </span>
                      <span className="min-w-0 truncate">{name}</span>
                    </div>
                    <Link
                      href="/dairy/supplier"
                      className="flex items-center gap-2 rounded-xl px-3 py-3 hover:bg-[#f2f7f0]"
                    >
                      <LayoutDashboard className="size-4 text-[#0a6b48]" />
                      My dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="size-4" />
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/dairy/login"
                    className="block rounded-xl bg-[#0a6b48] px-4 py-3 text-center text-white"
                  >
                    Supplier sign in
                  </Link>
                )}
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function StorefrontHome() {
  return (
    <>
      <SiteHeader />
      <main className="bg-[#f7f9f5] text-[#17372d] mt-20">
        <HeroSlider />
        <BusinessesSection />
      </main>
    </>
  );
}

export function DairyPage() {
  const cards = [
    {
      icon: User,
      title: "Your profile",
      text: "View your supplier and account details.",
    },
    {
      icon: Sunrise,
      title: "Every session",
      text: "Track each morning and evening delivery.",
    },
    {
      icon: History,
      title: "Clear history",
      text: "Look back at all your past deliveries.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-[#f7f9f5] px-4 pb-20 pt-28 text-[#17372d] sm:px-6 sm:pb-24 sm:pt-36 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <section className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#dceccd] px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[#36754b]">
              <Droplets className="size-3.5" /> Dairy Management
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight tracking-[-.03em] sm:text-4xl lg:text-5xl">
              Every delivery, accounted for.
            </h1>

            <p className="mt-4 text-pretty text-base leading-7 text-[#71847a]">
              A simple supplier space for seeing your profile, recording milk
              deliveries, and keeping a clear history of your contribution.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dairy/register"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#0a6b48] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#085a3d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48]"
              >
                Create supplier account
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dairy/login"
                className="inline-flex items-center justify-center rounded-xl border border-[#c8d8cb] bg-white px-5 py-3 text-sm font-bold transition hover:border-[#5a9960] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48]"
              >
                Log in
              </Link>
            </div>
          </section>

          <section className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-3 sm:gap-4">
            {cards.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-start gap-4 rounded-2xl border border-[#dce6dd] bg-white p-4 transition hover:border-[#b7d3b6] hover:shadow-sm sm:flex-col sm:gap-3 sm:p-5"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef5e8] text-[#0a6b48]">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold">{title}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#71847a]">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

type BakeryItem = {
  name: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
  image?: string;
};

export function BakeryPage() {
  const bakeryItems: BakeryItem[] = [
    {
      name: "Fresh bread",
      text: "Loaves and rolls for everyday tables.",
      icon: Wheat,
      // image: "/bakery/bread.jpg",
    },
    {
      name: "Celebration cakes",
      text: "Cakes for birthdays and special days.",
      icon: Cake,
      // image: "/bakery/cakes.jpg",
    },
    {
      name: "Pastries & cookies",
      text: "Sweet and savoury bites, ready to grab.",
      icon: Cookie,
      // image: "/bakery/pastries.jpg",
    },
  ];
  return (
    <>
      <SiteHeader />
      <main className="overflow-x-clip bg-[#f7f9f5] px-4 pb-20 pt-28 text-[#17372d] sm:px-6 sm:pb-24 sm:pt-36 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <section className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#fbe3b4] px-3 py-1 text-xs font-bold uppercase tracking-[.14em] text-[#8a5a12]">
              <Clock className="size-3.5" /> Coming soon
            </div>

            <h1 className="text-balance text-3xl font-bold leading-tight tracking-[-.03em] sm:text-4xl lg:text-5xl">
              The SuperLeo bakery is almost ready.
            </h1>

            <p className="mt-4 text-pretty text-base leading-7 text-[#71847a]">
              We&apos;re getting our bakery shop ready. Take a peek at
              what&apos;s coming, and check back soon to start shopping.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#c8d8cb] bg-white px-5 py-3 text-sm font-bold transition hover:border-[#5a9960] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a6b48]"
            >
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </section>

          {/* Preview gallery: display only, nothing here is clickable or shoppable */}
          <section
            aria-label="Bakery preview"
            className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5"
          >
            {bakeryItems.map(({ name, text, icon: Icon, image }) => (
              <figure
                key={name}
                className="overflow-hidden rounded-2xl border border-[#ecd3a8] bg-white"
              >
                <div className="relative aspect-[4/3] w-full bg-[#fdf4e3]">
                  {image ? (
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Icon className="size-14 text-[#c98a2b]/60" />
                    </div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#8a5a12] shadow-sm">
                    Coming soon
                  </span>
                </div>
                <figcaption className="p-4">
                  <h2 className="text-sm font-bold">{name}</h2>
                  <p className="mt-1 text-sm leading-5 text-[#71847a]">
                    {text}
                  </p>
                </figcaption>
              </figure>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}

export function SupplierAuth({ mode }: { mode: "login" | "register" }) {
  const isLogin = mode === "login";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"}/auth/${isLogin ? "login" : "register"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const body = await response.json();
      if (!response.ok)
        throw new Error(body.error || "Unable to complete request");
      sessionStorage.setItem("superleo_token", body.data.token);
      window.location.href = "/dairy/supplier";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to complete request",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center bg-[#f7f9f5] px-6 pb-16 pt-32 text-[#17372d]">
        <div className="w-full max-w-md rounded-3xl border border-[#dce6dd] bg-white p-7 shadow-sm md:p-9">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#5a9960]">
            Dairy supplier portal
          </p>
          <h1 className="mt-4 text-3xl font-bold">
            {isLogin ? "Welcome back" : "Create your supplier account"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#71847a]">
            {isLogin
              ? "Log in to view your supplier records."
              : "Join your collection centre on SuperLeo."}
          </p>
          <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
            {!isLogin && (
              <label className="text-sm font-semibold">
                Full name
                <input
                  name="fullName"
                  required
                  className="mt-2 w-full rounded-xl border border-[#dce6dd] px-4 py-3 outline-none focus:border-[#5a9960]"
                  placeholder="Amara Mutesi"
                />
              </label>
            )}
            <label className="text-sm font-semibold">
              Email
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-xl border border-[#dce6dd] px-4 py-3 outline-none focus:border-[#5a9960]"
                placeholder="you@example.com"
              />
            </label>
            <label className="text-sm font-semibold">
              Password
              <input
                name="password"
                required
                type="password"
                minLength={8}
                className="mt-2 w-full rounded-xl border border-[#dce6dd] px-4 py-3 outline-none focus:border-[#5a9960]"
                placeholder="At least 8 characters"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              disabled={pending}
              className="mt-3 rounded-xl bg-[#0a6b48] px-4 py-3 font-bold text-white disabled:opacity-60"
            >
              {pending
                ? "Please wait..."
                : isLogin
                  ? "Log in to supplier portal"
                  : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#71847a]">
            {isLogin ? "New supplier?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/dairy/register" : "/dairy/login"}
              className="font-bold text-[#0a6b48]"
            >
              {isLogin ? "Create an account" : "Log in"}
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

// Replace the existing `SupplierDashboard` export in components/storefront.tsx with this
// (the helpers above it go in the same file, outside the component).
//
// Imports needed in that file:
//   import { useEffect, useMemo, useState } from "react";
//   lucide-react: LogOut, Mail, MapPin, Phone, Sunrise, Sunset, TrendingDown, TrendingUp, User
//
// No chart library is needed: the chart is plain HTML/CSS.

/* ---------- helpers ---------- */
type Period = "7" | "10" | "month";
const PERIODS: { id: Period; label: string }[] = [
  { id: "7", label: "7 days" },
  { id: "10", label: "10 days" },
  { id: "month", label: "This month" },
];

// Local calendar day as "YYYY-MM-DD" (never shifted by time zones)
function dateToKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function keyToDate(key: string) {
  return new Date(`${key}T00:00:00`);
}
function normalizeDay(value: unknown): string | null {
  const text = String(value ?? "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const d = new Date(text);
  return Number.isNaN(d.getTime()) ? null : dateToKey(d);
}
function formatDay(key: string | null) {
  return key
    ? keyToDate(key).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Date unavailable";
}
const litres = (n: number) => `${Math.round(n * 10) / 10} L`;
function niceTop(v: number) {
  if (v <= 0) return 10;
  const pow = 10 ** Math.floor(Math.log10(v));
  const n = v / pow;
  const step = [1, 2, 3, 4, 5, 6, 8, 10].find((c) => c >= n) ?? 10;
  return step * pow;
}

export function SupplierDashboard() {
  const [loggedOut, setLoggedOut] = useState(false);
  // undefined = not checked yet, null = no token found, string = token
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [period, setPeriod] = useState<Period>("7");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Read the token after mount (window doesn't exist during server rendering).
  useEffect(() => {
    setToken(
      sessionStorage.getItem("superleo_token") ||
        localStorage.getItem("superleo_token"),
    );
  }, []);

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useSWR(token ? ["/auth/me", token] : null, () => authApi.me(), {
    revalidateOnFocus: false,
  });
  const {
    data: profile,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR(
    token ? ["/supplier/profile", token] : null,
    () => supplierApi.profile(),
    { revalidateOnFocus: false },
  );
  const {
    data: deliveries,
    error: deliveriesError,
    isLoading: deliveriesLoading,
  } = useSWR(
    token ? ["/supplier/deliveries", token] : null,
    () => supplierApi.deliveries(),
    { revalidateOnFocus: false },
  );
  const records = useMemo(() => deliveries || [], [deliveries]);
  const dataError = userError || profileError || deliveriesError;
  const isLoading = userLoading || profileLoading || deliveriesLoading;
  const supplierProfile = profile || {
    full_name: user?.full_name || "Supplier",
    phone: null,
    address: null,
  };
  const totalLitres = records.reduce(
    (sum, delivery) => sum + Number(delivery.quantity_litres),
    0,
  );

  // Newest first, regardless of the order the API returns
  const sorted = useMemo(
    () =>
      [...records].sort((a, b) =>
        (normalizeDay(b.session_date) || "").localeCompare(
          normalizeDay(a.session_date) || "",
        ),
      ),
    [records],
  );
  const recent = sorted[0];

  // Everything the chart and period summary need
  const view = useMemo(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start =
      period === "month"
        ? new Date(end.getFullYear(), end.getMonth(), 1)
        : new Date(
            end.getFullYear(),
            end.getMonth(),
            end.getDate() - (Number(period) - 1),
          );
    const keys: string[] = [];
    for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1))
      keys.push(dateToKey(d));

    const byDay: Record<string, { morning: number; evening: number }> = {};
    for (const r of records) {
      const key = normalizeDay(r.session_date);
      if (!key) continue;
      const slot = (byDay[key] ||= { morning: 0, evening: 0 });
      const qty = Number(r.quantity_litres) || 0;
      if (String(r.session_type).toLowerCase() === "evening")
        slot.evening += qty;
      else slot.morning += qty;
    }

    const series = keys.map((key) => {
      const s = byDay[key] || { morning: 0, evening: 0 };
      return {
        key,
        morning: s.morning,
        evening: s.evening,
        total: s.morning + s.evening,
      };
    });
    const keySet = new Set(keys);
    const count = records.filter((r) =>
      keySet.has(normalizeDay(r.session_date) || ""),
    ).length;
    const total = series.reduce((sum, s) => sum + s.total, 0);
    const morning = series.reduce((sum, s) => sum + s.morning, 0);
    const evening = series.reduce((sum, s) => sum + s.evening, 0);
    const prevTotal = keys.reduce((sum, key) => {
      const d = keyToDate(key);
      d.setDate(d.getDate() - keys.length);
      const s = byDay[dateToKey(d)];
      return sum + (s ? s.morning + s.evening : 0);
    }, 0);
    const best = series.reduce(
      (a, b) => (b.total > a.total ? b : a),
      series[0],
    );
    const top = niceTop(Math.max(...series.map((s) => s.total), 0));
    const change =
      prevTotal > 0 ? ((total - prevTotal) / prevTotal) * 100 : null;
    return {
      series,
      count,
      total,
      morning,
      evening,
      best,
      top,
      change,
      days: keys.length,
    };
  }, [records, period]);

  function choosePeriod(next: Period) {
    setPeriod(next);
    setActiveKey(null);
  }
  function logout() {
    sessionStorage.removeItem("superleo_token");
    localStorage.removeItem("superleo_token");
    setLoggedOut(true);
    window.location.href = "/dairy/login";
  }

  // Still checking for a token / loading data
  if (token === undefined || isLoading)
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-6 pt-24 text-[#17372d]">
          <div className="rounded-3xl border border-[#dce6dd] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto size-8 animate-spin rounded-full border-4 border-[#dceccd] border-t-[#0a6b48]" />
            <p className="mt-4 font-semibold">Loading your supplier data…</p>
          </div>
        </main>
      </>
    );

  if (!token || loggedOut || userError || (user && user.role !== "supplier"))
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-6 pt-24 text-[#17372d]">
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold">Your session has ended</h1>
            <p className="mt-2 text-sm text-[#71847a]">
              Log in again to load your live supplier dashboard.
            </p>
            <Link
              href="/dairy/login"
              className="mt-5 inline-flex rounded-xl bg-[#0a6b48] px-5 py-3 font-bold text-white"
            >
              Log in again
            </Link>
          </div>
        </main>
      </>
    );

  if (dataError)
    return (
      <>
        <SiteHeader />
        <main className="flex min-h-screen items-center justify-center bg-[#f5f7f3] px-6 pt-24 text-[#17372d]">
          <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold">
              We could not load your dashboard
            </h1>
            <p className="mt-2 text-sm text-[#71847a]">
              Your login is active, but the supplier profile or delivery records
              could not be fetched.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-[#0a6b48] px-5 py-3 font-bold text-white"
            >
              Try again
            </button>
          </div>
        </main>
      </>
    );

  const name = supplierProfile.full_name || user?.full_name || "Supplier";
  const phone = (supplierProfile as { phone?: string | null }).phone;
  const avgPerDelivery = records.length ? totalLitres / records.length : 0;
  const listed = showAll ? sorted : sorted.slice(0, 6);
  const activeDay = view.series.find((s) => s.key === activeKey);
  const sessionTotal = view.morning + view.evening;
  const morningPct = sessionTotal
    ? Math.round((view.morning / sessionTotal) * 100)
    : 0;

  const labelFor = (key: string, i: number) => {
    const d = keyToDate(key);
    if (period === "7")
      return d.toLocaleDateString("en-GB", { weekday: "short" });
    if (period === "10") return String(d.getDate());
    return i % 3 === 0 || i === view.series.length - 1
      ? String(d.getDate())
      : "";
  };

  const card = "rounded-2xl border border-[#dce6dd] bg-white p-5";
  const eyebrow = "text-xs font-bold uppercase tracking-[.14em] text-[#5a9960]";

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen overflow-x-clip bg-[#f5f7f3] px-4 pb-20 pt-28 text-[#17372d] sm:px-6 sm:pt-32 md:px-10">
        <div className="mx-auto max-w-5xl">
          {/* Heading */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className={eyebrow}>Supplier portal</p>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Your delivery overview
              </h1>
              <p className="mt-2 text-sm text-[#71847a] sm:text-base">
                Welcome back, {name}. Here is your latest delivery activity.
              </p>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-[#c8d8cb] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#5a9960]"
            >
              <LogOut className="size-4" /> Log out
            </button>
          </div>

          {/* All-time summary */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div className="rounded-2xl bg-[#17372d] p-5 text-white">
              <p className="text-xs text-[#b7cabd] sm:text-sm">
                Total supplied
              </p>
              <strong className="mt-2 block truncate text-2xl sm:text-3xl">
                {litres(totalLitres)}
              </strong>
              <p className="mt-1 text-xs text-[#b7cabd]">All time</p>
            </div>
            <div className={card}>
              <p className="text-xs text-[#809087] sm:text-sm">Deliveries</p>
              <strong className="mt-2 block text-2xl sm:text-3xl">
                {records.length}
              </strong>
              <p className="mt-1 text-xs text-[#809087]">Recorded in total</p>
            </div>
            <div className={card}>
              <p className="text-xs text-[#809087] sm:text-sm">
                Latest delivery
              </p>
              <strong className="mt-2 block truncate text-2xl sm:text-3xl">
                {recent ? litres(Number(recent.quantity_litres)) : "—"}
              </strong>
              <p className="mt-1 truncate text-xs text-[#809087]">
                {recent
                  ? formatDay(normalizeDay(recent.session_date))
                  : "No records yet"}
              </p>
            </div>
            <div className={card}>
              <p className="text-xs text-[#809087] sm:text-sm">
                Average delivery
              </p>
              <strong className="mt-2 block truncate text-2xl sm:text-3xl">
                {records.length ? litres(avgPerDelivery) : "—"}
              </strong>
              <p className="mt-1 text-xs text-[#809087]">Per collection</p>
            </div>
          </div>

          {/* Trend chart */}
          <section
            className={`${card} mt-4 sm:mt-5 sm:p-6`}
            aria-label="Delivery trend"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={eyebrow}>Delivery trend</p>
                <h2 className="mt-1 text-lg font-bold sm:text-xl">
                  Litres per day
                </h2>
              </div>
              <div
                role="group"
                aria-label="Chart period"
                className="inline-flex rounded-xl bg-[#eef5e8] p-1"
              >
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={period === p.id}
                    onClick={() => choosePeriod(p.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                      period === p.id
                        ? "bg-white text-[#0a6b48] shadow-sm"
                        : "text-[#64766b] hover:text-[#0a6b48]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Period summary */}
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-[#809087]">Supplied</dt>
                <dd className="mt-0.5 text-lg font-bold">
                  {litres(view.total)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#809087]">Deliveries</dt>
                <dd className="mt-0.5 text-lg font-bold">{view.count}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#809087]">Daily average</dt>
                <dd className="mt-0.5 text-lg font-bold">
                  {litres(view.total / view.days)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#809087]">vs previous period</dt>
                <dd
                  className={`mt-0.5 flex items-center gap-1 text-lg font-bold ${
                    view.change === null
                      ? "text-[#809087]"
                      : view.change >= 0
                        ? "text-[#0a6b48]"
                        : "text-red-700"
                  }`}
                >
                  {view.change === null ? (
                    "—"
                  ) : (
                    <>
                      {view.change >= 0 ? (
                        <TrendingUp className="size-4" />
                      ) : (
                        <TrendingDown className="size-4" />
                      )}
                      {view.change >= 0 ? "+" : ""}
                      {Math.round(view.change)}%
                    </>
                  )}
                </dd>
              </div>
            </dl>

            {/* Bars */}
            <div className="mt-6 flex gap-2">
              <div className="relative h-48 w-9 shrink-0 text-[10px] text-[#809087]">
                {[view.top, view.top / 2, 0].map((t, i) => (
                  <span
                    key={i}
                    className="absolute right-0 -translate-y-1/2"
                    style={{ top: `${i * 50}%` }}
                  >
                    {Math.round(t * 10) / 10}
                  </span>
                ))}
              </div>
              <div className="relative h-48 min-w-0 flex-1">
                <div aria-hidden className="absolute inset-0">
                  <div className="absolute inset-x-0 top-0 border-t border-dashed border-[#e3ece2]" />
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#e3ece2]" />
                  <div className="absolute inset-x-0 bottom-0 border-t border-[#c8d8cb]" />
                </div>
                <div
                  className={`absolute inset-0 flex items-end ${view.series.length > 12 ? "gap-px" : "gap-1.5"}`}
                  onMouseLeave={() => setActiveKey(null)}
                >
                  {view.series.map((s) => {
                    const mH = (s.morning / view.top) * 100;
                    const eH = (s.evening / view.top) * 100;
                    const active = activeKey === s.key;
                    return (
                      <button
                        key={s.key}
                        type="button"
                        aria-pressed={active}
                        aria-label={`${formatDay(s.key)}: ${litres(s.total)}`}
                        title={`${formatDay(s.key)} · ${litres(s.total)}`}
                        onClick={() => setActiveKey(active ? null : s.key)}
                        onMouseEnter={() => setActiveKey(s.key)}
                        className={`h-full min-w-0 flex-1 rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a6b48] ${
                          active ? "bg-[#eef5e8]" : "hover:bg-[#f4f8f1]"
                        }`}
                      >
                        <span className="mx-auto flex h-full w-full max-w-[28px] flex-col justify-end px-px">
                          <span
                            className="block rounded-t-sm bg-[#c98a2b]"
                            style={{ height: `${eH}%` }}
                          />
                          <span
                            className={`block bg-[#0a6b48] ${eH === 0 ? "rounded-t-sm" : ""}`}
                            style={{ height: `${mH}%` }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div
              className={`ml-11 mt-2 flex ${view.series.length > 12 ? "gap-px" : "gap-1.5"}`}
            >
              {view.series.map((s, i) => (
                <span
                  key={s.key}
                  className="min-w-0 flex-1 truncate text-center text-[10px] text-[#809087]"
                >
                  {labelFor(s.key, i)}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#edf2ed] pt-4 text-xs">
              <p className="min-w-0 text-[#4f6a5b]">
                {activeDay ? (
                  <>
                    <strong>
                      {keyToDate(activeDay.key).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </strong>{" "}
                    · Morning {litres(activeDay.morning)} · Evening{" "}
                    {litres(activeDay.evening)} · Total{" "}
                    {litres(activeDay.total)}
                  </>
                ) : view.total > 0 ? (
                  <>
                    Best day:{" "}
                    <strong>
                      {keyToDate(view.best.key).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </strong>{" "}
                    ({litres(view.best.total)}). Hover or tap a bar for details.
                  </>
                ) : (
                  "No deliveries in this period."
                )}
              </p>
              <div className="flex items-center gap-4 text-[#64766b]">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#0a6b48]" /> Morning
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-[#c98a2b]" /> Evening
                </span>
              </div>
            </div>
          </section>

          <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5 lg:grid-cols-[1.6fr_1fr]">
            {/* Recent deliveries */}
            <section className={`${card} min-w-0 sm:p-6`}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className={eyebrow}>Records</p>
                  <h2 className="mt-1 text-lg font-bold sm:text-xl">
                    Recent deliveries
                  </h2>
                </div>
                <span className="rounded-full bg-[#eef6eb] px-3 py-1 text-xs font-bold text-[#3e7c48]">
                  {records.length}
                </span>
              </div>
              <div className="mt-4 divide-y divide-[#edf2ed]">
                {listed.length ? (
                  listed.map((delivery, index) => {
                    const evening =
                      String(delivery.session_type).toLowerCase() === "evening";
                    return (
                      <div
                        key={`${delivery.session_date}-${index}`}
                        className="flex items-center justify-between gap-3 py-3.5"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                              evening
                                ? "bg-[#f4eee2] text-[#9a7440]"
                                : "bg-[#eef6eb] text-[#0a6b48]"
                            }`}
                          >
                            {evening ? (
                              <Sunset className="size-4" />
                            ) : (
                              <Sunrise className="size-4" />
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold capitalize">
                              {delivery.session_type} collection
                            </p>
                            <p className="text-xs text-[#71847a]">
                              {formatDay(normalizeDay(delivery.session_date))}
                            </p>
                          </div>
                        </div>
                        <strong className="shrink-0 text-sm">
                          {litres(Number(delivery.quantity_litres))}
                        </strong>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-8 text-center text-sm text-[#71847a]">
                    No delivery records have been added yet.
                  </p>
                )}
              </div>
              {sorted.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="mt-3 w-full rounded-xl border border-[#c8d8cb] py-2.5 text-sm font-bold text-[#0a6b48] transition hover:bg-[#f2f7f0]"
                >
                  {showAll
                    ? "Show fewer"
                    : `View all ${sorted.length} deliveries`}
                </button>
              )}
            </section>

            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              {/* Morning vs evening */}
              <section className={card}>
                <p className={eyebrow}>This period</p>
                <h2 className="mt-1 text-lg font-bold">Morning vs evening</h2>
                {sessionTotal > 0 ? (
                  <>
                    <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-[#f4eee2]">
                      <div
                        className="bg-[#0a6b48]"
                        style={{ width: `${morningPct}%` }}
                      />
                      <div className="flex-1 bg-[#c98a2b]" />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs text-[#809087]">
                          <Sunrise className="size-3.5" /> Morning
                        </dt>
                        <dd className="mt-0.5 font-bold">
                          {litres(view.morning)}{" "}
                          <span className="text-xs font-semibold text-[#809087]">
                            {morningPct}%
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="flex items-center gap-1.5 text-xs text-[#809087]">
                          <Sunset className="size-3.5" /> Evening
                        </dt>
                        <dd className="mt-0.5 font-bold">
                          {litres(view.evening)}{" "}
                          <span className="text-xs font-semibold text-[#809087]">
                            {100 - morningPct}%
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-[#71847a]">
                    No deliveries in the selected period.
                  </p>
                )}
              </section>

              {/* Profile */}
              <section className={card}>
                <div className="flex items-center gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dceccd] text-base font-bold uppercase text-[#0a6b48]">
                    {String(name).charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold">{name}</h2>
                    <p className="flex items-center gap-1 text-xs text-[#71847a]">
                      <User className="size-3.5" /> Supplier profile
                    </p>
                  </div>
                </div>
                <ul className="mt-4 flex flex-col gap-3 text-sm text-[#4f6a5b]">
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-[#0a6b48]" />
                    <span className="min-w-0 break-words">
                      {user?.email || "Email unavailable"}
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 shrink-0 text-[#0a6b48]" />
                    <span>{phone || "Phone not added"}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#0a6b48]" />
                    <span className="min-w-0 break-words">
                      {supplierProfile.address || "Address not added"}
                    </span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
