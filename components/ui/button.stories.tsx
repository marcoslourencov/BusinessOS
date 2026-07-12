import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight, Plus, Trash2 } from "lucide-react";

import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
        "accent",
        "accentMoss",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-xs", "icon-sm", "icon-lg"],
    },
  },
  args: {
    children: "Botão",
    variant: "default",
    size: "default",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-background p-6">
      <Button {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Button variant="default">Padrão</Button>
      <Button variant="outline">Contorno</Button>
      <Button variant="secondary">Secundário</Button>
      <Button variant="ghost">Fantasma</Button>
      <Button variant="destructive">Destrutivo</Button>
      <Button variant="link">Link</Button>
      <Button variant="accent">Destaque</Button>
      <Button variant="accentMoss">Destaque Moss</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Todas as variantes. `accent` usa o laranja da marca e `accentMoss` o verde-musgo secundário.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Button size="xs">Extra pequeno</Button>
      <Button size="sm">Pequeno</Button>
      <Button size="default">Padrão</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Button size="icon-xs" aria-label="Adicionar">
        <Plus />
      </Button>
      <Button size="icon-sm" aria-label="Adicionar">
        <Plus />
      </Button>
      <Button size="icon" aria-label="Adicionar">
        <Plus />
      </Button>
      <Button size="icon-lg" aria-label="Adicionar">
        <Plus />
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Button variant="accent">
        <Plus />
        Novo conteúdo
      </Button>
      <Button variant="outline">
        Avançar
        <ArrowRight />
      </Button>
      <Button variant="destructive">
        <Trash2 />
        Excluir
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Button disabled>Padrão</Button>
      <Button variant="accent" disabled>
        Destaque
      </Button>
      <Button variant="outline" disabled>
        Contorno
      </Button>
    </div>
  ),
};
