import Link from "next/link";
import {
  ArrowUpRight,
  BellDot,
  Bot,
  Building2,
  CircleCheck,
  CircleDashed,
  ClipboardCheck,
  Compass,
  FileText,
  FlaskConical,
  ListChecks,
  Loader,
  Magnet,
  Package,
  Radar,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  UserRound,
  Wallet,
  Workflow as WorkflowIcon,
} from "lucide-react";

import { getAllContent } from "@/lib/content";
import { getAllAgents } from "@/lib/agents";
import { buildBoard, type WorkflowCard } from "@/lib/workflow";
import type { Section } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { ApproveBlockButton } from "@/components/approve-block-button";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ArrowUpRight, BellDot, Bot, Building2, CircleCheck, CircleDashed,
  ClipboardCheck, Compass, FileText, FlaskConical, ListChecks, Loader,
  Magnet, Package, Radar, ScrollText, ShieldCheck, Sparkles, Sprout,
  Target, UserRound, Wallet, Workflow: WorkflowIcon,
};

const SECTION_LABELS: Record<Section, string> = {
  founder: "Founder",
  direcao: "Direção",
  validacao: "Validação",
  caixa: "Caixa",
  marca: "Marca",
  autoridade: "Autoridade",
};

/** Estilo por coluna: cor do contador/realce. */
const STAGE_TONE: Record<string, string> = {
  "a-iniciar": "text-muted-foreground",
  "em-progresso": "text-accent-orange",
  aguardando: "text-accent-moss",
  validado: "text-foreground",
};

function AgentChip({ card }: { card: WorkflowCard }) {
  if (!card.agent) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <span className="flex size-5 items-center justify-center rounded-full bg-muted">
          <Bot className="size-3" />
        </span>
        Sem agente
      </span>
    );
  }
  const Icon = (card.agent.icon && ICONS[card.agent.icon]) || Bot;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80">
      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon className="size-3" />
      </span>
      {card.agent.name}
    </span>
  );
}

function BoardCard({ card }: { card: WorkflowCard }) {
  const { item, stage } = card;
  const { section, slug, title } = item.frontmatter;
  return (
    <div className="group flex flex-col gap-2.5 rounded-2xl border bg-card p-3.5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/${section}/${slug}`}
          className="min-w-0 font-display text-sm font-semibold leading-snug text-foreground hover:underline"
        >
          {title}
        </Link>
        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex items-center justify-between gap-2">
        <AgentChip card={card} />
        <Badge variant="outline" className="shrink-0 text-[0.65rem]">
          {SECTION_LABELS[section]}
        </Badge>
      </div>
      {stage !== "a-iniciar" ? (
        <div className="flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-accent-orange"
              style={{ width: `${card.completion}%` }}
            />
          </div>
          <span className="text-[0.65rem] tabular-nums text-muted-foreground">
            {card.completion}%
          </span>
        </div>
      ) : null}
      {stage === "aguardando" ? (
        <ApproveBlockButton section={section} slug={slug} />
      ) : null}
    </div>
  );
}

export default async function WorkflowPage() {
  const [items, agents] = await Promise.all([getAllContent(), getAllAgents()]);
  const { columns, activeAgents } = buildBoard(items, agents);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Workflow
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Quem está trabalhando em quê. Cada card é uma entidade do negócio, com
          o agente responsável. Propostas da IA param em “Aguardando você”.
        </p>
      </header>

      {/* Trabalhando agora */}
      <section className="rounded-2xl border bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent-orange opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent-orange" />
          </span>
          <h2 className="text-sm font-semibold tracking-tight">Trabalhando agora</h2>
        </div>
        {activeAgents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeAgents.map(({ agent, count }) => {
              const Icon = (agent.icon && ICONS[agent.icon]) || Bot;
              return (
                <span
                  key={agent.id}
                  className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-2 pr-3 text-sm"
                >
                  <span className="flex size-6 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {count} {count === 1 ? "bloco" : "blocos"}
                  </span>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhum agente em atividade no momento.
          </p>
        )}
      </section>

      {/* Quadro */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((col) => {
          const Icon = ICONS[col.icon] || Bot;
          return (
            <section key={col.id} className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-0.5">
                <Icon className={`size-4 ${STAGE_TONE[col.id]}`} />
                <h2 className="text-sm font-semibold tracking-tight">{col.label}</h2>
                <span
                  className={`ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold tabular-nums ${STAGE_TONE[col.id]}`}
                >
                  {col.cards.length}
                </span>
              </div>
              <p className="-mt-2 px-0.5 text-xs text-muted-foreground">
                {col.description}
              </p>
              <div className="flex flex-col gap-2.5">
                {col.cards.length > 0 ? (
                  col.cards.map((card) => (
                    <BoardCard key={card.item.filePath} card={card} />
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed py-8 text-center text-xs text-muted-foreground/70">
                    Vazio
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
