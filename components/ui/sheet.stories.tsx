import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Button } from "./button";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Sheet>
        <SheetTrigger render={<Button variant="accent" />}>
          Abrir painel
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes do bloco</SheetTitle>
            <SheetDescription>
              Ajuste as informações do bloco de conteúdo e salve as alterações.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 px-4 text-sm text-muted-foreground">
            Conteúdo do painel lateral.
          </div>
          <SheetFooter>
            <Button variant="accent">Salvar</Button>
            <SheetClose render={<Button variant="outline" type="button" />}>
              Fechar
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
