import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Progress } from "./progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 64,
    label: "Progresso",
    showValue: true,
  },
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-6">
      <Progress
        value={72}
        label="Lime"
        showValue
        indicatorClassName="bg-accent-orange"
      />
      <Progress
        value={48}
        label="Roxo"
        showValue
        indicatorClassName="bg-accent-moss"
      />
      <Progress
        value={90}
        label="Escuro"
        showValue
        indicatorClassName="bg-surface-dark"
      />
    </div>
  ),
};

export const NoLabel: Story = {
  args: {
    value: 33,
  },
  render: (args) => (
    <div className="max-w-sm">
      <Progress {...args} />
    </div>
  ),
};
