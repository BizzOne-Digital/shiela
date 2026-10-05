export type ServiceLike = {
  _id: string;
  title: string;
  description: string;
  iconKey: string;
};

const FEATURED_ICON_KEYS = new Set(["serve", "filing"]);

export function partitionFeaturedServices(services: ServiceLike[]) {
  const featured = services.filter((s) => FEATURED_ICON_KEYS.has(s.iconKey));
  const others = services.filter((s) => !FEATURED_ICON_KEYS.has(s.iconKey));

  featured.sort((a, b) => {
    const order: Record<string, number> = { serve: 0, filing: 1 };
    return (order[a.iconKey] ?? 99) - (order[b.iconKey] ?? 99);
  });

  return { featured, others };
}

export function smallServicesGridClass(count: number) {
  if (count <= 1) return "grid-cols-1";
  if (count === 2) return "grid-cols-1 min-[400px]:grid-cols-2";
  if (count === 3) return "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4";
  return "grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-3";
}
