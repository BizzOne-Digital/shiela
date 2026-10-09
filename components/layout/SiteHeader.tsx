"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

function ArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`safe-top sticky top-0 z-50 overflow-visible transition-all duration-300 ${
        scrolled
          ? "border-b border-black/[0.06] bg-white/96 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="site-container flex min-w-0 items-center justify-between gap-2 py-3 min-[400px]:gap-3 sm:gap-4 sm:py-[18px]">
        <Logo className="min-w-0" />

        <Link
          href="/#contact"
          className="btn-primary inline-flex shrink-0 px-3.5 py-2.5 text-xs shadow-[0_8px_24px_-10px_rgba(10,31,68,0.45)] min-[400px]:px-5 min-[400px]:text-[13px] sm:px-6 sm:text-[14px]"
        >
          <span className="min-[400px]:hidden">Quote</span>
          <span className="hidden min-[400px]:inline">Request a Quote</span>
          <ArrowRight />
        </Link>
      </div>
    </header>
  );
}
