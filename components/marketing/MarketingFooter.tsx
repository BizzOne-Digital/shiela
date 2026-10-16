import Link from "next/link";
import { LogoWordmark } from "@/components/brand/LogoWordmark";
import { BUSINESS, NAV_SERVICES_MENU } from "@/lib/constants";

const exploreLinks = [
  { label: "Home", href: "/" },
  { label: "Service Area", href: "/service-area" },
  { label: "Testimonials", href: "/testimonials" },
];

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.22em] text-white/50 uppercase">{children}</p>
  );
}

function PinIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-white/55" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path d="M12 21s7-5.5 7-11a7 7 0 10-14 0c0 5.5 7 11 7 11z" strokeWidth="1.4" />
      <circle cx="12" cy="10" r="2" strokeWidth="1.4" />
    </svg>
  );
}

export function MarketingFooter() {
  const year = new Date().getFullYear();
  const serviceLinks = NAV_SERVICES_MENU.filter((item) => item.href !== "/#services").slice(0, 5);

  return (
    <footer className="relative overflow-hidden bg-hero-navy text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(255,255,255,0.08),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full border border-white/[0.06]"
        aria-hidden
      />

      <div className="site-container safe-bottom relative pt-14 pb-8 md:pt-16 md:pb-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex max-w-full min-w-0 text-white" aria-label="Angel One Documents — Home">
              <LogoWordmark compact className="max-[380px]:origin-left" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">{BUSINESS.description}</p>
            <p className="mt-4 text-xs font-medium tracking-wide text-white/45 uppercase">{BUSINESS.locationLabel}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
            <div>
              <FooterHeading>Explore</FooterHeading>
              <ul className="mt-4 space-y-2.5">
                {exploreLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/80 transition hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <FooterHeading>Services</FooterHeading>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/#services"
                    className="text-sm font-medium text-white transition hover:underline hover:underline-offset-4"
                  >
                    All services
                  </Link>
                </li>
                {serviceLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-white/80 transition hover:text-white hover:underline hover:underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>Get in touch</FooterHeading>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
              <ul className="space-y-4 text-sm">
                <li>
                  <a href={BUSINESS.phoneHref} className="group flex items-center gap-3 text-white/90 hover:text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white/90 group-hover:bg-white/15">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M6.5 4h3l1.5 5-2 1.5a11 11 0 005 5l1.5-2 5 1.5v3a2 2 0 01-2 2C10 19 5 14 5 7.5a2 2 0 012-3.5z" strokeWidth="1.4" />
                      </svg>
                    </span>
                    <span className="font-medium">{BUSINESS.phone}</span>
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${BUSINESS.infoEmail}`}
                    className="group flex items-center gap-3 text-white/85 hover:text-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/90 group-hover:bg-white/15">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <rect x="3" y="6" width="18" height="14" rx="2" strokeWidth="1.4" />
                        <path d="M3 8l9 6 9-6" strokeWidth="1.4" />
                      </svg>
                    </span>
                    <span className="min-w-0 break-all text-[13px] min-[400px]:text-sm sm:break-normal">
                      {BUSINESS.infoEmail}
                    </span>
                  </a>
                </li>
                <li className="flex gap-3 text-white/75">
                  <PinIcon />
                  <span className="text-sm leading-relaxed">{BUSINESS.address.full}</span>
                </li>
              </ul>
              <Link
                href="/#contact"
                className="mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-hero-navy transition hover:bg-white/95"
              >
                Request a Quote
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>© {year} {BUSINESS.shortName}. All rights reserved.</p>
          <p className="text-white/40">Court document services · Durham Region &amp; Ontario</p>
        </div>
      </div>
    </footer>
  );
}
