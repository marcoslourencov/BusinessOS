import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ViewToggle, type ViewMode } from "./view-toggle";

const meta = {
  title: "Components/ViewToggle",
  component: ViewToggle,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof ViewToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledViewToggle({ initial }: { initial: ViewMode }) {
  const [view, setView] = useState<ViewMode>(initial);
  return (
    <div className="flex flex-col items-center gap-3">
      <ViewToggle value={view} onValueChange={setView} className="w-36" />
      <p className="text-sm text-muted-foreground">
        Modo selecionado: <span className="font-medium">{view}</span>
      </p>
    </div>
  );
}

export const Grid: Story = {
  args: {
    value: "grid",
    onValueChange: () => {},
  },
  render: () => <ControlledViewToggle initial="grid" />,
};

export const Lista: Story = {
  args: {
    value: "list",
    onValueChange: () => {},
  },
  render: () => <ControlledViewToggle initial="list" />,
};
