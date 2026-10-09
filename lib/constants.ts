export const BUSINESS = {
  name: "ANGEL ONE DOCUMENTS",
  shortName: "Angel One Documents",
  phone: "905-213-7809",
  phoneHref: "tel:+19052137809",
  infoEmail: "info@angelonedocuments.com",
  serviceRequestsEmail: "servicerequests@angelonedocuments.com",
  receptionEmail: "reception@angelonedocuments.com",
  websiteUrl: "https://www.angelonedocuments.com",
  address: {
    line1: "27-1300 King Street East, Unit 247",
    city: "Oshawa",
    province: "Ontario",
    postal: "L1H 8J4",
    full: "27-1300 King Street East, Unit 247, Oshawa, Ontario L1H 8J4",
  },
  headline:
    "Court document service you can rely on, across Durham Region and beyond.",
  description:
    "Process serving, court filing, writ searches and occupancy status for lawyers, paralegals, small businesses and individuals with a legal matter in Ontario.",
  locationLabel: "Durham Region & surrounding Ontario communities",
} as const;

export const REQUESTER_TYPES = [
  "Legal Professional",
  "Small Business",
  "Member of the Public",
] as const;

export const URGENCY_OPTIONS = [
  { value: "standard", label: "Standard — Within the Week" },
  { value: "priority", label: "Priority — Within 48 Hours" },
  { value: "rush", label: "Rush — Same Day" },
] as const;

export const ADD_ON_OPTIONS = [
  "Affidavit of Service",
  "Additional Attempts",
  "Locate a Person",
  "Courier Return of Originals",
] as const;

export const REQUEST_STATUSES = [
  "New",
  "Under Review",
  "Awaiting Client",
  "In Progress",
  "Completed",
  "Cancelled",
] as const;

export const MATTER_TYPES = [
  "Family",
  "Civil",
  "Personal Injury",
  "Estates",
  "Real Estate",
] as const;

export const SERVICE_AREAS = [
  "Durham Region",
  "Brampton",
  "Cobourg",
  "Newmarket",
  "Lake Ontario area and surrounding Ontario locations",
] as const;

export const SPECIAL_OFFERS = [
  "Flat-rate process serving with zero mileage fees. 3 attempts and affidavit included within local area.",
  "Inquire about our high-volume partner pricing for ongoing Civil, Personal Injury, Family and Small Claims matters.",
] as const;

export const MAX_PDF_BYTES = 10 * 1024 * 1024;
export const MATTER_DETAILS_MAX = 5000;

export const ICON_KEYS = [
  "serve",
  "filing",
  "efile",
  "search",
  "occupancy",
  "document",
  "folder",
  "stamp",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

/** Footer / in-page service links (homepage sections) */
export const NAV_SERVICES_MENU = [
  { label: "All services", href: "/#services" },
  { label: "Process Serving", href: "/#service-serve" },
  { label: "Court Filing — In Person", href: "/#service-filing" },
  { label: "e-Filing", href: "/#service-efile" },
  { label: "Writ Searches", href: "/#service-search" },
  { label: "Occupancy Status Confirmations", href: "/#service-occupancy" },
] as const;

export const NAV_WHO_MENU = [
  { label: "Overview", href: "/#who-we-help" },
  { label: "Legal Professionals", href: "/#who-legal" },
  { label: "Small Businesses", href: "/#who-business" },
  { label: "Members of the Public", href: "/#who-public" },
] as const;
