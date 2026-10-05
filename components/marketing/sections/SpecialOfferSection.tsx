import { Reveal, RevealSection } from "@/components/motion/Reveal";
import { SPECIAL_OFFERS } from "@/lib/constants";

export function SpecialOfferSection() {
  const primaryOffer = SPECIAL_OFFERS[0];

  return (
    <section className="relative overflow-hidden bg-hero-sky/80 py-10 md:py-12">
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)] opacity-60"
        aria-hidden
      />
      <RevealSection>
        <div className="relative site-container-narrow">
          <Reveal direction="up" distance={40}>
            <div className="flex flex-col items-start gap-6 rounded-2xl border border-white/80 bg-white/70 px-6 py-8 shadow-[0_16px_48px_-24px_rgba(10,31,68,0.2)] backdrop-blur-md md:flex-row md:items-center md:gap-10 md:px-10">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-hero-navy shadow-sm">
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M8 4h8l4 4v14H4V4h4z" strokeWidth="1.4" />
                  <path d="M12 11v6M9 14h6" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold tracking-[0.24em] text-hero-navy/60 uppercase">Special offer</p>
                <h2 className="font-display mt-2 text-2xl font-medium text-hero-navy md:text-3xl">
                  Flat-rate process serving
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-hero-navy/75">{primaryOffer}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </RevealSection>
    </section>
  );
}
