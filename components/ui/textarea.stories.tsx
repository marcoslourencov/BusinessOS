import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md bg-background p-6">
      <Textarea
        {...args}
        defaultValue="Panorama do mercado: tamanho, concorrentes e dinâmicas relevantes."
      />
    </div>
  ),
};

export const Placeholder: Story = {
  render: (args) => (
    <div className="max-w-md bg-background p-6">
      <Textarea {...args} placeholder="Descreva a tese de valor..." />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="max-w-md bg-background p-6">
      <Textarea {...args} placeholder="Campo desabilitado" disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-md gap-2 bg-background p-6">
      <Label htmlFor="resumo">Resumo</Label>
      <Textarea {...args} id="resumo" placeholder="Resumo do conteúdo..." />
    </div>
  ),
};
