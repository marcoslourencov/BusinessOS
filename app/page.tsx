import Link from "next/link";
import { Building2, Compass, ClipboardCheck, Wallet } from "lucide-react";
import { getAllContent } from "@/lib/content";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SECTIONS = [
  {
    href: "/founder",
    title: "Founder",
    description: "Quem você é e para onde quer ir.",
    icon: Building2,
  },
  {
    href: "/direcao",
    title: "Direção",
    description: "Mercado, problema, cliente e oferta.",
    icon: Compass,
  },
  {
    href: "/validacao",
    title: "Validação",
    description: "Testar a oferta e aprender com clientes.",
    icon: ClipboardCheck,
  },
  {
    href: "/caixa",
    title: "Caixa",
    description: "Fluxo de caixa e gestão operacional.",
    icon: Wallet,
  },
];

const statusLabels: Record<string, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
};

export default async function Home() {
  const allContent = await getAllContent();
  const recentlyUpdated = [...allContent]
    .sort(
      (a, b) =>
        new Date(b.frontmatter.updatedAt).getTime() -
        new Date(a.frontmatter.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">BusinessOS</h1>
        <p className="text-sm text-muted-foreground">
          Atalhos para as 4 seções do seu negócio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.href} href={section.href} className="block">
              <Card className="gap-3 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20">
                <CardHeader className="gap-2">
                  <Icon className="size-5" />
                  <CardTitle className="text-base font-semibold">
                    {section.title}
                  </CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Atualizados recentemente
        </h2>
        <div className="flex flex-col gap-2">
          {recentlyUpdated.map((item) => (
            <Link
              key={item.filePath}
              href={`/${item.frontmatter.section}/${item.frontmatter.slug}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted"
            >
              <span className="font-medium">{item.frontmatter.title}</span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {statusLabels[item.frontmatter.status] ??
                    item.frontmatter.status}
                </Badge>
                {new Intl.DateTimeFormat("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }).format(new Date(item.frontmatter.updatedAt))}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
