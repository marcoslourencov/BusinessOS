import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="bg-background p-6">
      <div className="max-w-xs">
        <div className="text-sm font-medium">Marca</div>
        <div className="text-sm text-muted-foreground">
          Identidade e posicionamento
        </div>
        <Separator className="my-4" />
        <div className="text-sm text-muted-foreground">
          Última atualização em 22 jun. 2026
        </div>
      </div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="bg-background p-6">
      <div className="flex h-8 items-center gap-4 text-sm text-muted-foreground">
        <span>Marca</span>
        <Separator orientation="vertical" />
        <span>Autoridade</span>
        <Separator orientation="vertical" />
        <span>Mercado</span>
      </div>
    </div>
  ),
};
