import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function DirecaoPage() {
  const items = await getContentBySection("direcao");

  return (
    <SectionView
      section="direcao"
      title="Direção"
      description="A tese estratégica: mercado, problema, cliente e oferta."
      items={toContentGridItems(items, "direcao")}
    />
  );
}
