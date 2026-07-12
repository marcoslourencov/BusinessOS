import Link from "next/link";
import {
  Building2,
  Compass,
  ClipboardCheck,
  Wallet,
  Megaphone,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Loader2,
  FileText,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { getAllContent } from "@/lib/content";
import type { ContentStatus, Section } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";

const SECTIONS: {
  href: string;
  section: Section;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    href: "/founder",
    section: "founder",
    title: "Founder",
    description: "Quem você é e para onde quer ir.",
    icon: Building2,
  },
  {
    href: "/direcao",
    section: "direcao",
    title: "Direção",
    description: "Mercado, problema, cliente e oferta.",
    icon: Compass,
  },
  {
    href: "/validacao",
    section: "validacao",
    title: "Validação",
    description: "Testar a oferta e aprender com clientes.",
    icon: ClipboardCheck,
  },
  {
    href: "/caixa",
    section: "caixa",
    title: "Caixa",
    description: "Fluxo de caixa e gestão operacional.",
    icon: Wallet,
  },
  {
    href: "/marca",
    section: "marca",
    title: "Marca",
    description: "Identidade, tom de voz e posicionamento.",
    icon: Sparkles,
  },
  {
    href: "/autoridade",
    section: "autoridade",
    title: "Autoridade",
    description: "Conteúdo, editorias e presença pública.",
    icon: Megaphone,
  },
];

const statusLabels: Record<ContentStatus, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
};

export default async function Home() {
  const allContent = await getAllContent();

  const total = allContent.length;

  const countByStatus = (status: ContentStatus) =>
    allContent.filter((item) => item.frontmatter.status === status).length;

  const validados = countByStatus("validado");
  const emAndamento = countByStatus("em-andamento");
  const rascunhos = countByStatus("rascunho");

  const pctOf = (n: number) => (total > 0 ? Math.round((n * 100) / total) : 0);

  const sectionCounts = SECTIONS.map((section) => ({
    ...section,
    count: allContent.filter(
      (item) => item.frontmatter.section === section.section
    ).length,
  }));

  // Seção com mais blocos, para o card de destaque escuro.
  const topSection = [...sectionCounts].sort((a, b) => b.count - a.count)[0];

  const recentlyUpdated = [...allContent]
    .sort(
      (a, b) =>
        new Date(b.frontmatter.updatedAt).getTime() -
        new Date(a.frontmatter.updatedAt).getTime()
    )
    .slice(0, 5);

  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Bem-vindo de volta
          </h1>
          <p className="text-sm text-muted-foreground">
            Visão geral do seu BusinessOS — o sistema operacional do seu negócio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-full font-normal capitalize">
            {today}
          </Badge>
          <Link
            href="/founder"
            className={buttonVariants({
              variant: "accent",
              size: "sm",
              className: "rounded-full",
            })}
          >
            Abrir Founder
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Layers}
          label="Total de blocos"
          value={String(total)}
          unit="blocos"
          trend={`${sectionCounts.length} seções`}
        />

        <StatCard
          icon={CheckCircle2}
          label="Blocos validados"
          value={String(validados)}
          trend={`+${pctOf(validados)}%`}
        >
          <Progress
            value={pctOf(validados)}
            indicatorClassName="bg-accent-orange"
            className="mt-2"
          />
        </StatCard>

        <StatCard
          icon={Loader2}
          label="Em andamento"
          value={String(emAndamento)}
          trend={`${pctOf(emAndamento)}%`}
        >
          <Progress
            value={pctOf(emAndamento)}
            indicatorClassName="bg-accent-moss"
            className="mt-2"
          />
        </StatCard>

        <StatCard
          icon={TrendingUp}
          label="Progresso de validação"
          value={`${pctOf(validados)}%`}
          tone="moss"
          trend={`${validados}/${total}`}
        >
          <div className="mt-2 flex flex-col gap-2">
            <Progress
              value={pctOf(validados)}
              indicatorClassName="bg-accent-moss-foreground"
              className="[&_[data-slot=progress-track]]:bg-accent-moss-foreground/20"
            />
          </div>
        </StatCard>
      </div>

      {/* Feature (dark) card + status breakdown */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="flex flex-col justify-between gap-6 bg-surface-dark text-surface-dark-foreground lg:col-span-2">
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-full bg-surface-dark-muted [&_svg]:size-5">
                {topSection ? <topSection.icon /> : <Compass />}
              </span>
              <Badge variant="accent">Foco da semana</Badge>
            </div>
            <CardTitle className="font-heading text-2xl font-semibold">
              {topSection ? topSection.title : "Direção"} concentra{" "}
              {topSection ? topSection.count : 0} blocos
            </CardTitle>
            <CardDescription className="text-surface-dark-foreground/60">
              É a seção com mais conteúdo no seu negócio agora. Revise, valide e
              transforme rascunhos em decisões.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={topSection ? topSection.href : "/direcao"}
              className={buttonVariants({
                variant: "accent",
                className: "rounded-full",
              })}
            >
              Continuar em {topSection ? topSection.title : "Direção"}
              <ArrowUpRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="gap-1">
            <CardTitle className="text-base font-semibold">
              Distribuição por status
            </CardTitle>
            <CardDescription>Como estão seus {total} blocos.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress
              value={pctOf(validados)}
              label={`Validado (${validados})`}
              showValue
              indicatorClassName="bg-accent-orange"
            />
            <Progress
              value={pctOf(emAndamento)}
              label={`Em andamento (${emAndamento})`}
              showValue
              indicatorClassName="bg-accent-moss"
            />
            <Progress
              value={pctOf(rascunhos)}
              label={`Rascunho (${rascunhos})`}
              showValue
              indicatorClassName="bg-primary"
            />
          </CardContent>
        </Card>
      </div>

      {/* Section shortcuts */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Seções</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sectionCounts.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href} className="block">
                <Card className="gap-3 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
                  <CardHeader className="gap-2">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground [&_svg]:size-5">
                        <Icon />
                      </span>
                      <Badge variant="secondary" className="rounded-full font-normal">
                        {section.count} blocos
                      </Badge>
                    </div>
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
      </div>

      {/* Recently updated */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">
          Atualizados recentemente
        </h2>
        <Card className="gap-0 divide-y divide-border py-2">
          {recentlyUpdated.map((item) => (
            <Link
              key={item.filePath}
              href={`/${item.frontmatter.section}/${item.frontmatter.slug}`}
              className="flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-muted"
            >
              <span className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-4">
                  <FileText />
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">{item.frontmatter.title}</span>
                  <span className="text-xs capitalize text-muted-foreground">
                    {item.frontmatter.section}
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="secondary" className="font-normal">
                  {statusLabels[item.frontmatter.status] ??
                    item.frontmatter.status}
                </Badge>
                <span className="hidden sm:inline">
                  {new Intl.DateTimeFormat("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(item.frontmatter.updatedAt))}
                </span>
              </span>
            </Link>
          ))}
        </Card>
      </div>
    </div>
  );
}
