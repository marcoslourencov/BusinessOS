import { SectionView } from "@/components/section-view";
import type { ContentGridItem } from "@/components/content-grid";

const items: ContentGridItem[] = [
  {
    id: "fluxo-de-caixa",
    title: "Fluxo de Caixa",
    status: "in-progress",
    updatedAt: "2026-07-08",
    excerpt: "Entradas, saídas e saúde financeira do negócio no dia a dia.",
  },
  {
    id: "erp",
    title: "ERP",
    status: "draft",
    updatedAt: "2026-06-05",
    excerpt: "Estrutura e processos de gestão financeira e operacional.",
  },
];

export default function CaixaPage() {
  return (
    <SectionView
      title="Caixa"
      description="A operação financeira: fluxo de caixa e gestão do negócio."
      items={items}
    />
  );
}
