"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const HERO_SERVICES = [
  {
    label: "Process Serving",
    href: "/services#service-serve",
    icon: (
      <>
        <rect x="5" y="4" width="14" height="18" rx="1.5" strokeWidth="1.4" />
        <path d="M8 9h8M8 12h6" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M17 8l3 2-3 2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "Court Filing",
    href: "/services#service-filing",
    icon: (
      <>
        <path d="M6 5h10l4 4v14H6V5z" strokeWidth="1.4" />
        <path d="M16 5v4h4M9 13h8M9 16h6" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "e-Filing",
    href: "/services#service-efile",
    icon: (
      <>
        <rect x="4" y="7" width="18" height="12" rx="1.5" strokeWidth="1.4" />
        <path d="M4 10h18" strokeWidth="1.3" />
        <path d="M8 14h6" strokeWidth="1.3" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Writ Searches",
    href: "/services#service-search",
    icon: (
      <>
        <circle cx="10" cy="10" r="5.5" strokeWidth="1.4" />
        <path d="M14 14l5 5" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
  {
    label: "Occupancy",
    href: "/services#service-occupancy",
    icon: (
      <>
        <path d="M5 20V11l7-5 7 5v9" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M9 20v-5h6v5" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  },
];

function ArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#f8fafc]">
      <div
        className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-hero-sky/60 blur-3xl animate-float-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-56 w-56 rounded-full bg-[#dce8f5]/50 blur-3xl animate-float-slow [animation-delay:-4s]"
        aria-hidden
      />
      {/* Full-bleed SS2 artwork — matches reference composition */}
      <div className="pointer-events-none absolute inset-0">
        <Image
          src="/images/hero-background.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[52%_38%] lg:object-[50%_36%]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white from-0% via-white/96 via-50% to-white/88 to-100% lg:bg-gradient-to-r lg:from-white lg:from-0% lg:via-white/88 lg:via-[42%] lg:to-transparent lg:to-[62%]"
          aria-hidden
        />
      </div>

      <div className="site-container relative">
        <div className="flex min-h-[min(520px,88dvh)] flex-col justify-center py-8 sm:py-10 lg:min-h-[min(78vh,760px)] lg:py-14">
          <Stagger immediate className="max-w-[540px] lg:max-w-[600px]">
            <StaggerItem>
              <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-hero-navy/10 bg-white/70 px-3 py-1.5 text-[10px] font-sans font-semibold tracking-[0.14em] text-[#5c6573] uppercase backdrop-blur-sm min-[400px]:px-4 min-[400px]:text-[11px] min-[400px]:tracking-[0.2em]">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald-500/80" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                </span>
                Durham Region &amp; beyond
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-balance-safe font-display mt-5 text-[1.75rem] font-medium leading-[1.16] tracking-[-0.01em] text-hero-navy min-[360px]:text-[2.05rem] sm:text-[2.4rem] md:text-[2.75rem] lg:text-[3.05rem]">
                Court document service you can <em className="italic">rely on</em>, across Durham Region
                and beyond.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-[480px] text-[15px] leading-[1.7] text-[#5c6573] md:text-base">
                Process serving, court filing, writ searches and occupancy status for legal
                professionals, businesses and individuals in Ontario.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-8 flex w-full flex-col gap-3 min-[480px]:mt-9 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center sm:gap-4">
                <Link
                  href="/contact"
                  className="btn-primary w-full min-[480px]:w-auto shadow-[0_12px_32px_-12px_rgba(10,31,68,0.55)]"
                >
                  Submit a Service Request
                  <ArrowRight />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-[#c5cdd8] bg-white/80 px-5 py-3 text-[14px] font-medium text-hero-navy shadow-sm backdrop-blur-sm transition hover:border-hero-navy/25 hover:bg-white hover:shadow-md min-[480px]:w-auto min-[480px]:px-7 min-[480px]:py-3.5"
                >
                  Explore Services
                </Link>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        {/* Full-width service bar (SS1) */}
        <motion.div
          className="relative border-t border-black/[0.06] bg-white/95 backdrop-blur-sm"
          initial={reduce ? false : { opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-1 divide-y divide-black/[0.07] min-[360px]:grid-cols-2 min-[360px]:divide-x min-[360px]:divide-y sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
            {HERO_SERVICES.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-h-[72px] flex-row items-center justify-center gap-3 px-4 py-4 transition hover:bg-[#f4f7fb] min-[360px]:min-h-[88px] min-[360px]:flex-col min-[360px]:gap-2.5 min-[360px]:py-5 sm:min-h-[92px] sm:flex-row sm:px-4 sm:py-6 hover:[&_svg]:scale-110"
              >
                <svg
                  className="h-7 w-7 shrink-0 text-[#4a5f7a] transition duration-300 group-hover:scale-110 group-hover:text-hero-navy"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden
                >
                  {item.icon}
                </svg>
                <span className="text-center text-xs font-medium leading-snug text-[#3d4f66] min-[360px]:text-[11px] sm:text-left sm:text-[13px]">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
