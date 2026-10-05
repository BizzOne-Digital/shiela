import type { IconKey } from "@/lib/constants";

const paths: Record<IconKey, React.ReactNode> = {
  serve: (
    <>
      <path d="M12 3v12M8 7l4-4 4 4M5 21h14" strokeWidth="1.5" />
      <rect x="6" y="11" width="12" height="10" rx="1" strokeWidth="1.5" />
    </>
  ),
  filing: (
    <>
      <path d="M8 4h8l4 4v14H4V4h4z" strokeWidth="1.5" />
      <path d="M16 4v4h4M8 12h8M8 16h6" strokeWidth="1.5" />
    </>
  ),
  efile: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" strokeWidth="1.5" />
      <path d="M12 10v6M9 13l3 3 3-3" strokeWidth="1.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" strokeWidth="1.5" />
      <path d="M16 16l5 5" strokeWidth="1.5" />
    </>
  ),
  occupancy: (
    <>
      <path d="M4 20V10l8-6 8 6v10" strokeWidth="1.5" />
      <path d="M9 20v-6h6v6" strokeWidth="1.5" />
    </>
  ),
  document: (
    <>
      <path d="M8 4h8l4 4v14H4V4h4z" strokeWidth="1.5" />
      <path d="M12 11v6M9 14h6" strokeWidth="1.5" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7h6l2 2h10v12H3V7z" strokeWidth="1.5" />
    </>
  ),
  stamp: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" strokeWidth="1.5" />
      <path d="M8 12h8M8 9h5" strokeWidth="1.5" />
    </>
  ),
};

export function ServiceIcon({
  iconKey,
  className = "h-8 w-8",
}: {
  iconKey: string;
  className?: string;
}) {
  const key = (iconKey in paths ? iconKey : "document") as IconKey;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
    >
      {paths[key]}
    </svg>
  );
}
