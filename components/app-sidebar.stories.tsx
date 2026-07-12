import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AppSidebar } from "./app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const meta = {
  title: "Layout/AppSidebar",
  component: AppSidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/founder",
      },
    },
  },
} satisfies Meta<typeof AppSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The sidebar alone, expanded — Founder is the active route. The `counts` prop
 * drives the per-section "em andamento" badges in the nav. The footer shows the
 * login/account row (replacing the former "Desbloqueie o Pro" upgrade card).
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-svh bg-background">
      <SidebarProvider>
        <AppSidebar counts={{ validacao: 3, autoridade: 5 }} />
      </SidebarProvider>
    </div>
  ),
};

/** Sidebar collapsed to icon-only mode. */
export const Collapsed: Story = {
  render: () => (
    <div className="min-h-svh bg-background">
      <SidebarProvider defaultOpen={false}>
        <AppSidebar counts={{ validacao: 3, autoridade: 5 }} />
      </SidebarProvider>
    </div>
  ),
};

/**
 * Full AppShell composition: floating near-black sidebar next to a rounded
 * white content panel on the pale-lime canvas, matching the root layout.
 */
export const AppShell: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/validacao",
      },
    },
  },
  render: () => (
    <div className="min-h-svh bg-background">
      <SidebarProvider>
        <AppSidebar counts={{ validacao: 3, autoridade: 5 }} />
        <SidebarInset className="m-2 ml-0 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm md:m-3 md:ml-0">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/60 px-4 md:px-6">
            <SidebarTrigger className="-ml-1 rounded-full hover:bg-muted" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <span className="text-sm font-semibold">BusinessOS</span>
          </header>
          <main className="flex-1 p-10">
            <p className="text-sm text-muted-foreground">
              Conteúdo da página (mock). O item ativo vira uma pílula branca com
              texto escuro e badge lime; passe o mouse pelos demais para ver o
              hover arredondado.
            </p>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  ),
};
