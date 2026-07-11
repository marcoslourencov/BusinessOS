import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContentCard } from "./content-card";

const meta = {
  title: "Components/ContentCard",
  component: ContentCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    status: {
      control: "select",
      options: ["draft", "in-progress", "review", "done", "blocked"],
    },
    layout: {
      control: "radio",
      options: ["grid", "list"],
    },
  },
} satisfies Meta<typeof ContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Mapa do Mercado",
    status: "in-progress",
    updatedAt: "2026-06-22",
    excerpt: "Panorama do mercado: tamanho, concorrentes e dinâmicas relevantes.",
    layout: "grid",
  },
  render: (args) => (
    <div className="max-w-sm">
      <ContentCard {...args} />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    ...Default.args,
    title: "Tese de Valor",
    status: "review",
    onClick: () => alert("Card clicado"),
  },
  render: (args) => (
    <div className="max-w-sm">
      <ContentCard {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card clicável (hover eleva levemente e realça a borda; focável via teclado).",
      },
    },
  },
};

export const Done: Story = {
  args: {
    ...Default.args,
    title: "Perfil Ideal de Cliente",
    status: "done",
  },
  render: (args) => (
    <div className="max-w-sm">
      <ContentCard {...args} />
    </div>
  ),
};

export const NoExcerptOrDate: Story = {
  args: {
    title: "Fluxo de Caixa",
  },
  render: (args) => (
    <div className="max-w-sm">
      <ContentCard {...args} />
    </div>
  ),
};

export const ListLayout: Story = {
  args: {
    ...Default.args,
    title: "Primeiros clientes",
    status: "blocked",
    layout: "list",
  },
  render: (args) => (
    <div className="max-w-2xl">
      <ContentCard {...args} />
    </div>
  ),
};
