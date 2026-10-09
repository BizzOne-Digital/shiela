import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { howItWorks } from "@/lib/marketing-data";

export function HowItWorksSection({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section className="mesh-sky py-16 md:py-24">
      <RevealSection>
        <div className="site-container-narrow">
          {showHeading ? (
            <RevealText>
              <SectionHeading eyebrow="Simple, efficient, reliable" title="How It Works" />
            </RevealText>
          ) : null}
          <ol className={`relative grid gap-8 md:grid-cols-3 ${showHeading ? "mt-12" : ""}`}>
            <div
              className="pointer-events-none absolute top-6 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-hero-navy/15 to-transparent md:block"
              aria-hidden
            />
            {howItWorks.map((step, i) => (
              <Reveal key={step.title} direction="up" distance={48} delay={0.1 + i * 0.1}>
                <li className="relative text-center">
                  <span
                    className="relative z-[1] mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white font-display text-lg font-medium text-hero-navy shadow-[0_8px_24px_-12px_rgba(10,31,68,0.35)] ring-4 ring-[#f4f7fb]"
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-display mt-5 text-lg font-medium text-hero-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-hero-muted">{step.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <p className="mt-10 text-center text-sm text-hero-muted">
            <Link href="/#contact" className="font-semibold text-hero-navy underline-offset-2 hover:underline">
              Start a service request
            </Link>
          </p>
        </div>
      </RevealSection>
    </section>
  );
}
