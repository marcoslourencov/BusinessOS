"use client";

import * as React from "react";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { ContentItem, ContentStatus, Section } from "@/lib/types";
import { getSectionQuestions, type Question } from "@/lib/questions";
import { saveBlockContentAction } from "@/app/[section]/[slug]/actions";
import { deleteBlockAction } from "@/lib/actions";

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "validado", label: "Validado" },
];

const STATUS_LABELS: Record<ContentStatus, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
};

export type ContentOnboardingProps = {
  section: Section;
  item: ContentItem;
};

// Cada passo do stepper: intro, uma pergunta, meta e review.
type Step =
  | { kind: "intro" }
  | { kind: "question"; question: Question }
  | { kind: "meta" }
  | { kind: "review" };

export function ContentOnboarding({ section, item }: ContentOnboardingProps) {
  const router = useRouter();
  const { intro, questions } = useMemo(
    () => getSectionQuestions(section),
    [section]
  );

  const steps = useMemo<Step[]>(
    () => [
      { kind: "intro" },
      ...questions.map((question) => ({ kind: "question", question }) as Step),
      { kind: "meta" },
      { kind: "review" },
    ],
    [questions]
  );

  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>(
    () => ({ ...(item.frontmatter.answers ?? {}) })
  );
  const [title, setTitle] = useState(item.frontmatter.title);
  const [status, setStatus] = useState<ContentStatus>(item.frontmatter.status);
  const [tagsInput, setTagsInput] = useState(item.frontmatter.tags.join(", "));
  const [aiContext, setAiContext] = useState(item.frontmatter.aiContext ?? "");

  const [isSaving, startSaveTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();

  const controlRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const totalSteps = steps.length;
  const current = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progressValue =
    totalSteps > 1 ? (stepIndex / (totalSteps - 1)) * 100 : 100;

  // Ao abrir/trocar de passo, foca o controle principal do passo atual.
  React.useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => controlRef.current?.focus(), 40);
    return () => window.clearTimeout(id);
  }, [open, stepIndex]);

  function resetToStart() {
    setStepIndex(0);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reabrir sempre começa pela intro; o estado editado permanece.
      resetToStart();
    }
  }

  function goNext() {
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function setAnswer(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSave() {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- excluídos do restante preservado
      updatedAt,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- regerado no servidor
      briefing,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- regerado no servidor
      briefingGeneratedAt,
      ...rest
    } = item.frontmatter;

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    startSaveTransition(async () => {
      await saveBlockContentAction({
        section,
        slug: item.frontmatter.slug,
        frontmatter: {
          ...rest,
          title,
          status,
          tags,
          aiContext: aiContext.trim() ? aiContext.trim() : undefined,
          answers,
        },
      });
      setOpen(false);
      resetToStart();
      router.refresh();
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteBlockAction(section, item.frontmatter.slug);
      router.push(`/${section}`);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="accent" />}>
        <Pencil className="size-4" />
        Editar
      </DialogTrigger>
      <DialogContent
        className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg"
        showCloseButton
      >
        <div className="flex flex-col gap-3 p-6 pb-4">
          <Progress
            value={progressValue}
            label={`Passo ${stepIndex + 1} de ${totalSteps}`}
          />
          <DialogHeader>
            {current.kind === "intro" && (
              <>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="size-4 text-accent-orange" />
                  Vamos editar &ldquo;{item.frontmatter.title}&rdquo;
                </DialogTitle>
                <DialogDescription>{intro}</DialogDescription>
              </>
            )}
            {current.kind === "question" && (
              <>
                <DialogTitle>{current.question.label}</DialogTitle>
                {current.question.help && (
                  <DialogDescription>{current.question.help}</DialogDescription>
                )}
              </>
            )}
            {current.kind === "meta" && (
              <>
                <DialogTitle>Detalhes do bloco</DialogTitle>
                <DialogDescription>
                  Ajuste título, status, tags e o contexto para a IA.
                </DialogDescription>
              </>
            )}
            {current.kind === "review" && (
              <>
                <DialogTitle>Revisar e salvar</DialogTitle>
                <DialogDescription>
                  Confira as respostas. Ao salvar, o briefing é regerado.
                </DialogDescription>
              </>
            )}
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-4">
          {current.kind === "intro" && (
            <p className="text-sm text-muted-foreground">
              Você pode responder uma pergunta de cada vez e voltar quando
              quiser. Nenhum campo é obrigatório — preencha no seu ritmo.
            </p>
          )}

          {current.kind === "question" && (
            <QuestionControl
              key={current.question.id}
              question={current.question}
              value={answers[current.question.id] ?? ""}
              onChange={(v) => setAnswer(current.question.id, v)}
              onEnterAdvance={goNext}
              controlRef={controlRef}
            />
          )}

          {current.kind === "meta" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-title">Título</Label>
                <Input
                  id="onboarding-title"
                  ref={controlRef as React.Ref<HTMLInputElement>}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título do bloco"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value as ContentStatus)}
                >
                  <SelectTrigger id="onboarding-status" className="w-56">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-tags">Tags</Label>
                <Input
                  id="onboarding-tags"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="oferta, pricing, proposta-de-valor"
                />
                <p className="text-xs text-muted-foreground">
                  Separe as tags por vírgula.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="onboarding-ai">Contexto para IA</Label>
                <Textarea
                  id="onboarding-ai"
                  value={aiContext}
                  onChange={(e) => setAiContext(e.target.value)}
                  rows={3}
                  placeholder="Instrução curta para orientar agentes de IA sobre este bloco."
                />
              </div>
            </div>
          )}

          {current.kind === "review" && (
            <div className="flex flex-col gap-4">
              <dl className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4">
                <ReviewRow label="Título" value={title} />
                <ReviewRow label="Status" value={STATUS_LABELS[status]} />
                <ReviewRow
                  label="Tags"
                  value={
                    tagsInput
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .join(", ") || undefined
                  }
                />
                <ReviewRow label="Contexto para IA" value={aiContext} />
              </dl>

              <dl className="flex flex-col gap-3">
                {questions.map((question) => (
                  <ReviewRow
                    key={question.id}
                    label={question.label}
                    value={answers[question.id]}
                  />
                ))}
              </dl>

              <div className="pt-1">
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      />
                    }
                  >
                    <Trash2 className="size-4" />
                    Excluir bloco
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Excluir &ldquo;{title}&rdquo;?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação remove o arquivo de conteúdo permanentemente e
                        não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={isDeleting}
                        onClick={handleDelete}
                      >
                        {isDeleting ? "Excluindo..." : "Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mx-0 mb-0 items-center gap-3 px-6 py-5 sm:justify-between">
          <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
            {isFirst ? (
              <DialogClose render={<Button variant="ghost" type="button" />}>
                Cancelar
              </DialogClose>
            ) : (
              <Button variant="ghost" type="button" onClick={goBack}>
                <ArrowLeft className="size-4" />
                Voltar
              </Button>
            )}
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {current.kind === "intro" && (
              <Button variant="accent" type="button" onClick={goNext}>
                Começar
                <ArrowRight className="size-4" />
              </Button>
            )}
            {(current.kind === "question" || current.kind === "meta") && (
              <Button type="button" onClick={goNext}>
                Próximo
                <ArrowRight className="size-4" />
              </Button>
            )}
            {current.kind === "review" && (
              <Button
                variant="accent"
                type="button"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Check className="size-4" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function QuestionControl({
  question,
  value,
  onChange,
  onEnterAdvance,
  controlRef,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onEnterAdvance: () => void;
  controlRef: React.Ref<HTMLInputElement | HTMLTextAreaElement>;
}) {
  if (question.type === "select") {
    return (
      <Select value={value} onValueChange={(v) => onChange(v ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={question.placeholder ?? "Selecione"} />
        </SelectTrigger>
        <SelectContent>
          {(question.options ?? []).map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (question.type === "long") {
    return (
      <Textarea
        ref={controlRef as React.Ref<HTMLTextAreaElement>}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder={question.placeholder}
        className="min-h-32"
      />
    );
  }

  return (
    <Input
      ref={controlRef as React.Ref<HTMLInputElement>}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={question.placeholder}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onEnterAdvance();
        }
      }}
    />
  );
}

function ReviewRow({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  const trimmed = value?.trim();
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-sm whitespace-pre-wrap",
          trimmed ? "text-foreground" : "text-muted-foreground/60 italic"
        )}
      >
        {trimmed || "Sem resposta"}
      </dd>
    </div>
  );
}
