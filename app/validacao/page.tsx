import { SectionView } from "@/components/section-view";
import type { ContentGridItem } from "@/components/content-grid";

const items: ContentGridItem[] = [
  {
    id: "oferta",
    title: "Oferta",
    status: "in-progress",
    updatedAt: "2026-07-01",
    excerpt: "Validação da oferta com o mercado: mensagem, preço e formato.",
  },
  {
    id: "primeiros-clientes",
    title: "Primeiros clientes",
    status: "blocked",
    updatedAt: "2026-06-30",
    excerpt: "Aquisição e aprendizado com os primeiros clientes reais.",
  },
];

export default function ValidacaoPage() {
  return (
    <SectionView
      title="Validação"
      description="Testar a oferta no mundo real e aprender com os primeiros clientes."
      items={items}
    />
  );
}
