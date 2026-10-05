"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { IMAGES } from "@/lib/images";

const links = [
  { href: "/admin", label: "Dashboard", icon: "home", exact: true },
  { href: "/admin/services", label: "Services", icon: "services" },
  { href: "/admin/bookings", label: "Bookings", icon: "bookings" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "quotes" },
];

function NavIcon({ type }: { type: string }) {
  const cls = "h-[18px] w-[18px]";
  switch (type) {
    case "home":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" />
        </svg>
      );
    case "services":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 4h12v16H4V8h4z" />
          <path d="M8 4v4H4" />
        </svg>
      );
    case "bookings":
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      );
    default:
      return (
        <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 7h10v10H7z" />
          <path d="M9 11h6M9 14h4" />
        </svg>
      );
  }
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen min-w-0 overflow-x-clip bg-[#eef2f7] text-hero-navy">
      <aside
        className={`safe-top fixed inset-y-0 left-0 z-40 flex w-[min(280px,88vw)] max-w-[280px] flex-col border-r border-black/[0.06] bg-[#f4f7fb] transition-transform lg:static lg:w-[260px] lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-black/[0.05] px-6 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin">
          {links.map((l) => {
            const active = isActive(l.href, l.exact);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-hero-navy shadow-sm"
                    : "text-hero-navy/75 hover:bg-white/60 hover:text-hero-navy"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-hero-navy" aria-hidden />
                )}
                <NavIcon type={l.icon} />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="relative mt-auto overflow-hidden border-t border-black/[0.05] px-3 py-4">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <Image src={IMAGES.heroBg} alt="" fill className="object-cover object-bottom" />
          </div>
          <div className="relative space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-hero-navy/80 hover:bg-white/70"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M14 5h5v5M10 19H5v-5M19 5l-7 7M5 19l7-7" strokeWidth="1.5" />
              </svg>
              View Website
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-left text-sm text-hero-navy/80 hover:bg-white/70"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="1.5" />
              </svg>
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="safe-top flex items-center justify-between border-b border-black/[0.05] bg-[#eef2f7]/90 px-3 py-3 backdrop-blur min-[400px]:px-4 md:px-8">
          <button
            type="button"
            className="min-h-[44px] rounded-lg border border-black/10 bg-white px-3 py-2 text-sm lg:hidden"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
          <div className="ml-auto flex items-center gap-2 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce8f5] text-xs font-semibold text-hero-navy">
              A1
            </span>
            <span className="hidden text-sm font-medium sm:block">Admin</span>
            <svg className="h-4 w-4 text-hero-navy/50" viewBox="0 0 12 12" fill="none" stroke="currentColor">
              <path d="M3 4.5L6 7.5L9 4.5" strokeWidth="1.25" />
            </svg>
          </div>
        </header>
        <main className="min-w-0 flex-1 overflow-x-auto px-3 py-5 min-[400px]:px-4 min-[400px]:py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
