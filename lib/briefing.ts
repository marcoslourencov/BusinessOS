import type { Section } from "@/lib/types";
import { getSectionQuestions } from "@/lib/questions";

export type Completion = { answered: number; total: number; pct: number };

/** Quantas perguntas da seção estão respondidas (não-vazias). */
export function getCompletion(
  section: Section,
  answers: Record<string, string> = {}
): Completion {
  const { questions } = getSectionQuestions(section);
  const total = questions.length;
  const answered = questions.filter(
    (q) => (answers[q.id] ?? "").trim().length > 0
  ).length;
  const pct = total === 0 ? 0 : Math.round((answered / total) * 100);
  return { answered, total, pct };
}

/**
 * Corpo markdown legível derivado das respostas — mantém excerpts (listas,
 * busca) significativos, já que o body passa a refletir as respostas.
 */
export function answersToBody(
  section: Section,
  answers: Record<string, string> = {}
): string {
  const { questions } = getSectionQuestions(section);
  return questions
    .map((q) => {
      const a = (answers[q.id] ?? "").trim();
      return a ? `## ${q.label}\n\n${a}` : null;
    })
    .filter(Boolean)
    .join("\n\n");
}

function firstSentence(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.{0,140}?[.!?])(\s|$)/);
  if (m) return m[1];
  return flat.length > 140 ? `${flat.slice(0, 140).trimEnd()}…` : flat;
}

/**
 * Briefing determinístico composto a partir das respostas.
 *
 * STUB: hoje apenas organiza as respostas em um resumo. O contrato desta
 * função é o "gancho" de IA — futuramente troque o corpo por uma chamada ao
 * Claude (AI SDK) que analisa `answers` e devolve um briefing executivo.
 * Mantenha a assinatura estável para o fluxo de salvamento não mudar.
 *
 * TODO(ai): substituir por generateText({ model: "anthropic/claude-...", prompt })
 * via AI SDK / Vercel AI Gateway quando a key estiver disponível.
 */
export function composeBriefing(
  section: Section,
  answers: Record<string, string> = {}
): string {
  const { questions, coreQuestionId } = getSectionQuestions(section);
  const { pct } = getCompletion(section, answers);

  const core = (answers[coreQuestionId] ?? "").trim();
  const highlights = questions
    .filter((q) => q.id !== coreQuestionId && (answers[q.id] ?? "").trim())
    .map((q) => `- **${q.label}** ${firstSentence(answers[q.id])}`)
    .join("\n");

  const parts: string[] = [];
  if (core) parts.push(core);
  if (highlights) parts.push(`**Pontos-chave**\n\n${highlights}`);
  parts.push(
    `_Briefing gerado automaticamente a partir das suas respostas (${pct}% preenchido). Uma IA (Claude) vai refinar isto em breve._`
  );
  return parts.join("\n\n");
}
