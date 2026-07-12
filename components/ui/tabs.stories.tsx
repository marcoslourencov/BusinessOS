import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Tabs defaultValue="marca" className="max-w-lg">
        <TabsList>
          <TabsTrigger value="marca">Marca</TabsTrigger>
          <TabsTrigger value="autoridade">Autoridade</TabsTrigger>
          <TabsTrigger value="mercado">Mercado</TabsTrigger>
        </TabsList>
        <TabsContent value="marca" className="pt-4 text-muted-foreground">
          Identidade, tom de voz e posicionamento da marca.
        </TabsContent>
        <TabsContent value="autoridade" className="pt-4 text-muted-foreground">
          Conteúdos editoriais que constroem autoridade no tema.
        </TabsContent>
        <TabsContent value="mercado" className="pt-4 text-muted-foreground">
          Panorama do mercado: tamanho, concorrentes e dinâmicas.
        </TabsContent>
      </Tabs>
    </div>
  ),
};
