import {
  Bot,
  Building2,
  CircleDashed,
  ClipboardCheck,
  Compass,
  FileText,
  FlaskConical,
  ListChecks,
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
  Workflow,
} from "lucide-react";

import { getAllAgents, type Agent, type AgentCategory } from "@/lib/agents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AgentEditor } from "@/components/agent-editor";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Bot, Building2, CircleDashed, ClipboardCheck, Compass, FileText,
  FlaskConical, ListChecks, Magnet, Package, Radar, ScrollText,
  ShieldCheck, Sparkles, Sprout, Target, UserRound, Wallet, Workflow,
};

const CATEGORY_META: Record<
  AgentCategory,
  { label: string; description: string; variant: "secondary" | "accent" | "accentMoss" }
> = {
  cerne: {
    label: "Squad CERNE",
    description: "Método de estratégia de marca — as 7 etapas mais o orquestrador.",
    variant: "accentMoss",
  },
  secao: {
    label: "Agentes por seção",
    description: "Cada um trabalha um bloco do BusinessOS.",
    variant: "accent",
  },
  utilitario: {
    label: "Utilitários",
    description: "Agentes transversais de apoio.",
    variant: "secondary",
  },
};

const CATEGORY_SEQUENCE: AgentCategory[] = ["cerne", "secao", "utilitario"];

function AgentCard({ agent }: { agent: Agent }) {
  const Icon = (agent.icon && ICONS[agent.icon]) || Bot;
  return (
    <Card className="gap-0">
      <CardHeader className="gap-0">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
            <Icon className="size-4.5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="truncate font-display text-base font-semibold">
                {agent.name}
              </CardTitle>
              <AgentEditor agent={agent} />
            </div>
            <CardDescription className="line-clamp-2">
              {agent.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="line-clamp-4 whitespace-pre-line rounded-xl bg-muted/40 p-3 font-mono text-xs leading-relaxed text-foreground/70">
          {agent.systemPrompt}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {agent.id}
          </span>
          {agent.section ? (
            <Badge variant="outline" className="capitalize">
              {agent.section}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AgentesPage() {
  const agents = await getAllAgents();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Agentes
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A squad do método CERNE e os agentes do BusinessOS. Edite o system
          prompt de cada um — será o insumo da geração por IA quando ela for
          ligada.
        </p>
      </header>

      {CATEGORY_SEQUENCE.map((category) => {
        const group = agents.filter((a) => a.category === category);
        if (group.length === 0) return null;
        const meta = CATEGORY_META[category];
        return (
          <section key={category} className="space-y-4">
            <div className="flex items-baseline gap-3">
              <h2 className="font-heading text-xl font-semibold tracking-tight">
                {meta.label}
              </h2>
              <Badge variant={meta.variant}>{group.length}</Badge>
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {meta.description}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {group.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </section>
        );
      })}

      {agents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum agente encontrado em <code>agents/</code>.
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
