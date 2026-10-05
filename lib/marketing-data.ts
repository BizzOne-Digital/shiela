import { IMAGES } from "@/lib/images";

export type WhoWeHelpCard = {
  id: string;
  title: string;
  body: string;
  image: string;
};

export const whoWeHelp: WhoWeHelpCard[] = [
  {
    id: "who-legal",
    title: "Legal Professionals",
    body:
      "Reliable service and filing that meets your deadlines and your file's requirements.",
    image: IMAGES.whoLegal,
  },
  {
    id: "who-business",
    title: "Small Businesses",
    body: "Clear pricing and prompt updates when a legal matter needs to move forward.",
    image: IMAGES.whoBusiness,
  },
  {
    id: "who-public",
    title: "Members of the Public",
    body:
      "Plain-language help getting your documents served or filed correctly — including self-represented parties.",
    image: IMAGES.whoPublic,
  },
];

export const howItWorks = [
  {
    title: "Submit",
    body: "Submit your request and relevant PDF documents through our contact form.",
  },
  {
    title: "Review",
    body: "The office reviews your requirements and confirms pricing and availability.",
  },
  {
    title: "Confirm",
    body: "The team proceeds once the service is confirmed and you're ready to move forward.",
  },
];

export const FEATURED_FALLBACKS: {
  iconKey: "serve" | "filing";
  image: string;
  fallbackTitle: string;
  fallbackDescription: string;
}[] = [
  {
    iconKey: "serve",
    image: IMAGES.processServing,
    fallbackTitle: "Process Serving",
    fallbackDescription:
      "Professional delivery of court documents with documentation prepared for your file.",
  },
  {
    iconKey: "filing",
    image: IMAGES.courtFiling,
    fallbackTitle: "Court Filing",
    fallbackDescription:
      "Physical filing at the appropriate court office when in-person submission is required.",
  },
];

export type MarketingService = {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
};

export type MarketingTestimonial = {
  _id: string;
  clientName: string;
  clientRole?: string;
  text: string;
};
