import { SectionView } from "@/components/section-view";
import { getContentBySection } from "@/lib/content";
import { toContentGridItems } from "@/lib/content-view";

export default async function ValidacaoPage() {
  const items = await getContentBySection("validacao");

  return (
    <SectionView
      title="Validação"
      description="Testar a oferta no mundo real e aprender com os primeiros clientes."
      items={toContentGridItems(items, "validacao")}
    />
  );
}
