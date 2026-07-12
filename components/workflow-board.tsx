"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  BellDot,
  Bot,
  Building2,
  Check,
  CircleCheck,
  CircleDashed,
  Columns3,
  Compass,
  ExternalLink,
  FileText,
  FlaskConical,
  GripVertical,
  ListChecks,
  Loader,
  Magnet,
  Package,
  Pencil,
  Plus,
  Radar,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Sprout,
  Target,
  Trash2,
  UserRound,
  Wallet,
  Workflow as WorkflowIcon,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Section } from "@/lib/types";
import type { ResolvedCard, WorkflowColumn, ActiveAgent, StageKind } from "@/lib/workflow";
import {
  moveCardAction,
  createCardAction,
  deleteCardAction,
  addStageAction,
  renameStageAction,
  deleteStageAction,
  approveCardAction,
} from "@/app/workflow/actions";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  BellDot, Bot, Building2, CircleCheck, CircleDashed, Columns3, Compass,
  FileText, FlaskConical, ListChecks, Loader, Magnet, Package, Radar,
  ScrollText, ShieldCheck, Sparkles, Sprout, Target, UserRound, Wallet,
  Workflow: WorkflowIcon,
};

const STAGE_ICON: Record<StageKind, string> = {
  "a-iniciar": "CircleDashed",
  "em-progresso": "Loader",
  aguardando: "BellDot",
  validado: "CircleCheck",
};

const SECTION_OPTIONS: { value: Section; label: string }[] = [
  { value: "founder", label: "Founder" },
  { value: "direcao", label: "Direção" },
  { value: "validacao", label: "Validação" },
  { value: "caixa", label: "Caixa" },
  { value: "marca", label: "Marca" },
  { value: "autoridade", label: "Autoridade" },
];
const SECTION_LABEL = Object.fromEntries(SECTION_OPTIONS.map((s) => [s.value, s.label]));

export type AgentLite = { id: string; name: string; icon?: string };

function Icon({ name, className }: { name?: string; className?: string }) {
  const C = (name && ICONS[name]) || Bot;
  return <C className={className} />;
}

function AgentChip({ agent }: { agent?: ResolvedCard["agent"] }) {
  if (!agent) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70">
        <span className="flex size-5 items-center justify-center rounded-full bg-muted">
          <Bot className="size-3" />
        </span>
        Sem agente
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/80">
      <span className="flex size-5 items-center justify-center rounded-full bg-muted text-foreground">
        <Icon name={agent.icon} className="size-3" />
      </span>
      {agent.name}
    </span>
  );
}

function CardBody({
  card,
  stageKind,
  onApprove,
  onDelete,
}: {
  card: ResolvedCard;
  stageKind?: StageKind;
  onApprove?: () => void;
  onDelete?: () => void;
}) {
  return (
    <>
      <div className="flex items-start gap-1.5">
        <span className="mt-0.5 text-muted-foreground/50">
          <GripVertical className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          {card.type === "block" && card.section && card.slug ? (
            <Link
              href={`/${card.section}/${card.slug}`}
              onPointerDown={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 font-display text-sm font-semibold leading-snug text-foreground hover:underline"
            >
              {card.title}
              <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
            </Link>
          ) : (
            <span className="font-display text-sm font-semibold leading-snug text-foreground">
              {card.title}
            </span>
          )}
        </div>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onDelete}
          className="shrink-0 text-muted-foreground/50 transition-colors hover:text-destructive"
          title={card.type === "block" ? "Excluir bloco" : "Excluir card"}
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 pl-5">
        <AgentChip agent={card.agent} />
        {card.type === "block" && card.section ? (
          <Badge variant="outline" className="shrink-0 text-[0.65rem]">
            {SECTION_LABEL[card.section]}
          </Badge>
        ) : (
          <Badge variant="secondary" className="shrink-0 text-[0.65rem]">
            avulso
          </Badge>
        )}
      </div>
      {typeof card.completion === "number" ? (
        <div className="mt-2 flex items-center gap-2 pl-5">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-accent-orange" style={{ width: `${card.completion}%` }} />
          </div>
          <span className="text-[0.65rem] tabular-nums text-muted-foreground">{card.completion}%</span>
        </div>
      ) : null}
      {stageKind === "aguardando" && onApprove ? (
        <div className="mt-2.5 pl-5">
          <Button
            type="button"
            size="sm"
            variant="accent"
            className="w-full"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onApprove}
          >
            <Check className="size-3.5" />
            Aprovar
          </Button>
        </div>
      ) : null}
    </>
  );
}

function DraggableCard({
  card,
  stageKind,
  onApprove,
  onDelete,
}: {
  card: ResolvedCard;
  stageKind?: StageKind;
  onApprove?: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: card.id });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none rounded-2xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <CardBody card={card} stageKind={stageKind} onApprove={onApprove} onDelete={onDelete} />
    </div>
  );
}

function Column({
  column,
  onApprove,
  onDelete,
  onAddCard,
  onRenameStage,
  onDeleteStage,
}: {
  column: WorkflowColumn;
  onApprove: (id: string) => void;
  onDelete: (card: ResolvedCard) => void;
  onAddCard: (input: NewCard) => void;
  onRenameStage: (stageId: string, label: string) => void;
  onDeleteStage: (stageId: string) => void;
}) {
  const { stage } = column;
  const { setNodeRef, isOver } = useDroppable({ id: `col:${stage.id}` });
  const [renaming, setRenaming] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(stage.label);
  const [adding, setAdding] = React.useState(false);
  const iconName = stage.kind ? STAGE_ICON[stage.kind] : "Columns3";
  const isCustom = !stage.kind;

  return (
    <div className="flex w-72 shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2 px-0.5">
        <Icon name={iconName} className="size-4 text-muted-foreground" />
        {renaming ? (
          <form
            className="flex flex-1 items-center gap-1"
            onSubmit={(e) => {
              e.preventDefault();
              onRenameStage(stage.id, renameValue);
              setRenaming(false);
            }}
          >
            <Input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="h-7 text-sm"
            />
            <Button type="submit" size="icon-sm" variant="ghost"><Check className="size-3.5" /></Button>
          </form>
        ) : (
          <>
            <h2 className="text-sm font-semibold tracking-tight">{stage.label}</h2>
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold tabular-nums text-muted-foreground">
              {column.cards.length}
            </span>
            <button
              type="button"
              onClick={() => { setRenameValue(stage.label); setRenaming(true); }}
              className="text-muted-foreground/50 hover:text-foreground"
              title="Renomear etapa"
            >
              <Pencil className="size-3.5" />
            </button>
            {isCustom ? (
              <button
                type="button"
                onClick={() => onDeleteStage(stage.id)}
                className="text-muted-foreground/50 hover:text-destructive"
                title="Excluir etapa"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </>
        )}
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-24 flex-col gap-2.5 rounded-2xl p-1.5 transition-colors",
          isOver ? "bg-accent-orange/10 ring-2 ring-accent-orange/40" : "bg-muted/30"
        )}
      >
        {column.cards.map((card) => (
          <DraggableCard
            key={card.id}
            card={card}
            stageKind={stage.kind}
            onApprove={() => onApprove(card.id)}
            onDelete={() => onDelete(card)}
          />
        ))}

        {adding ? (
          <AddCardForm
            stageId={stage.id}
            onCancel={() => setAdding(false)}
            onCreate={(input) => { onAddCard(input); setAdding(false); }}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed py-2 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
          >
            <Plus className="size-3.5" /> Adicionar card
          </button>
        )}
      </div>
    </div>
  );
}

export type NewCard =
  | { type: "standalone"; stageId: string; title: string }
  | { type: "block"; stageId: string; section: Section; title: string };

function AddCardForm({
  stageId,
  onCreate,
  onCancel,
}: {
  stageId: string;
  onCreate: (input: NewCard) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = React.useState("");
  const [kind, setKind] = React.useState<"block" | "standalone">("block");
  const [section, setSection] = React.useState<Section>("direcao");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (kind === "block") onCreate({ type: "block", stageId, section, title: title.trim() });
    else onCreate({ type: "standalone", stageId, title: title.trim() });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 rounded-2xl border bg-card p-2.5">
      <Input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título do card"
        className="h-8 text-sm"
      />
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setKind("block")}
          className={cn("flex-1 rounded-lg border px-2 py-1 text-xs", kind === "block" ? "border-foreground bg-foreground text-background" : "text-muted-foreground")}
        >
          Bloco real
        </button>
        <button
          type="button"
          onClick={() => setKind("standalone")}
          className={cn("flex-1 rounded-lg border px-2 py-1 text-xs", kind === "standalone" ? "border-foreground bg-foreground text-background" : "text-muted-foreground")}
        >
          Avulso
        </button>
      </div>
      {kind === "block" ? (
        <Select value={section} onValueChange={(v) => setSection(v as Section)}>
          <SelectTrigger className="h-8 w-full text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SECTION_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}
      <div className="flex justify-end gap-1">
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" size="sm" variant="accent">Criar</Button>
      </div>
    </form>
  );
}

export function WorkflowBoard({
  initialColumns,
  activeAgents,
}: {
  initialColumns: WorkflowColumn[];
  activeAgents: ActiveAgent[];
}) {
  const router = useRouter();
  const [columns, setColumns] = React.useState(initialColumns);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [addingStage, setAddingStage] = React.useState(false);
  const [newStage, setNewStage] = React.useState("");
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Ressincroniza quando o servidor devolve novo estado (após refresh):
  // reset de estado durante o render (padrão recomendado pelo React), sem effect.
  const sig = initialColumns
    .map((c) => `${c.stage.id}:${c.stage.label}:${c.cards.map((x) => x.id).join(",")}`)
    .join("|");
  const [prevSig, setPrevSig] = React.useState(sig);
  if (sig !== prevSig) {
    setPrevSig(sig);
    setColumns(initialColumns);
  }

  const activeCard = React.useMemo(
    () => columns.flatMap((c) => c.cards).find((c) => c.id === activeId) ?? null,
    [columns, activeId]
  );

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const cardId = String(active.id);
    const overId = String(over.id);
    const toStageId = overId.startsWith("col:") ? overId.slice(4) : null;
    if (!toStageId) return;

    let moved: ResolvedCard | undefined;
    const without = columns.map((col) => {
      const idx = col.cards.findIndex((c) => c.id === cardId);
      if (idx === -1) return col;
      moved = col.cards[idx];
      return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
    });
    if (!moved) return;
    const fromStageId = moved.stageId;
    const toIndex = without.find((c) => c.stage.id === toStageId)?.cards.length ?? 0;
    if (fromStageId === toStageId && toIndex === columns.find((c) => c.stage.id === toStageId)?.cards.length) {
      // solto na mesma coluna, no fim — nada muda
    }
    const next = without.map((col) =>
      col.stage.id === toStageId
        ? { ...col, cards: [...col.cards, { ...moved!, stageId: toStageId, order: toIndex }] }
        : col
    );
    setColumns(next);
    moveCardAction(cardId, toStageId, toIndex);
  }

  function withRefresh(fn: () => Promise<void>) {
    fn().then(() => router.refresh());
  }

  return (
    <div className="flex flex-col gap-8">
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
            {activeAgents.map(({ agent, count }) => (
              <span key={agent.id} className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-2 pr-3 text-sm">
                <span className="flex size-6 items-center justify-center rounded-full bg-muted text-foreground">
                  <Icon name={agent.icon} className="size-3.5" />
                </span>
                <span className="font-medium">{agent.name}</span>
                <span className="text-xs tabular-nums text-muted-foreground">{count} {count === 1 ? "bloco" : "blocos"}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum agente em atividade no momento.</p>
        )}
      </section>

      {/* Quadro */}
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-start gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <Column
              key={column.stage.id}
              column={column}
              onApprove={(id) => withRefresh(() => approveCardAction(id))}
              onDelete={(card) => {
                const msg = card.type === "block"
                  ? `Excluir o bloco "${card.title}"? Isso remove o arquivo de conteúdo permanentemente.`
                  : `Excluir o card "${card.title}"?`;
                if (window.confirm(msg)) withRefresh(() => deleteCardAction(card.id));
              }}
              onAddCard={(input) => withRefresh(() => createCardAction(input))}
              onRenameStage={(stageId, label) => withRefresh(() => renameStageAction(stageId, label))}
              onDeleteStage={(stageId) => {
                if (window.confirm("Excluir esta etapa? Os cards voltam para a primeira etapa."))
                  withRefresh(() => deleteStageAction(stageId));
              }}
            />
          ))}

          {/* Adicionar etapa */}
          <div className="w-64 shrink-0">
            {addingStage ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newStage.trim()) withRefresh(() => addStageAction(newStage.trim()));
                  setNewStage("");
                  setAddingStage(false);
                }}
                className="flex items-center gap-1 rounded-2xl border bg-card p-2"
              >
                <Input autoFocus value={newStage} onChange={(e) => setNewStage(e.target.value)} placeholder="Nome da etapa" className="h-8 text-sm" />
                <Button type="submit" size="icon-sm" variant="ghost"><Check className="size-4" /></Button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setAddingStage(true)}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-dashed py-3 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Plus className="size-4" /> Adicionar etapa
              </button>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <div className="w-72 rotate-2 rounded-2xl border bg-card p-3 shadow-lg">
              <CardBody card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
