"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Activity, CircleCheck, Handshake, Percent, Plus, Radar, Trophy, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Lead, LeadStage } from "@/lib/leads";
import { LEAD_STAGES, STAGE_META, fitTone, LeadForm } from "@/components/leads-view";
import { moveLeadStageAction } from "@/app/oportunidades/actions";

type Column = { stage: LeadStage; leads: Lead[] };

function group(leads: Lead[]): Column[] {
  return LEAD_STAGES.map((stage) => ({
    stage,
    leads: leads.filter((l) => l.stage === stage),
  }));
}

function CardInner({ lead }: { lead: Lead }) {
  return (
    <>
      <p className="truncate font-display text-sm font-semibold text-foreground">{lead.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {lead.role ? `${lead.role} · ` : ""}{lead.company}
      </p>
      {lead.companyNote ? (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground/80">{lead.companyNote}</p>
      ) : null}
      <div className="mt-2.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", fitTone(lead.fit))} style={{ width: `${lead.fit ?? 0}%` }} />
        </div>
        <span className="text-[0.65rem] tabular-nums text-muted-foreground">{lead.fit ?? "—"}</span>
      </div>
      {lead.source ? (
        <span className="mt-2 inline-flex items-center gap-1 text-[0.7rem] text-muted-foreground/80">
          <Radar className="size-3" /> {lead.source}
        </span>
      ) : null}
    </>
  );
}

function DraggableCard({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: lead.id });
  return (
    <div
      ref={setNodeRef}
      data-lead-id={lead.id}
      suppressHydrationWarning
      {...listeners}
      {...attributes}
      onClick={onOpen}
      className={cn(
        "cursor-grab touch-none rounded-2xl border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40"
      )}
    >
      <CardInner lead={lead} />
    </div>
  );
}

function Column({ column, onOpen }: { column: Column; onOpen: (lead: Lead) => void }) {
  const { stage, leads } = column;
  const meta = STAGE_META[stage];
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  return (
    <div className="flex w-80 shrink-0 flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        {meta.check ? (
          <CircleCheck className="size-4 text-accent-moss" />
        ) : meta.cross ? (
          <X className="size-3.5 text-muted-foreground" />
        ) : (
          <span className={cn("size-2 rounded-full", meta.dot)} />
        )}
        <h2 className="text-sm font-semibold tracking-tight">{meta.label}</h2>
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-semibold tabular-nums text-muted-foreground">
          {leads.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        data-stage-id={stage}
        className={cn(
          "flex min-h-[calc(100vh-22rem)] flex-1 flex-col gap-2.5 rounded-2xl border p-2.5 transition-colors",
          isOver ? "border-accent-orange/40 bg-accent-orange/10" : "border-transparent bg-muted/40"
        )}
      >
        {leads.map((lead) => (
          <DraggableCard key={lead.id} lead={lead} onOpen={() => onOpen(lead)} />
        ))}
        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed py-6 text-center text-xs text-muted-foreground/60">Vazio</div>
        ) : null}
      </div>
    </div>
  );
}

export function OpportunitiesBoard({ leads }: { leads: Lead[] }) {
  const [columns, setColumns] = React.useState(() => group(leads));
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Lead | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // Ressincroniza quando o servidor devolve novo estado (reset durante render).
  const sig = leads.map((l) => `${l.id}:${l.stage}`).join("|");
  const [prevSig, setPrevSig] = React.useState(sig);
  if (sig !== prevSig) {
    setPrevSig(sig);
    setColumns(group(leads));
  }

  const activeLead = React.useMemo(
    () => columns.flatMap((c) => c.leads).find((l) => l.id === activeId) ?? null,
    [columns, activeId]
  );

  function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const id = String(active.id);
    const toStage = String(over.id) as LeadStage;
    if (!LEAD_STAGES.includes(toStage)) return;

    let moved: Lead | undefined;
    const without = columns.map((col) => {
      const idx = col.leads.findIndex((l) => l.id === id);
      if (idx === -1) return col;
      moved = col.leads[idx];
      return { ...col, leads: col.leads.filter((l) => l.id !== id) };
    });
    if (!moved || moved.stage === toStage) return;
    const updated = { ...moved, stage: toStage };
    setColumns(
      without.map((col) => (col.stage === toStage ? { ...col, leads: [updated, ...col.leads] } : col))
    );
    moveLeadStageAction(id, toStage);
  }

  // Stats derivados do estado otimista (reagem ao arrastar).
  const countByStage = (s: LeadStage) => columns.find((c) => c.stage === s)?.leads.length ?? 0;
  const ativas =
    countByStage("novo") + countByStage("contatado") + countByStage("qualificado") + countByStage("em-negociacao");
  const emNegociacao = countByStage("em-negociacao");
  const ganhas = countByStage("ganho");
  const perdidas = countByStage("perdido");
  const fechadas = ganhas + perdidas;
  const taxaGanho = fechadas > 0 ? Math.round((ganhas / fechadas) * 100) : 0;

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Oportunidades</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            O funil dos seus leads em kanban — cada card é uma oportunidade caminhando do primeiro contato ao fechamento. Arraste-as conforme avançam.
          </p>
        </div>
        <Button variant="accent" onClick={() => { setCurrent(null); setOpen(true); }}>
          <Plus className="size-4" /> Novo lead
        </Button>
      </header>

      {/* Painel de números */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Activity} label="Ativas" value={String(ativas)} />
        <StatCard icon={Handshake} label="Em negociação" value={String(emNegociacao)} />
        <StatCard icon={Trophy} label="Ganhas" value={String(ganhas)} tone="moss" />
        <StatCard icon={Percent} label="Taxa de ganho" value={`${taxaGanho}%`} />
      </section>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-stretch gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {columns.map((column) => (
            <Column
              key={column.stage}
              column={column}
              onOpen={(lead) => { setCurrent(lead); setOpen(true); }}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeLead ? (
            <div className="w-72 rotate-2 rounded-2xl border bg-card p-3 shadow-lg">
              <CardInner lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          <LeadForm key={current?.id ?? "new"} lead={current} onDone={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
