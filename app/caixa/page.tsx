import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function CaixaPage() {
  const items = await getContentBySection("caixa");

  return (
    <SectionView
      title="Caixa"
      description="A operação financeira: fluxo de caixa e gestão do negócio."
      items={toContentGridItems(items, "caixa")}
    />
  );
}
