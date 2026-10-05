import { Service } from "@/models/Service";
import { slugify } from "@/lib/utils";

export const SERVICE_SEEDS = [
  {
    title: "Process Serving",
    description:
      "Professional delivery of court documents to parties named in your matter, with documentation prepared for your file.",
    iconKey: "serve",
    displayOrder: 1,
  },
  {
    title: "Court Filing — In Person",
    description:
      "Physical filing of documents at the appropriate court office when in-person submission is required.",
    iconKey: "filing",
    displayOrder: 2,
  },
  {
    title: "e-Filing",
    description:
      "Electronic submission of documents through Ontario’s court filing systems where e-filing is available for your matter.",
    iconKey: "efile",
    displayOrder: 3,
  },
  {
    title: "Writ Searches",
    description:
      "Searches of registered writs and related records to support due diligence in real estate and civil matters.",
    iconKey: "search",
    displayOrder: 4,
  },
  {
    title: "Occupancy Status Confirmations",
    description:
      "Confirmation of occupancy status for properties when your transaction or proceeding requires verified information.",
    iconKey: "occupancy",
    displayOrder: 5,
  },
] as const;

export async function seedServicesToDb(): Promise<string[]> {
  const titles: string[] = [];
  for (const s of SERVICE_SEEDS) {
    const slug = slugify(s.title);
    await Service.findOneAndUpdate(
      { slug },
      { ...s, slug, active: true },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    titles.push(s.title);
  }
  return titles;
}
