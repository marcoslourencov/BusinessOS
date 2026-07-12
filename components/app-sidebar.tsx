"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Compass, ClipboardCheck, Wallet, Sparkles, Megaphone, UserRound, ChevronsUpDown, Bot } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Section } from "@/lib/types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  section: Section;
};

export const navItems: NavItem[] = [
  { title: "Founder", href: "/founder", icon: Building2, section: "founder" },
  { title: "Direção", href: "/direcao", icon: Compass, section: "direcao" },
  { title: "Validação", href: "/validacao", icon: ClipboardCheck, section: "validacao" },
  { title: "Caixa", href: "/caixa", icon: Wallet, section: "caixa" },
  { title: "Marca", href: "/marca", icon: Sparkles, section: "marca" },
  { title: "Autoridade", href: "/autoridade", icon: Megaphone, section: "autoridade" },
];

export function AppSidebar({ counts }: { counts?: Partial<Record<Section, number>> }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <Link href="/" className="flex items-center px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/favicon-robusta.svg"
            alt="ROBUSTA"
            className="hidden size-7 shrink-0 invert group-data-[collapsible=icon]:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logobranco.svg"
            alt="ROBUSTA"
            className="h-5 w-auto group-data-[collapsible=icon]:hidden"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarGroupLabel>Seções</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href) ?? false;
                const Icon = item.icon;
                const count = counts?.[item.section] ?? 0;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-10 rounded-lg px-3 transition-colors duration-150 ease-out group-data-[collapsible=icon]:justify-center",
                        isActive
                          ? "bg-sidebar-foreground font-medium text-sidebar hover:bg-sidebar-foreground hover:text-sidebar data-active:bg-sidebar-foreground data-active:text-sidebar"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      {count > 0 ? (
                        <span
                          className={cn(
                            "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums group-data-[collapsible=icon]:hidden",
                            "bg-accent-orange text-accent-orange-foreground"
                          )}
                        >
                          {count}
                        </span>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link href="/agentes" />}
                  isActive={pathname?.startsWith("/agentes") ?? false}
                  tooltip="Agentes"
                  className={cn(
                    "h-10 rounded-lg px-3 transition-colors duration-150 ease-out group-data-[collapsible=icon]:justify-center",
                    (pathname?.startsWith("/agentes") ?? false)
                      ? "bg-sidebar-foreground font-medium text-sidebar hover:bg-sidebar-foreground hover:text-sidebar data-active:bg-sidebar-foreground data-active:text-sidebar"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <Bot className="size-4" />
                  <span className="group-data-[collapsible=icon]:hidden">Agentes</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        {/*
          Estado de login (stub). Ainda não há autenticação — futuramente
          isto será ligado ao Supabase auth com níveis de acesso
          (Admin / Staff / Visitante) para foto de perfil e gestão de senha.
          Por ora, apenas leva a /login.
        */}
        {/* Expandido: linha clicável com avatar + textos */}
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground">
            <UserRound className="size-4" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium text-sidebar-foreground">Entrar</span>
            <span className="truncate text-xs text-sidebar-foreground/80">Acesse sua conta</span>
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-sidebar-foreground/80" />
        </Link>
        {/* Colapsado: apenas o avatar, centralizado */}
        <Link
          href="/login"
          title="Entrar"
          className="hidden size-9 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground group-data-[collapsible=icon]:flex"
        >
          <UserRound className="size-4" />
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
