import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function FounderPage() {
  const items = await getContentBySection("founder");

  return (
    <SectionView
      section="founder"
      title="Founder"
      description="O ponto de partida: quem você é e para onde quer ir."
      items={toContentGridItems(items, "founder")}
    />
  );
}
