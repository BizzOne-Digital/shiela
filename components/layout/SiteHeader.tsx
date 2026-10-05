"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Logo } from "@/components/brand/Logo";
import { NAV_SERVICES_MENU, NAV_WHO_MENU } from "@/lib/constants";

type MenuItem = { label: string; href: string };

const nav = [
  { label: "Home", href: "/", exact: true },
  { label: "Services", menu: "services" as const, href: "/services" },
  { label: "Who We Help", menu: "who" as const, href: "/who-we-help" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact", href: "/contact" },
];

function NavChevron({ open }: { open?: boolean }) {
  return (
    <svg
      className={`ml-1 h-3 w-3 text-hero-navy/70 transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DesktopNavDropdown({
  label,
  items,
  pageHref,
  open,
  onOpen,
  onClose,
}: {
  label: string;
  items: readonly MenuItem[];
  pageHref: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [open, onClose]);

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={onClose}>
      <div className="inline-flex items-center gap-0.5">
        <Link
          href={pageHref}
          className={`text-[15px] transition-colors ${
            open ? "font-semibold text-hero-navy" : "font-medium text-hero-navy/90 hover:text-hero-navy"
          }`}
        >
          {label}
        </Link>
        <button
          type="button"
          id={`${menuId}-trigger`}
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={`${menuId}-panel`}
          className="inline-flex items-center rounded-md p-1 text-hero-navy/90 hover:bg-[#f4f7fb] hover:text-hero-navy"
          onClick={() => (open ? onClose() : onOpen())}
          onMouseEnter={onOpen}
          aria-label={`${label} menu`}
        >
          <NavChevron open={open} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <div className="absolute top-full left-1/2 z-50 w-[min(100vw-2rem,300px)] -translate-x-1/2 pt-2">
            <motion.div
              id={`${menuId}-panel`}
              role="menu"
              aria-labelledby={`${menuId}-trigger`}
              className="rounded-xl border border-black/[0.08] bg-white py-2 shadow-[0_16px_48px_-12px_rgba(10,31,68,0.22)]"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  role="menuitem"
                  href={item.href}
                  className="block px-4 py-2.5 text-sm text-hero-navy/90 transition hover:bg-[#f4f7fb] hover:text-hero-navy"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavGroup({
  label,
  items,
  pageHref,
  expanded,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: readonly MenuItem[];
  pageHref: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div className="rounded-lg border border-black/[0.04] bg-[#fafbfc]">
      <div className="flex min-h-[44px] items-center justify-between gap-2 px-3">
        <Link href={pageHref} className="flex-1 py-3 text-base font-medium text-hero-navy" onClick={onNavigate}>
          {label}
        </Link>
        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md hover:bg-white"
          aria-expanded={expanded}
          aria-label={`Expand ${label}`}
          onClick={onToggle}
        >
          <NavChevron open={expanded} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-black/[0.05] px-2 pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2.5 text-sm text-hero-navy/85 hover:bg-white"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<"services" | "who" | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileWhoOpen, setMobileWhoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const closeDesktopMenus = useCallback(() => setDesktopMenu(null), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === "/";
    if (href === "/contact") return pathname === "/contact";
    return false;
  };

  const closeMobile = () => {
    setOpen(false);
    setMobileServicesOpen(false);
    setMobileWhoOpen(false);
  };

  return (
    <header
      key={pathname}
      className={`safe-top sticky top-0 z-50 overflow-visible transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.06] bg-white/96 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="site-container flex items-center justify-between gap-3 py-3 min-[400px]:gap-4 sm:py-[18px]">
        <Logo />

        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex xl:gap-12" aria-label="Primary">
          {nav.map((item) => {
            if (item.menu === "services") {
              return (
                <DesktopNavDropdown
                  key={item.label}
                  label={item.label}
                  pageHref={item.href!}
                  items={NAV_SERVICES_MENU}
                  open={desktopMenu === "services"}
                  onOpen={() => setDesktopMenu("services")}
                  onClose={closeDesktopMenus}
                />
              );
            }
            if (item.menu === "who") {
              return (
                <DesktopNavDropdown
                  key={item.label}
                  label={item.label}
                  pageHref={item.href!}
                  items={NAV_WHO_MENU}
                  open={desktopMenu === "who"}
                  onOpen={() => setDesktopMenu("who")}
                  onClose={closeDesktopMenus}
                />
              );
            }
            const href = item.href;
            const active = isActive(href, item.exact);
            return (
              <Link
                key={item.label}
                href={href}
                className={`inline-flex items-center text-[15px] transition-colors ${
                  active
                    ? "font-semibold text-hero-navy underline decoration-hero-navy decoration-2 underline-offset-[10px]"
                    : "font-medium text-hero-navy/90 hover:text-hero-navy"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/contact"
            className="btn-primary hidden px-6 py-2.5 text-[14px] shadow-[0_8px_24px_-10px_rgba(10,31,68,0.45)] sm:inline-flex"
          >
            Request a Quote
            <ArrowRight />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-black/10 bg-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg className="h-5 w-5 text-hero-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.5" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="1.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="border-t border-black/5 bg-white lg:hidden"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="safe-bottom flex flex-col gap-2 px-4 py-4" aria-label="Mobile">
              <Link
                href="/"
                className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium text-hero-navy hover:bg-[#f4f7fb]"
                onClick={closeMobile}
              >
                Home
              </Link>
              <Link
                href="/how-it-works"
                className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium text-hero-navy hover:bg-[#f4f7fb]"
                onClick={closeMobile}
              >
                How It Works
              </Link>
              <MobileNavGroup
                label="Services"
                pageHref="/services"
                items={NAV_SERVICES_MENU}
                expanded={mobileServicesOpen}
                onToggle={() => {
                  setMobileServicesOpen((v) => !v);
                  setMobileWhoOpen(false);
                }}
                onNavigate={closeMobile}
              />
              <MobileNavGroup
                label="Who We Help"
                pageHref="/who-we-help"
                items={NAV_WHO_MENU}
                expanded={mobileWhoOpen}
                onToggle={() => {
                  setMobileWhoOpen((v) => !v);
                  setMobileServicesOpen(false);
                }}
                onNavigate={closeMobile}
              />
              <Link
                href="/contact"
                className="block min-h-[44px] rounded-lg px-3 py-3 text-base font-medium text-hero-navy hover:bg-[#f4f7fb]"
                onClick={closeMobile}
              >
                Contact
              </Link>
              <Link
                href="/contact"
                className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-hero-navy px-4 py-3 text-sm font-medium text-white"
                onClick={closeMobile}
              >
                Request a Quote
                <ArrowRight />
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
