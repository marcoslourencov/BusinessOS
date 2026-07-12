import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Label } from "./label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rascunho">Rascunho</SelectItem>
          <SelectItem value="em-andamento">Em andamento</SelectItem>
          <SelectItem value="validado">Validado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Select defaultValue="validado">
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rascunho">Rascunho</SelectItem>
          <SelectItem value="em-andamento">Em andamento</SelectItem>
          <SelectItem value="validado">Validado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-56 gap-2 bg-background p-6">
      <Label htmlFor="status">Status</Label>
      <Select>
        <SelectTrigger id="status" className="w-56">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rascunho">Rascunho</SelectItem>
          <SelectItem value="em-andamento">Em andamento</SelectItem>
          <SelectItem value="validado">Validado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Select disabled>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rascunho">Rascunho</SelectItem>
          <SelectItem value="em-andamento">Em andamento</SelectItem>
          <SelectItem value="validado">Validado</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
