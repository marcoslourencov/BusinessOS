import { SectionView } from "@/components/section-view";
import type { ContentGridItem } from "@/components/content-grid";

const items: ContentGridItem[] = [
  {
    id: "mapa-do-mercado",
    title: "Mapa do Mercado",
    status: "done",
    updatedAt: "2026-06-15",
    excerpt: "Panorama do mercado: tamanho, concorrentes e dinâmicas relevantes.",
  },
  {
    id: "mapa-de-problemas",
    title: "Mapa de Problemas",
    status: "in-progress",
    updatedAt: "2026-06-22",
    excerpt: "Os problemas reais dos clientes que valem a pena resolver.",
  },
  {
    id: "perfil-ideal-de-cliente",
    title: "Perfil Ideal de Cliente",
    status: "review",
    updatedAt: "2026-06-25",
    excerpt: "Quem é o cliente ideal e o que o caracteriza.",
  },
  {
    id: "tese-de-valor",
    title: "Tese de Valor",
    status: "draft",
    updatedAt: "2026-06-18",
    excerpt: "A hipótese central de valor que sustenta o negócio.",
  },
  {
    id: "oferta",
    title: "Oferta",
    status: "draft",
    updatedAt: "2026-06-10",
    excerpt: "O que será oferecido, para quem e em que formato.",
  },
];

export default function DirecaoPage() {
  return (
    <SectionView
      title="Direção"
      description="A tese estratégica: mercado, problema, cliente e oferta."
      items={items}
    />
  );
}
