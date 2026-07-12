import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Dialog>
        <DialogTrigger render={<Button variant="accent" />}>
          Novo bloco
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo bloco em Marca</DialogTitle>
            <DialogDescription>
              Dê um título ao bloco. Você poderá preencher o conteúdo completo
              na próxima tela.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5 py-4">
            <Label htmlFor="story-block-title">Título</Label>
            <Input
              id="story-block-title"
              placeholder="Ex.: Canal de aquisição"
            />
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancelar
            </DialogClose>
            <Button variant="accent" type="button">
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
