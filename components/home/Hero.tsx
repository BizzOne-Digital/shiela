"use client";

import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { IMAGES } from "@/lib/images";

function ArrowRight() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="overflow-x-clip bg-white lg:grid lg:min-h-[min(78vh,760px)] lg:grid-cols-2">
      <div className="flex min-w-0 flex-col justify-center bg-white px-[max(1rem,env(safe-area-inset-left))] py-8 pr-[max(1rem,env(safe-area-inset-right))] sm:px-8 sm:py-12 lg:px-12 lg:py-16 xl:px-16">
        <Stagger immediate className="mx-auto w-full max-w-[560px] lg:mx-0 lg:max-w-[540px]">
          <StaggerItem>
            <Link href="/" className="mb-6 inline-flex max-w-full min-[400px]:mb-8" aria-label="Angel One Documents — Home">
              <LogoWordmark variant="dark" />
            </Link>
          </StaggerItem>
          <StaggerItem>
            <p className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-pale-gray/80 bg-pale-blue/50 px-3 py-1.5 text-[10px] font-sans font-semibold tracking-[0.14em] text-hero-muted uppercase min-[400px]:px-4 min-[400px]:text-[11px] min-[400px]:tracking-[0.2em]">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-emerald-500/80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              Durham Region &amp; beyond
            </p>
          </StaggerItem>
          <StaggerItem>
            <h1 className="text-balance-safe font-display mt-5 text-[1.55rem] font-medium leading-[1.18] tracking-[-0.01em] text-hero-navy min-[360px]:text-[1.85rem] sm:text-[2.15rem] md:text-[2.45rem] lg:text-[2.65rem] xl:text-[2.85rem]">
              Angel One Documents: Process Serving &amp; Court Filing Services
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-[520px] text-[15px] leading-[1.7] text-hero-muted md:text-base">
              Fast, accurate, and dependable process serving and court filing across Durham Region
              and Ontario — for law firms, businesses, and self-represented parties.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex w-full flex-col gap-3 min-[480px]:mt-9 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-center sm:gap-4">
              <Link
                href="/#service-request-form"
                className="btn-primary w-full min-[480px]:w-auto shadow-[0_12px_32px_-12px_rgba(10,31,68,0.55)]"
              >
                Submit a Service Request
                <ArrowRight />
              </Link>
              <Link
                href="/#service-request-form"
                className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-pale-gray bg-white px-5 py-3 text-[14px] font-medium text-hero-navy shadow-sm transition hover:border-hero-navy/25 hover:bg-pale-blue/30 min-[480px]:w-auto min-[480px]:px-7 min-[480px]:py-3.5"
              >
                Online service request
                <ArrowRight />
              </Link>
            </div>
          </StaggerItem>
        </Stagger>
      </div>

      <div className="relative min-h-[min(42vh,360px)] w-full bg-pale-blue/30 sm:min-h-[400px] lg:min-h-full">
        <Image
          src={IMAGES.heroBg}
          alt=""
          fill
          priority
          className="object-cover object-center lg:object-[58%_42%]"
          sizes="(max-width: 1023px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
