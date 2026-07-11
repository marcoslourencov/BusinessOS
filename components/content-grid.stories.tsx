import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContentGrid, type ContentGridItem } from "./content-grid";
import { ViewToggle, type ViewMode } from "./view-toggle";

const mockItems: ContentGridItem[] = [
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
];

const meta = {
  title: "Components/ContentGrid",
  component: ContentGrid,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ContentGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Grid: Story = {
  args: {
    items: mockItems,
    view: "grid",
  },
};

export const Lista: Story = {
  args: {
    items: mockItems,
    view: "list",
  },
};

export const Vazio: Story = {
  args: {
    items: [],
    view: "grid",
  },
};

function ToggleableGrid() {
  const [view, setView] = useState<ViewMode>("grid");
  return (
    <div className="flex flex-col gap-4">
      <ViewToggle value={view} onValueChange={setView} className="w-36" />
      <ContentGrid items={mockItems} view={view} />
    </div>
  );
}

export const ComToggle: Story = {
  args: {
    items: mockItems,
    view: "grid",
  },
  render: () => <ToggleableGrid />,
};
