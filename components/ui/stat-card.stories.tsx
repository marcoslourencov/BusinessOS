import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Activity, TrendingUp, Users } from "lucide-react";

import { StatCard } from "./stat-card";
import { Progress } from "./progress";

const meta = {
  title: "UI/StatCard",
  component: StatCard,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["light", "dark", "moss"],
    },
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    icon: Activity,
    label: "Passos hoje",
    value: "8.420",
    unit: "passos",
    trend: "+5%",
    tone: "light",
  },
  render: (args) => (
    <div className="max-w-xs">
      <StatCard {...args} />
    </div>
  ),
};

export const Dark: Story = {
  args: {
    icon: TrendingUp,
    label: "Frequência cardíaca",
    value: "72",
    unit: "bpm",
    trend: "+3%",
    tone: "dark",
  },
  render: (args) => (
    <div className="max-w-xs">
      <StatCard {...args} />
    </div>
  ),
};

export const Moss: Story = {
  args: {
    icon: Users,
    label: "Sono",
    value: "7.5",
    unit: "h",
    trend: "+12%",
    tone: "moss",
  },
  render: (args) => (
    <div className="max-w-xs">
      <StatCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  args: {
    label: "",
    value: "",
  },
  render: () => (
    <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        icon={Activity}
        label="Passos hoje"
        value="8.420"
        unit="passos"
        trend="+5%"
        tone="light"
      />
      <StatCard
        icon={TrendingUp}
        label="Frequência"
        value="72"
        unit="bpm"
        trend="+3%"
        tone="dark"
      />
      <StatCard
        icon={Users}
        label="Sono"
        value="7.5"
        unit="h"
        trend="+12%"
        tone="moss"
      />
    </div>
  ),
};

export const WithProgress: Story = {
  args: {
    icon: Activity,
    label: "Meta diária",
    value: "64",
    unit: "%",
    tone: "light",
  },
  render: (args) => (
    <div className="max-w-xs">
      <StatCard {...args}>
        <div className="mt-2">
          <Progress value={64} indicatorClassName="bg-accent-orange" />
        </div>
      </StatCard>
    </div>
  ),
};
