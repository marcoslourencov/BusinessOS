import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function AutoridadePage() {
  const items = await getContentBySection("autoridade");

  return (
    <SectionView
      section="autoridade"
      title="Autoridade"
      description="Construir presença e prova pública: editorias, publicação e o que ela gera de retorno."
      items={toContentGridItems(items, "autoridade")}
    />
  );
}
