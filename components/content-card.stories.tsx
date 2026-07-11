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
      options: ["rascunho", "em-andamento", "validado"],
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
    status: "em-andamento",
    updatedAt: "2026-06-22",
    excerpt: "Panorama do mercado: tamanho, concorrentes e dinâmicas relevantes.",
    tags: ["mercado", "pesquisa"],
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
    status: "em-andamento",
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

export const Validado: Story = {
  args: {
    ...Default.args,
    title: "Perfil Ideal de Cliente",
    status: "validado",
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
    status: "rascunho",
    layout: "list",
  },
  render: (args) => (
    <div className="max-w-2xl">
      <ContentCard {...args} />
    </div>
  ),
};
