import { BUSINESS as B } from "@/lib/constants";

export const BUSINESS = B;

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: B.name,
    telephone: B.phone,
    email: B.infoEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: "27-1300 King Street East, Unit 247",
      addressLocality: "Oshawa",
      addressRegion: "ON",
      postalCode: "L1H 8J4",
      addressCountry: "CA",
    },
    url: siteUrl(),
    description: B.description,
  };
}
