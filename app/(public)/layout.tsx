export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>;
}
