"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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

export function SupplierDashboard() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[#f5f7f3] px-6 pb-20 pt-32 text-[#17372d] md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-bold uppercase tracking-[.14em] text-[#5a9960]">
            Supplier portal
          </p>
          <h1 className="mt-4 text-4xl font-bold">Your delivery overview</h1>
          <p className="mt-2 text-[#71847a]">
            Welcome back, Supplier. Here is your latest delivery activity.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#17372d] p-6 text-white">
              <p className="text-sm text-[#b7cabd]">This month</p>
              <strong className="mt-2 block text-4xl">486 L</strong>
            </div>
            <div className="rounded-2xl border border-[#dce6dd] bg-white p-6">
              <p className="text-sm text-[#809087]">Last delivery</p>
              <strong className="mt-2 block text-4xl">30 L</strong>
            </div>
            <div className="rounded-2xl border border-[#dce6dd] bg-white p-6">
              <p className="text-sm text-[#809087]">Verified records</p>
              <strong className="mt-2 block text-4xl">18/18</strong>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
