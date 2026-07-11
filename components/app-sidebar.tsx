"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Compass, ClipboardCheck, Wallet } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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
};

export const navItems: NavItem[] = [
  { title: "Founder", href: "/founder", icon: Building2 },
  { title: "Direção", href: "/direcao", icon: Compass },
  { title: "Validação", href: "/validacao", icon: ClipboardCheck },
  { title: "Caixa", href: "/caixa", icon: Wallet },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link href="/" className="flex items-center px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/favicon-robusta.svg"
            alt="ROBUSTA"
            className="hidden size-8 shrink-0 dark:invert group-data-[collapsible=icon]:block"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logopreto.svg"
            alt="ROBUSTA"
            className="h-6 w-auto dark:hidden group-data-[collapsible=icon]:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logos/logobranco.svg"
            alt="ROBUSTA"
            className="hidden h-6 w-auto dark:block group-data-[collapsible=icon]:hidden"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname?.startsWith(item.href) ?? false;
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.title}
                      className="rounded-xl transition-colors duration-150 ease-out hover:bg-muted"
                    >
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
