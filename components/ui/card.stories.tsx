import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "./button";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Tese de Valor</CardTitle>
          <CardDescription>
            A proposta central que orienta as decisões do negócio.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Um resumo curto do problema que resolvemos e para quem, escrito de
          forma clara e direta.
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Perfil Ideal de Cliente</CardTitle>
          <CardDescription>
            Quem mais se beneficia da nossa solução.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Empresas de médio porte em busca de eficiência operacional.
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="accent">Abrir bloco</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="bg-background p-6">
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Mapa do Mercado</CardTitle>
          <CardDescription>
            Tamanho, concorrentes e dinâmicas relevantes.
          </CardDescription>
          <CardAction>
            <Button variant="ghost" size="sm">
              Editar
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          Última revisão feita pela equipe de pesquisa.
        </CardContent>
      </Card>
    </div>
  ),
};
