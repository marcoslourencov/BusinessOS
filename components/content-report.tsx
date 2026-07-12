import * as React from "react";
import {
  CalendarClock,
  CircleCheck,
  ExternalLink,
  ListChecks,
  PencilLine,
  Radar,
  Sparkles,
  Target,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { getCompletion } from "@/lib/briefing";
import { getSectionQuestions } from "@/lib/questions";
import type { Question } from "@/lib/questions";
import type {
  ContentItem,
  ContentStatus,
  DataKind,
  Report,
  Section,
} from "@/lib/types";

const statusLabels: Record<ContentStatus, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
};

/** Rótulo + variante de Badge por natureza do dado. */
const kindConfig: Record<
  DataKind,
  { label: string; variant: "secondary" | "accent" | "accentMoss" }
> = {
  fato: { label: "Fato", variant: "secondary" },
  meta: { label: "Meta", variant: "accent" },
  expectativa: { label: "Expectativa", variant: "accentMoss" },
};

function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Resolve o rótulo legível de uma resposta (para selects, mapeia value -> label). */
function displayAnswer(question: Question, raw: string): string {
  if (question.type === "select" && question.options) {
    const match = question.options.find((o) => o.value === raw);
    if (match) return match.label;
  }
  return raw;
}

/** Renderiza inline `**bold**` e `_italic_` de forma robusta, sem lib externa. */
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|_[^_]+_)/g;
  let last = 0;
  let key = 0;
  for (const match of text.matchAll(regex)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      nodes.push(
        <em key={key++} className="italic text-muted-foreground">
          {token.slice(1, -1)}
        </em>
      );
    }
    last = index + token.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

/**
 * Formatador leve do briefing (markdown-ish): divide em blocos por linha em
 * branco, agrupa linhas `- ` em listas e trata `**bold**`/`_italic_`.
 */
function BriefingBody({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim());
        const isList = lines.every((l) => l.startsWith("- "));
        if (isList) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-2.5 leading-relaxed">
                  <span
                    aria-hidden
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-orange"
                  />
                  <span className="text-foreground/90">
                    {renderInline(line.slice(2))}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        // Nota em itálico solta (ex.: _…_) fica sutil.
        const whole = block.trim();
        if (whole.startsWith("_") && whole.endsWith("_") && !whole.includes("\n")) {
          return (
            <p key={i} className="text-sm italic text-muted-foreground">
              {whole.slice(1, -1)}
            </p>
          );
        }
        return (
          <p key={i} className="leading-relaxed text-foreground/90">
            {renderInline(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Seção "Pesquisa de mercado": dados reais com fontes citáveis. Cada dado é
 * marcado como fato, meta ou expectativa (ver DataKind). As fontes são
 * numeradas e referenciadas por superscrito nos dados.
 */
function ReportBlock({ report }: { report: Report }) {
  const collectedLabel = formatDate(report.generatedAt);
  const hasSources = report.sources.length > 0;

  return (
    <Card className="gap-0">
      <CardHeader className="border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-accent-orange text-accent-orange-foreground">
            <Radar className="size-4" />
          </span>
          <CardTitle className="font-heading text-2xl tracking-tight">
            Pesquisa de mercado
          </CardTitle>
        </div>
        <CardDescription>
          Dados reais com fontes.{" "}
          <span className="text-foreground/70">
            Fato = verificado · Meta = objetivo · Expectativa = projeção.
          </span>
          {collectedLabel ? ` Coletado em ${collectedLabel}.` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-5">
        {report.summary?.trim() ? (
          <div className="text-base">
            <BriefingBody text={report.summary} />
          </div>
        ) : null}

        {report.findings.length > 0 ? (
          <ul className="space-y-3">
            {report.findings.map((finding, i) => {
              const kind = kindConfig[finding.kind];
              return (
                <li
                  key={i}
                  className="rounded-2xl border bg-card p-4 space-y-1.5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      {finding.label}
                    </span>
                    <Badge variant={kind.variant}>{kind.label}</Badge>
                  </div>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {finding.value}
                    {finding.sourceIndexes?.length ? (
                      <sup className="ml-1 text-xs font-normal text-muted-foreground">
                        {finding.sourceIndexes
                          .map((s) => s + 1)
                          .join(",")}
                      </sup>
                    ) : null}
                  </p>
                  {finding.detail ? (
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {finding.detail}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}

        {hasSources ? (
          <div className="space-y-2.5">
            <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Fontes
            </h3>
            <ol className="space-y-2 text-sm">
              {report.sources.map((source, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-muted-foreground tabular-nums">
                    {i + 1}.
                  </span>
                  <span className="min-w-0">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {source.title}
                      <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                    </a>
                    {source.publisher || source.publishedAt ? (
                      <span className="text-muted-foreground">
                        {" — "}
                        {[source.publisher, source.publishedAt]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function ContentReport({
  section,
  item,
}: {
  section: Section;
  item: ContentItem;
}) {
  const { frontmatter } = item;
  const answers = frontmatter.answers ?? {};
  const { questions } = getSectionQuestions(section);
  const { answered, total, pct } = getCompletion(section, answers);

  const answeredQuestions = questions.filter(
    (q) => (answers[q.id] ?? "").trim().length > 0
  );
  const hasAnswers = answeredQuestions.length > 0;

  const updatedLabel =
    formatDate(frontmatter.briefingGeneratedAt) ??
    formatDate(frontmatter.updatedAt) ??
    "—";

  return (
    <div className="space-y-8">
      {/* 1. Insight tiles */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          tone="dark"
          icon={Target}
          label="Completude"
          value={`${pct}%`}
        >
          <Progress
            value={pct}
            className="mt-3"
            indicatorClassName="bg-accent-orange"
          />
        </StatCard>

        <StatCard
          icon={CircleCheck}
          label="Status"
          value={statusLabels[frontmatter.status]}
        >
          {frontmatter.validationStage ? (
            <span className="mt-1 text-xs text-muted-foreground">
              Validação: {frontmatter.validationStage.replace(/-/g, " ")}
            </span>
          ) : null}
        </StatCard>

        <StatCard
          icon={ListChecks}
          label="Campos preenchidos"
          value={String(answered)}
          unit={`/ ${total}`}
        />

        <StatCard
          icon={CalendarClock}
          label="Última atualização"
          value={updatedLabel}
        />
      </section>

      {/* 2. Briefing */}
      {frontmatter.briefing?.trim() ? (
        <Card className="gap-0">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-accent-moss text-accent-moss-foreground">
                <Sparkles className="size-4" />
              </span>
              <CardTitle className="font-heading text-2xl tracking-tight">
                Briefing
              </CardTitle>
            </div>
            <CardDescription>
              Síntese gerada a partir das suas respostas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5 text-base">
            <BriefingBody text={frontmatter.briefing} />
          </CardContent>
        </Card>
      ) : null}

      {/* 2b. Pesquisa de mercado (dados reais com fontes) */}
      {frontmatter.report ? <ReportBlock report={frontmatter.report} /> : null}

      {/* 3. Respostas */}
      <section className="space-y-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-xl font-semibold tracking-tight">
            Respostas
          </h2>
          {hasAnswers ? (
            <span className="text-sm text-muted-foreground">
              {answered} de {total}
            </span>
          ) : null}
        </div>

        {hasAnswers ? (
          <div className="space-y-6">
            {answeredQuestions.map((q) => (
              <article key={q.id} className="space-y-1.5">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {q.label}
                </h3>
                {q.help ? (
                  <p className="text-xs text-muted-foreground">{q.help}</p>
                ) : null}
                <p className="leading-relaxed whitespace-pre-line text-foreground/90">
                  {displayAnswer(q, (answers[q.id] ?? "").trim())}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <PencilLine className="size-5" />
              </span>
              <div className="space-y-1">
                <p className="font-medium text-foreground">
                  Nenhuma resposta ainda
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Clique em{" "}
                  <span className="font-medium text-foreground">Editar</span>{" "}
                  para começar o onboarding e preencher este bloco.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* 4. Tags + Contexto para IA */}
      {(frontmatter.tags?.length ?? 0) > 0 || frontmatter.aiContext ? (
        <section className="space-y-4">
          {(frontmatter.tags?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground">
                Tags
              </span>
              {frontmatter.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}

          {frontmatter.aiContext ? (
            <div
              className={cn(
                "rounded-2xl border border-dashed bg-muted/40 p-4",
                "space-y-1.5"
              )}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground">
                <Sparkles className="size-3.5" />
                Contexto para IA
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {frontmatter.aiContext}
              </p>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
