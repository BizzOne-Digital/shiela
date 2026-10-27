import { BUSINESS } from "@/lib/constants";

export type WhoBlock = { title: string; body: string };

export type SiteContentData = {
  brandName: string;
  heroTitle: string;
  heroText: string;
  ctaLabel: string;
  whoHeading: string;
  whoBlocks: WhoBlock[];
  formHeading: string;
  contactHeading: string;
  email: string;
  phone: string;
  hours: string;
  address: string;
  serviceArea: string;
  responseTime: string;
};

export const DEFAULT_SITE_CONTENT: SiteContentData = {
  brandName: BUSINESS.shortName,
  heroTitle: "Process Serving & Courthouse Services",
  heroText:
    "Reliable service of legal documents, court filings, document retrieval and courthouse runs for legal professionals and self-represented individuals. Submit your request and we'll confirm receipt within one business day.",
  ctaLabel: "Submit a service request",
  whoHeading: "Who we serve",
  whoBlocks: [
    {
      title: "Legal professionals",
      body: "Lawyers, paralegals, law clerks and law offices rely on us to keep files moving. We handle service of documents, court filings, document retrieval and courthouse runs, so your team can stay focused on the matter itself.\n\nPrompt turnaround, careful handling of every document, and a completed affidavit of service for your records.",
    },
    {
      title: "Self-represented individuals",
      body: "Representing yourself? We take care of the practical steps: delivering your documents to the other party, filing at the courthouse and picking up copies, so each step is completed properly and on time.\n\nClear communication from start to finish. We provide document services only and cannot give legal advice.",
    },
  ],
  formHeading: "Service request form",
  contactHeading: "Contact us",
  email: BUSINESS.infoEmail,
  phone: BUSINESS.phone,
  hours: "Mon–Fri, 9:00 am – 5:00 pm",
  address: BUSINESS.address.full,
  serviceArea: "Oshawa, Durham Region & surrounding areas",
  responseTime: "Within 1 business day · rush available",
};

export function phoneToHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}
