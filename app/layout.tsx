import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAllContent } from "@/lib/content";
import type { Section } from "@/lib/types";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BusinessOS",
  description: "BusinessOS — sistema operacional para founders",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Contagem de itens "em andamento" por seção, para os badges da sidebar.
  const allContent = await getAllContent();
  const emAndamentoCounts = allContent.reduce((acc, item) => {
    if (item.frontmatter.status === "em-andamento") {
      const section = item.frontmatter.section;
      acc[section] = (acc[section] ?? 0) + 1;
    }
    return acc;
  }, {} as Record<Section, number>);

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Adobe Fonts (Typekit) — Neue Kabel, usada só nos títulos H1. */}
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="stylesheet" href="https://use.typekit.net/sri7eew.css" />
      </head>
      <body className="min-h-full bg-background">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SidebarProvider>
            <AppSidebar counts={emAndamentoCounts} />
            <SidebarInset className="m-2 overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm md:m-3">
              <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/60 px-4 md:px-6">
                <SidebarTrigger className="-ml-1 rounded-full hover:bg-muted" />
                <Separator orientation="vertical" className="mr-1 h-4" />
                <span className="text-sm font-semibold">BusinessOS</span>
                <ThemeToggle className="ml-auto rounded-full" />
              </header>
              <main className="flex-1 overflow-y-auto p-6 md:p-10">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
