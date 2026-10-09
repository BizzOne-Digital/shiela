import Link from "next/link";
import { Reveal, RevealSection } from "@/components/motion/Reveal";

export function RequestQuoteCta() {
  return (
    <section className="site-container-narrow py-10 md:py-16">
      <RevealSection>
        <Reveal direction="up" distance={48}>
          <div className="relative overflow-hidden rounded-2xl bg-hero-navy px-5 py-10 text-white min-[400px]:rounded-3xl min-[400px]:px-8 min-[400px]:py-12 md:px-14 md:py-14">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.14),transparent_45%)]"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.28em] text-white/60 uppercase">
                  Ready to get started?
                </p>
                <h2 className="font-display mt-3 text-2xl font-medium min-[400px]:text-3xl md:text-4xl">
                  Request a Quote
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/75">
                  Get professional court document services, tailored to your needs.
                </p>
              </div>
              <Link
                href="/#contact"
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-hero-navy shadow-lg transition hover:-translate-y-0.5 hover:bg-white/95 hover:shadow-xl active:translate-y-0 min-[480px]:w-auto min-[480px]:px-8"
              >
                Request a Quote
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </RevealSection>
    </section>
  );
}
