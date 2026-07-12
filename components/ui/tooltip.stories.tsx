import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
import { Button } from "./button";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnButton: Story = {
  render: () => (
    <div className="bg-background p-6">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button variant="accent" />}>
            Novo bloco
          </TooltipTrigger>
          <TooltipContent>Criar um novo bloco de conteúdo</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
};
