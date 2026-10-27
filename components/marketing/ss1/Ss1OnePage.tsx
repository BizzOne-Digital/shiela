import Link from "next/link";
import { ServiceRequestForm } from "@/components/contact/ServiceRequestForm";
import { phoneToHref, type SiteContentData } from "@/lib/site-content";

function formatAddressLines(address: string) {
  const parts = address.split(", ");
  if (parts.length < 3) return { street: address, unit: null, cityLine: "" };
  const cityLine = parts.slice(-2).join(", ");
  const street = parts[0];
  const unit = parts.length > 3 ? parts.slice(1, -2).join(", ") : null;
  return { street, unit, cityLine };
}

export function Ss1OnePage({ content }: { content: SiteContentData }) {
  const addressLines = formatAddressLines(content.address);

  return (
    <div id="top" className="w-full bg-white text-hero-navy">
      <header className="w-full border-b border-pale-gray/70">
        <div className="site-container py-6 text-left md:py-8">
          <Link
            href="/"
            className="text-xl font-semibold text-hero-navy hover:underline md:text-2xl"
          >
            {content.brandName}
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
            {content.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[#4A4A4A] md:text-[15px] md:leading-7">
            {content.heroText}
          </p>
          <Link
            href="/#service-request-form"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[#5D8AB4] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#4f7aa3]"
          >
            {content.ctaLabel}
          </Link>
        </div>
      </section>

      {content.whoBlocks.length > 0 && (
        <section className="w-full border-b border-pale-gray/70">
          <div className="site-container py-10 md:py-12">
            <h2 className="text-center text-lg font-bold text-hero-navy md:text-xl">{content.whoHeading}</h2>
            <div className="mt-6 space-y-4">
              {content.whoBlocks.map((block, i) => (
                <div
                  key={`${block.title}-${i}`}
                  className="rounded-xl border border-pale-gray/70 bg-white p-5 md:p-6"
                >
                  <h3 className="font-bold text-hero-navy">{block.title}</h3>
                  {block.body
                    .split(/\n\s*\n/)
                    .filter((p) => p.trim())
                    .map((p, j) => (
                      <p key={j} className="mt-3 text-sm leading-relaxed text-hero-navy/85 md:text-[15px]">
                        {p}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="service-request-form" className="scroll-mt-6 w-full border-b border-pale-gray/70">
        <div className="site-container py-10 md:py-12">
          <h2 className="text-lg font-bold text-hero-navy md:text-xl">{content.formHeading}</h2>
          <div className="mt-6 min-w-0">
            <ServiceRequestForm embedded />
          </div>
        </div>
      </section>

      <section id="contact-us" className="scroll-mt-6 w-full">
        <div className="site-container pb-16 pt-10 md:pb-20 md:pt-12">
          <div className="rounded-xl border border-pale-gray/70 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-bold text-hero-navy md:text-[1.75rem]">{content.contactHeading}</h2>
            <dl className="mt-6">
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Email</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  <a href={`mailto:${content.email}`} className="hover:underline">
                    {content.email}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Phone</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">
                  <a href={phoneToHref(content.phone)} className="hover:underline">
                    {content.phone}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Hours</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">{content.hours}</dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Address</dt>
                <dd className="mt-1 text-base font-semibold leading-snug text-hero-navy">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}`}
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
                    {addressLines.cityLine ? (
                      <>
                        <br />
                        {addressLines.cityLine}
                      </>
                    ) : null}
                  </a>
                </dd>
              </div>
              <div className="mb-5">
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Service area</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">{content.serviceArea}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Response time</dt>
                <dd className="mt-1 text-base font-semibold text-hero-navy">{content.responseTime}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
