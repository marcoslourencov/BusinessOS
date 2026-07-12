import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check } from "lucide-react";

import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
        "accent",
        "accentMoss",
      ],
    },
  },
  args: {
    children: "Badge",
    variant: "default",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="bg-background p-6">
      <Badge {...args} />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Badge variant="default">Padrão</Badge>
      <Badge variant="secondary">Secundário</Badge>
      <Badge variant="destructive">Destrutivo</Badge>
      <Badge variant="outline">Contorno</Badge>
      <Badge variant="ghost">Fantasma</Badge>
      <Badge variant="link">Link</Badge>
      <Badge variant="accent">Destaque</Badge>
      <Badge variant="accentMoss">Destaque Moss</Badge>
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

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6">
      <Badge variant="accentMoss">
        <Check />
        Validado
      </Badge>
      <Badge variant="accent">Novo</Badge>
    </div>
  ),
};
