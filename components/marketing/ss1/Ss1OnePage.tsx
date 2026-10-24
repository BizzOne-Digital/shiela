import Link from "next/link";
import { ServiceRequestForm } from "@/components/contact/ServiceRequestForm";
import { BUSINESS } from "@/lib/constants";

const WHO_SERVE_SS1 = [
  {
    title: "Legal professionals",
    paragraphs: [
      "Lawyers, paralegals, law clerks and law offices rely on us to keep files moving. We handle service of documents, court filings, document retrieval and courthouse runs, so your team can stay focused on the matter itself.",
      "Prompt turnaround, careful handling of every document, and a completed affidavit of service for your records.",
    ],
  },
  {
    title: "Self-represented individuals",
    paragraphs: [
      "Representing yourself? We take care of the practical steps: delivering your documents to the other party, filing at the courthouse and picking up copies, so each step is completed properly and on time.",
      "Clear communication from start to finish. We provide document services only and cannot give legal advice.",
    ],
  },
] as const;

type FormService = { _id: string; title: string; iconKey?: string };

function formatAddressLines() {
  const parts = BUSINESS.address.line1.split(", ");
  const street = parts[0] ?? BUSINESS.address.line1;
  const unit = parts.length > 1 ? parts.slice(1).join(", ") : null;
  const cityLine = `${BUSINESS.address.city}, ${BUSINESS.address.province} ${BUSINESS.address.postal}`;
  return { street, unit, cityLine };
}

export function Ss1OnePage({
  services,
  preselectedServiceId,
}: {
  services: FormService[];
  preselectedServiceId?: string;
}) {
  const addressLines = formatAddressLines();

  return (
    <div id="top" className="w-full bg-white text-hero-navy">
      <header className="w-full border-b border-pale-gray/70">
        <div className="site-container py-6 text-left md:py-8">
          <Link
            href="/"
            className="text-xl font-semibold text-hero-navy hover:underline md:text-2xl"
          >
            {BUSINESS.shortName}
          </Link>
          <nav className="mt-3 flex items-center justify-start gap-2 text-sm text-hero-navy/85" aria-label="Page">
            <Link href="/#top" className="hover:underline">Home</Link>
            <span className="text-pale-gray" aria-hidden>|</span>
            <Link href="/#contact-us" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="w-full border-b border-pale-gray/50 bg-[#E3F0FB]">
        <div className="site-container py-10 text-center md:py-14">
          <h1 className="text-2xl font-bold text-[#35546C] md:text-[1.75rem] md:leading-tight lg:text-3xl">
            Process Serving &amp; Courthouse Services
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-[#4A4A4A] md:text-[15px] md:leading-7">
            Reliable service of legal documents, court filings, document retrieval and courthouse runs for legal
            professionals and self-represented individuals. Submit your request and we&apos;ll confirm receipt within
            one business day.
          </p>
          <Link
            href="/#service-request-form"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#5D8AB4] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4f7aa3]"
          >
            Submit a service request
          </Link>
        </div>
      </section>

      <section className="w-full border-b border-pale-gray/70">
        <div className="site-container py-10 md:py-12">
          <h2 className="text-center text-lg font-bold text-hero-navy md:text-xl">Who we serve</h2>
          <div className="mt-6 space-y-4">
            {WHO_SERVE_SS1.map((block) => (
              <div
                key={block.title}
                className="rounded-xl border border-pale-gray/70 bg-white p-5 md:p-6"
              >
                <h3 className="font-bold text-hero-navy">{block.title}</h3>
                {block.paragraphs.map((p) => (
                  <p key={p} className="mt-3 text-sm leading-relaxed text-hero-navy/85 md:text-[15px]">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="service-request-form" className="scroll-mt-6 w-full border-b border-pale-gray/70">
        <div className="site-container py-10 md:py-12">
          <h2 className="text-lg font-bold text-hero-navy md:text-xl">Service request form</h2>
          <div className="mt-6 min-w-0">
            <ServiceRequestForm services={services} preselectedServiceId={preselectedServiceId} embedded />
          </div>
        </div>
      </section>

      <section id="contact-us" className="scroll-mt-6 w-full">
        <div className="site-container pb-16 pt-10 md:pb-20 md:pt-12">
          <div className="rounded-xl border border-pale-gray/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-bold text-hero-navy md:text-[1.75rem]">Contact us</h2>
            <dl className="mt-6">
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Email</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  <a href={`mailto:${BUSINESS.infoEmail}`} className="hover:underline">
                    {BUSINESS.infoEmail}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Phone</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  <a href={BUSINESS.phoneHref} className="hover:underline">
                    {BUSINESS.phone}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Hours</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">Mon–Fri, 9:00 am – 5:00 pm</dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Address</dt>
                <dd className="mt-1 text-base font-semibold leading-snug text-hero-navy">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address.full)}`}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {addressLines.street}
                    {addressLines.unit ? (
                      <>
                        <br />
                        {addressLines.unit}
                      </>
                    ) : null}
                    <br />
                    {addressLines.cityLine}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Service area</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  Oshawa, Durham Region &amp; surrounding areas
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Response time</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  Within 1 business day · rush available
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
