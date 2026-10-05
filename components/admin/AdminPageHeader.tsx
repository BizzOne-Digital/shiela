export function AdminPageHeader({
  title,
  description,
  badge,
  action,
}: {
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 min-[480px]:mb-8 min-[480px]:flex-row min-[480px]:flex-wrap min-[480px]:items-start min-[480px]:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-balance-safe font-display text-2xl font-medium text-hero-navy min-[400px]:text-3xl md:text-4xl">
            {title}
          </h1>
          {badge && (
            <span className="rounded-full bg-[#dce8f5] px-3 py-1 text-xs font-medium text-hero-navy/80">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="mt-2 max-w-2xl text-sm text-hero-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
