import Link from "next/link";
import { SectionHeading } from "@/components/marketing/SectionHeading";
import { Reveal, RevealSection, RevealText } from "@/components/motion/Reveal";
import { BUSINESS } from "@/lib/constants";

function ContactIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hero-sky/90 text-hero-navy">
      {children}
    </span>
  );
}

export function HomeContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white py-14 md:py-20">
      <RevealSection>
        <div className="site-container-narrow">
          <RevealText>
            <SectionHeading
              eyebrow="Get in touch"
              title="Contact"
              description="Request a quote or submit a service request — we will review your requirements and follow up."
            />
          </RevealText>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <Reveal direction="up" distance={40}>
              <ul className="space-y-4 rounded-2xl border border-pale-gray/60 bg-[#fafbfc] p-6 md:p-8">
                <li className="flex items-center gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5l1.5-2 5 1.5v3a2 2 0 01-2 2C10 19 5 14 5 7.5a2 2 0 012-3.5z" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <a href={BUSINESS.phoneHref} className="font-medium text-hero-navy hover:underline">
                    {BUSINESS.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.4" />
                      <path d="M3 8l9 6 9-6" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <a
                    href={`mailto:${BUSINESS.infoEmail}`}
                    className="whitespace-nowrap text-sm text-hero-navy/90 hover:underline min-[400px]:text-base"
                  >
                    {BUSINESS.infoEmail}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
                      <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <span className="text-sm leading-relaxed text-hero-muted">{BUSINESS.address.full}</span>
                </li>
              </ul>
            </Reveal>

            <Reveal direction="up" distance={40} delay={0.1}>
              <div className="flex flex-col gap-3 lg:min-w-[240px]">
                <Link href="/contact" className="btn-primary w-full shadow-[0_12px_32px_-12px_rgba(10,31,68,0.45)]">
                  Submit a Service Request
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-pale-gray bg-white px-6 py-3 text-sm font-medium text-hero-navy transition hover:border-hero-navy/25 hover:bg-[#fafbfc]"
                >
                  Request a Quote
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
