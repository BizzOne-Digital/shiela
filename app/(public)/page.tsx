import { Ss1OnePage } from "@/components/marketing/ss1/Ss1OnePage";
import { getSiteContent } from "@/lib/data/public";
import { localBusinessJsonLd } from "@/lib/site-metadata";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
      />
      <Ss1OnePage content={content} />
    </>
  );
}
