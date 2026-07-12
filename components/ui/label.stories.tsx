import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: (args) => (
    <div className="grid max-w-xs gap-2 bg-background p-6">
      <Label {...args} htmlFor="email">
        E-mail
      </Label>
      <Input id="email" type="email" placeholder="voce@empresa.com" />
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="group grid max-w-xs gap-2 bg-background p-6" data-disabled="true">
      <Label {...args} htmlFor="email-disabled">
        E-mail
      </Label>
      <Input id="email-disabled" type="email" placeholder="voce@empresa.com" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "O Label esmaece quando o container pai marca `data-disabled=\"true\"` (padrão do design system).",
      },
    },
  },
};
