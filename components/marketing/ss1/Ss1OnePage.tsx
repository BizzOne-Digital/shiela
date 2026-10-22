import Image from "next/image";
import Link from "next/link";
import { ServiceRequestForm } from "@/components/contact/ServiceRequestForm";
import { BUSINESS } from "@/lib/constants";
import { IMAGES } from "@/lib/images";

const WHO_SERVE_SS1 = [
  {
    title: "Legal professionals",
    paragraphs: [
      "A trusted partner for lawyers and paralegals who need fast, accurate and well-documented service.",
      "We handle process serving, court filings and related courthouse work so your team can stay focused on the file — with clear updates and affidavits ready to file.",
    ],
  },
  {
    title: "Self-represented individuals",
    paragraphs: [
      "Plain-language guidance on what we can do, and a straightforward process from start to finish.",
      "Whether you need documents served or filed, we explain the steps in clear terms and keep you informed along the way.",
    ],
  },
] as const;

type FormService = { _id: string; title: string; iconKey?: string };

export function Ss1OnePage({
  services,
  preselectedServiceId,
}: {
  services: FormService[];
  preselectedServiceId?: string;
}) {
  return (
    <div id="top" className="w-full bg-white text-hero-navy">
      <header className="w-full border-b border-pale-gray/70">
        <div className="site-container py-8 text-center md:py-10">
          <Link href="/" className="inline-flex justify-center" aria-label="Angel One Documents — Home">
            <Image
              src={IMAGES.logoBrand}
              alt="Angel One Documents"
              width={640}
              height={160}
              priority
              className="h-[4.5rem] w-auto max-w-[min(92vw,520px)] rounded-sm object-contain min-[400px]:h-[5.25rem] md:h-28 md:max-w-[560px]"
            />
          </Link>
          <nav className="mt-5 flex items-center justify-center gap-2 text-sm text-hero-navy/85" aria-label="Page">
            <Link href="/#top" className="hover:underline">Home</Link>
            <span className="text-pale-gray" aria-hidden>|</span>
            <Link href="/#contact-us" className="hover:underline">Contact</Link>
          </nav>
        </div>
      </header>

      <section className="w-full border-b border-pale-gray/70 bg-pale-blue/60">
        <div className="site-container py-10 text-center md:py-12">
          <h1 className="font-display text-2xl font-medium text-hero-navy md:text-3xl">
            Process Serving &amp; Courthouse Services
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-hero-navy/85 md:text-[15px]">
            Reliable service of legal documents for legal professionals and self-represented individuals.
            Submit your documents and deadline. We&apos;ll confirm pricing and timing within one business day.
          </p>
          <Link
            href="/#service-request-form"
            className="btn-primary mt-8 inline-flex min-h-[44px] px-8 shadow-none"
          >
            Submit a service request
          </Link>
        </div>
      </section>

      <section className="w-full border-b border-pale-gray/70">
        <div className="site-container py-10 md:py-12">
          <h2 className="text-lg font-bold text-hero-navy md:text-xl">Who we serve</h2>
          <div className="mt-6 space-y-0">
            {WHO_SERVE_SS1.map((block, index) => (
              <div
                key={block.title}
                className={`border border-pale-gray/70 bg-white p-5 md:p-6 ${index > 0 ? "border-t-0" : ""}`}
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
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-hero-muted">
            Please fill in the form below with as much detail as possible. For your safety, do not include any
            sensitive or personal information (such as passwords, financial data or identification numbers).
          </p>
          <p className="mt-2 text-sm text-hero-muted">Upload PDF documents only.</p>
          <div className="mt-6 min-w-0">
            <ServiceRequestForm services={services} preselectedServiceId={preselectedServiceId} embedded />
          </div>
        </div>
      </section>

      <section id="contact-us" className="scroll-mt-6 w-full">
        <div className="site-container pb-16 pt-10 md:pb-20 md:pt-12">
          <h2 className="text-lg font-bold text-hero-navy md:text-xl">Contact us</h2>
          <dl className="mt-6 space-y-5 text-sm md:text-[15px]">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${BUSINESS.infoEmail}`} className="text-hero-navy underline-offset-2 hover:underline">
                  {BUSINESS.infoEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Phone</dt>
              <dd className="mt-1">
                <a href={BUSINESS.phoneHref} className="text-hero-navy hover:underline">
                  {BUSINESS.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Hours</dt>
              <dd className="mt-1 text-hero-navy/90">Mon–Fri, 9:00 am – 5:00 pm</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Address</dt>
              <dd className="mt-1">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS.address.full)}`}
                  className="text-hero-navy underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {BUSINESS.address.full}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Service area</dt>
              <dd className="mt-1 text-hero-navy/90">Oshawa, Durham Region &amp; surrounding areas</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-hero-muted">Response time</dt>
              <dd className="mt-1 text-hero-navy/90">Within 1 business day — rush available</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
