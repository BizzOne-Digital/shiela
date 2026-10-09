import Link from "next/link";
import { Reveal, RevealAlternate, RevealSection, RevealText } from "@/components/motion/Reveal";
import {
  MATTER_TYPES,
  SERVICE_AREAS,
  SPECIAL_OFFERS,
} from "@/lib/constants";

const whoWeHelp = [
  {
    title: "Legal Professionals",
    body:
      "Reliable service and filing that meets your deadlines and your file’s requirements. Lawyers and paralegals across Ontario trust clear communication when timelines matter.",
  },
  {
    title: "Small Businesses",
    body:
      "Clear pricing and prompt updates when a legal matter needs to move forward.",
  },
  {
    title: "Members of the Public",
    body:
      "Plain-language help getting your documents served or filed correctly — including self-represented parties navigating court procedures.",
  },
];

const steps = [
  "Submit your request and relevant PDF documents.",
  "The office reviews your requirements and confirms pricing and availability.",
  "The team proceeds once the service is confirmed.",
];

export function SpecialOffersSection() {
  return (
    <section className="border-y border-pale-gray/60 bg-ink text-soft-white">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <RevealText>
            <h2 className="font-display text-2xl font-medium md:text-3xl">Special offers</h2>
          </RevealText>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {SPECIAL_OFFERS.map((offer, i) => (
              <Reveal
                key={i}
                direction={i === 0 ? "left" : "right"}
                distance={72}
                delay={0.12 + i * 0.1}
              >
                <div className="rounded-2xl border border-soft-white/15 bg-soft-white/5 p-6 backdrop-blur">
                  <p className="text-sm leading-relaxed text-soft-white/90">{offer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

export function WhoWeHelpSection() {
  return (
    <section id="who-we-help" className="scroll-mt-24 bg-pale-blue/30 py-20 md:py-28">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealText>
            <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">Who we help</h2>
          </RevealText>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whoWeHelp.map((card, i) => (
              <RevealAlternate key={card.title} index={i}>
                <div className="flex h-full flex-col rounded-2xl border border-pale-gray/70 bg-soft-white p-8 shadow-sm">
                  <h3 className="font-display text-xl text-ink">{card.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">{card.body}</p>
                </div>
              </RevealAlternate>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

export function MatterTypesSection() {
  return (
    <section className="bg-soft-white py-16 md:py-20">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealText>
            <h2 className="font-display text-2xl font-medium text-ink">Types of matters</h2>
          </RevealText>
          <div className="mt-8 flex flex-wrap gap-3">
            {MATTER_TYPES.map((m, i) => (
              <Reveal key={m} direction="up" distance={32} delay={0.1 + i * 0.07}>
                <span
                  className="inline-block rounded-full border border-pale-gray bg-pale-blue/40 px-5 py-2 text-sm font-medium text-ink/85"
                >
                  {m}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-b from-pale-blue/40 to-soft-white py-20 md:py-28">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealText>
            <h2 className="font-display text-3xl font-medium text-ink">How it works</h2>
            <p className="mt-3 max-w-2xl text-sm text-ink/70">
              Urgency selections are requested timeframes, subject to office confirmation.
            </p>
          </RevealText>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step} direction="up" distance={64} delay={0.15 + i * 0.12}>
                <li className="relative rounded-2xl border border-pale-gray/70 bg-soft-white p-8 pt-12">
                  <span className="absolute left-8 top-6 font-display text-4xl text-accent/40">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink/80">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </RevealSection>
    </section>
  );
}

export function ServiceAreaSection() {
  return (
    <section id="service-area" className="scroll-mt-24 border-t border-pale-gray/60 py-20 md:py-28">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal direction="left" distance={80}>
              <h2 className="font-display text-3xl font-medium text-ink md:text-4xl">Service area</h2>
              <p className="mt-4 text-sm text-ink/70">
                Contact us to confirm availability for your service location.
              </p>
            </Reveal>
            <Reveal direction="right" distance={80} delay={0.1}>
              <ul className="space-y-3">
                {SERVICE_AREAS.map((area, i) => (
                  <Reveal key={area} direction="right" distance={40} delay={0.08 + i * 0.06}>
                    <li
                      className="flex items-center justify-between border-b border-pale-gray/60 py-3 text-sm font-medium text-ink/85"
                    >
                      {area}
                      <span className="text-accent" aria-hidden>→</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

type Testimonial = {
  _id: string;
  clientName: string;
  clientRole?: string;
  text: string;
};

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) return null;
  return (
    <section className="bg-pale-blue/25 py-20 md:py-28">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <RevealText>
            <h2 className="font-display text-3xl font-medium text-ink">Testimonials</h2>
          </RevealText>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <RevealAlternate key={t._id} index={i}>
                <blockquote className="flex h-full flex-col rounded-2xl border border-pale-gray/70 bg-soft-white p-8">
                  <p className="flex-1 text-sm leading-relaxed text-ink/80">&ldquo;{t.text}&rdquo;</p>
                  <footer className="mt-6 text-sm font-semibold text-ink">
                    {t.clientName}
                    {t.clientRole ? (
                      <span className="block font-normal text-ink/60">{t.clientRole}</span>
                    ) : null}
                  </footer>
                </blockquote>
              </RevealAlternate>
            ))}
          </div>
        </div>
      </RevealSection>
    </section>
  );
}

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-soft-white md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,238,245,0.15),transparent_50%)]" />
      <RevealSection>
        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-8">
          <RevealText>
            <h2 className="font-display text-3xl font-medium md:text-4xl">
              Ready to submit your request?
            </h2>
          </RevealText>
          <Reveal direction="up" distance={48} delay={0.15}>
            <p className="mx-auto mt-4 max-w-xl text-sm text-soft-white/75">
              Share your service needs and documents — our office will follow up with pricing and
              availability.
            </p>
            <Link
              href="/#contact"
              className="mt-8 inline-flex rounded-full bg-soft-white px-8 py-3.5 text-sm font-semibold text-ink transition hover:scale-[1.02]"
            >
              Submit a Service Request
            </Link>
          </Reveal>
        </div>
      </RevealSection>
    </section>
  );
}
