import { SectionView } from "@/components/section-view";
import type { ContentGridItem } from "@/components/content-grid";

const items: ContentGridItem[] = [
  {
    id: "objetivo",
    title: "Objetivo",
    status: "in-progress",
    updatedAt: "2026-06-28",
    excerpt: "Onde o founder quer chegar e por quê — visão de longo prazo do negócio.",
  },
  {
    id: "estilo-de-vida",
    title: "Estilo de vida",
    status: "draft",
    updatedAt: "2026-06-20",
    excerpt: "Como o negócio deve se encaixar na vida que o founder quer viver.",
  },
];

export default function FounderPage() {
  return (
    <SectionView
      title="Founder"
      description="O ponto de partida: quem você é e para onde quer ir."
      items={items}
    />
  );
}
