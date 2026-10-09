"use client";

import Link from "next/link";
import { ServiceIcon } from "@/components/icons/ServiceIcon";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";

type Service = {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
};

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="scroll-mt-24 bg-soft-white py-20 md:py-28">
      <RevealSection>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
              <Reveal direction="left" distance={72}>
                <RevealText>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                    Services
                  </p>
                  <h2 className="font-display mt-4 text-3xl font-medium leading-tight text-ink md:text-4xl">
                    Everything your
                    <br />
                    file needs to move.
                  </h2>
                </RevealText>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  Select a service on our contact form — we&apos;ll confirm scope, pricing, and timing
                  with you directly.
                </p>
              </Reveal>
            </div>
            <div className="mt-12 space-y-5 lg:col-span-8 lg:mt-0">
              {services.map((service, index) => (
                <Reveal
                  key={service._id}
                  direction={index % 2 === 0 ? "right" : "left"}
                  distance={64}
                  delay={0.08 + index * 0.1}
                >
                  <article
                    className="group relative overflow-hidden rounded-2xl border border-pale-gray/80 bg-pale-blue/25 p-6 transition-shadow duration-300 hover:shadow-md md:p-8"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-soft-white text-ink shadow-sm transition group-hover:bg-ink group-hover:text-soft-white">
                        <ServiceIcon iconKey={service.iconKey} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-medium text-ink">{service.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink/75">{service.description}</p>
                        <Link
                          href={`/?service=${service._id}#contact`}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-ink"
                        >
                          Request This Service
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeWidth="1.5" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
