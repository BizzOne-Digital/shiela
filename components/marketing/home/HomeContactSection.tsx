import Link from "next/link";
import { ServiceRequestForm } from "@/components/contact/ServiceRequestForm";
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

type FormService = { _id: string; title: string; iconKey?: string };

export function HomeContactSection({
  services,
  preselectedServiceId,
}: {
  services: FormService[];
  preselectedServiceId?: string;
}) {
  return (
    <section id="contact" className="scroll-mt-24 overflow-x-clip bg-white py-12 md:py-20">
      <RevealSection>
        <div className="site-container-narrow">
          <RevealText>
            <SectionHeading
              eyebrow="4. Get started"
              title="Contact Angel One Documents"
              description="Send us your documents and deadline. We'll confirm pricing and timing, usually within one business day."
            />
          </RevealText>

          <Reveal direction="up" distance={32} delay={0.05}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Link href="#service-request-form" className="btn-primary min-h-[44px] px-8 shadow-[0_12px_32px_-12px_rgba(10,31,68,0.4)]">
                Request service online
              </Link>
              <a
                href={BUSINESS.phoneHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-pale-gray bg-pale-blue/40 px-8 py-3 text-sm font-medium text-hero-navy transition hover:border-hero-navy/25"
              >
                {BUSINESS.phone}
              </a>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start">
            <Reveal direction="up" distance={40}>
              <ul className="space-y-4 rounded-2xl border border-pale-gray/60 bg-pale-blue/25 p-6 md:p-8">
                <li className="flex items-center gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5l1.5-2 5 1.5v3a2 2 0 01-2 2C10 19 5 14 5 7.5a2 2 0 012-3.5z" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <div>
                    <p className="text-xs font-semibold text-hero-muted uppercase tracking-wide">Phone</p>
                    <a href={BUSINESS.phoneHref} className="text-sm font-medium text-hero-navy hover:underline">
                      {BUSINESS.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.4" />
                      <path d="M3 8l9 6 9-6" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <div>
                    <p className="text-xs font-semibold text-hero-muted uppercase tracking-wide">Email</p>
                    <a
                      href={`mailto:${BUSINESS.infoEmail}`}
                      className="break-all text-sm text-hero-navy hover:underline min-[400px]:break-normal"
                    >
                      {BUSINESS.infoEmail}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M4 6h16v12H4z" strokeWidth="1.4" />
                      <path d="M8 10h8M8 14h5" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </ContactIcon>
                  <div>
                    <p className="text-xs font-semibold text-hero-muted uppercase tracking-wide">Web</p>
                    <a
                      href={BUSINESS.websiteUrl}
                      className="text-sm text-hero-navy hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      www.angelonedocuments.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ContactIcon>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
                      <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
                    </svg>
                  </ContactIcon>
                  <div>
                    <p className="text-xs font-semibold text-hero-muted uppercase tracking-wide">Mailing address</p>
                    <span className="text-sm leading-relaxed text-hero-muted">{BUSINESS.address.full}</span>
                  </div>
                </li>
              </ul>
            </Reveal>

            <Reveal direction="up" distance={40} delay={0.08}>
              <div id="service-request-form" className="scroll-mt-28 min-w-0">
                <h3 className="font-display text-lg font-medium text-hero-navy md:text-xl">Online service request</h3>
                <p className="mt-2 text-sm leading-relaxed text-hero-muted">
                  Upload PDF documents only. You will receive a thank-you email from{" "}
                  <a
                    href={`mailto:${BUSINESS.receptionEmail}`}
                    className="break-all font-medium text-hero-navy hover:underline min-[400px]:break-normal"
                  >
                    {BUSINESS.receptionEmail}
                  </a>{" "}
                  once your request is submitted.
                </p>
                <div className="mt-6 min-w-0">
                  <ServiceRequestForm
                    services={services}
                    preselectedServiceId={preselectedServiceId}
                    embedded
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </RevealSection>
    </section>
  );
}
