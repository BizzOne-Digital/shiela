import { ContentEditor } from "@/components/admin/ContentEditor";
import { guardAdmin } from "@/lib/admin/guard";
import { getSiteContent } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await guardAdmin();
  const content = await getSiteContent();
  return <ContentEditor initial={content} />;
}
