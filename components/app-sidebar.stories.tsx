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

/** The sidebar alone, expanded — Founder is the active route. */
export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  ),
};

/** Sidebar collapsed to icon-only mode. */
export const Collapsed: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
    </SidebarProvider>
  ),
};

/**
 * Full AppShell composition: sidebar (with hover + rounded nav items) next to
 * the content area, matching the root layout used across the app.
 */
export const AppShell: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/direcao",
      },
    },
  },
  render: () => (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1 rounded-lg hover:bg-muted" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-muted-foreground">
            BusinessOS
          </span>
        </header>
        <main className="flex-1 p-10">
          <p className="text-sm text-muted-foreground">
            Conteúdo da página (mock). Passe o mouse pelos itens do menu para
            ver o hover com background e cantos arredondados.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
};
