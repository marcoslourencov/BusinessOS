import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-xs bg-background p-6">
      <Input {...args} defaultValue="Robusta" />
    </div>
  ),
};

export const Placeholder: Story = {
  render: (args) => (
    <div className="max-w-xs bg-background p-6">
      <Input {...args} placeholder="Digite o nome da empresa" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="max-w-xs bg-background p-6">
      <Input {...args} placeholder="Campo desabilitado" disabled />
    </div>
  ),
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid max-w-xs gap-2 bg-background p-6">
      <Label htmlFor="empresa">Empresa</Label>
      <Input {...args} id="empresa" placeholder="Nome da empresa" />
    </div>
  ),
};
