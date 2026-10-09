export function ServiceTierTable({
  rows,
  caption,
}: {
  caption: string;
  rows: readonly { tier: string; turnaround: string; details: string }[];
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-pale-gray/70 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-pale-gray/60 bg-pale-blue">
              <th scope="col" className="px-5 py-3 font-semibold text-hero-navy">Service Tier</th>
              <th scope="col" className="px-5 py-3 font-semibold text-hero-navy">Turnaround Time</th>
              <th scope="col" className="px-5 py-3 font-semibold text-hero-navy">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.tier} className={i % 2 === 0 ? "bg-white" : "bg-pale-blue/40"}>
                <td className="px-5 py-3.5 font-medium text-hero-navy">{row.tier}</td>
                <td className="px-5 py-3.5 text-hero-muted">{row.turnaround}</td>
                <td className="px-5 py-3.5 text-hero-muted">{row.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="divide-y divide-pale-gray/50 md:hidden">
        {rows.map((row) => (
          <li key={row.tier} className="bg-white p-4 even:bg-pale-blue/40">
            <p className="font-medium text-hero-navy">{row.tier}</p>
            <p className="mt-1 text-sm text-hero-muted">
              <span className="font-medium text-hero-navy/80">Turnaround:</span> {row.turnaround}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-hero-muted">{row.details}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
