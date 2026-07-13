"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, CircleCheck, Plus, Radar, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Lead, LeadInput, LeadStage } from "@/lib/leads";
import { saveLeadAction, createLeadAction, deleteLeadAction } from "@/app/leads/actions";

export const LEAD_STAGES: LeadStage[] = [
  "novo",
  "contatado",
  "qualificado",
  "em-negociacao",
  "ganho",
  "perdido",
];

type StageMeta = { label: string; pill: string; dot: string; check?: boolean; cross?: boolean };

export const STAGE_META: Record<LeadStage, StageMeta> = {
  novo: { label: "Novo", pill: "border text-muted-foreground", dot: "ring-1 ring-muted-foreground/50" },
  contatado: { label: "Contatado", pill: "bg-muted text-foreground", dot: "bg-muted-foreground" },
  qualificado: { label: "Qualificado", pill: "bg-violet-500/12 text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  "em-negociacao": { label: "Em negociação", pill: "bg-accent-orange/15 text-accent-orange", dot: "bg-accent-orange" },
  ganho: { label: "Ganho", pill: "bg-accent-moss/15 text-accent-moss", dot: "bg-accent-moss", check: true },
  perdido: { label: "Perdido", pill: "bg-muted text-muted-foreground/70", dot: "bg-muted-foreground/50", cross: true },
};

export function StagePill({ stage }: { stage: LeadStage }) {
  const m = STAGE_META[stage];
  return (
    <span className={cn("inline-flex h-6 w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium", m.pill)}>
      {m.check ? (
        <CircleCheck className="size-3.5" />
      ) : m.cross ? (
        <X className="size-3" />
      ) : (
        <span className={cn("size-1.5 rounded-full", m.dot)} />
      )}
      {m.label}
    </span>
  );
}

export function fitTone(fit?: number): string {
  if (fit == null) return "bg-muted-foreground/30";
  if (fit >= 80) return "bg-accent-moss";
  if (fit >= 60) return "bg-accent-orange";
  return "bg-muted-foreground/40";
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(d);
}

const GRID = "grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-[1.5fr_1.7fr_1fr_0.9fr_1fr] sm:items-center";

function LeadCard({ lead, onOpen }: { lead: Lead; onOpen: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className="w-full cursor-pointer rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      <div className={GRID}>
        {/* LEAD */}
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-semibold text-foreground">{lead.name}</p>
          {lead.role ? <p className="truncate text-xs text-muted-foreground">{lead.role}</p> : null}
          {lead.email ? <p className="truncate font-mono text-[0.7rem] text-muted-foreground/80">{lead.email}</p> : null}
        </div>
        {/* EMPRESA */}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{lead.company}</p>
          {lead.companyNote ? <p className="line-clamp-2 text-xs text-muted-foreground">{lead.companyNote}</p> : null}
        </div>
        {/* FONTE */}
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground/90">{lead.source ?? "—"}</p>
          {lead.via ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground/80">
              <Radar className="size-3" /> {lead.via}
            </span>
          ) : null}
        </div>
        {/* FIT */}
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full", fitTone(lead.fit))} style={{ width: `${lead.fit ?? 0}%` }} />
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{lead.fit ?? "—"}</span>
        </div>
        {/* ESTÁGIO + ENTROU */}
        <div className="flex items-center justify-between gap-2 sm:justify-start">
          <StagePill stage={lead.stage} />
          <span className="text-xs tabular-nums text-muted-foreground sm:ml-auto">{formatDate(lead.enteredAt)}</span>
        </div>
      </div>
    </div>
  );
}

const EMPTY: LeadInput = { name: "", company: "", stage: "novo", via: "manual", fit: undefined, notes: "" };

export function LeadForm({
  lead,
  onDone,
}: {
  lead: Lead | null; // null = criar
  onDone: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<LeadInput>(
    lead
      ? {
          name: lead.name, role: lead.role, email: lead.email, company: lead.company,
          companyNote: lead.companyNote, source: lead.source, via: lead.via,
          fit: lead.fit, stage: lead.stage, notes: lead.notes,
        }
      : EMPTY
  );
  const [isSaving, startSave] = React.useTransition();
  const [isDeleting, startDelete] = React.useTransition();

  function set<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.company.trim()) return;
    startSave(async () => {
      if (lead) await saveLeadAction(lead.id, form);
      else await createLeadAction(form);
      onDone();
      router.refresh();
    });
  }

  function handleDelete() {
    if (!lead) return;
    if (!window.confirm(`Excluir o lead "${lead.name}"?`)) return;
    startDelete(async () => {
      await deleteLeadAction(lead.id);
      onDone();
      router.refresh();
    });
  }

  return (
    <>
      <SheetHeader className="border-b">
        <SheetTitle className="font-display text-lg">
          {lead ? lead.name : "Novo lead"}
        </SheetTitle>
        <SheetDescription>
          {lead ? "Veja e edite as informações do lead." : "Cadastre um novo lead manualmente."}
        </SheetDescription>
      </SheetHeader>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4">
        <Field label="Nome">
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Nome do contato" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Cargo">
            <Input value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} placeholder="Ex.: Founder" />
          </Field>
          <Field label="E-mail">
            <Input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="nome@empresa.com" />
          </Field>
        </div>
        <Field label="Empresa">
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Empresa" />
        </Field>
        <Field label="Contexto / nota da empresa">
          <Textarea rows={2} value={form.companyNote ?? ""} onChange={(e) => set("companyNote", e.target.value)} placeholder="Ex.: Fit alto com o ICP; orçamento confirmado." />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fonte">
            <Input value={form.source ?? ""} onChange={(e) => set("source", e.target.value)} placeholder="LinkedIn, Indicação…" />
          </Field>
          <Field label="Via">
            <Input value={form.via ?? ""} onChange={(e) => set("via", e.target.value)} placeholder="prospector / manual" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fit (0–100)">
            <Input
              type="number"
              min={0}
              max={100}
              value={form.fit ?? ""}
              onChange={(e) => set("fit", e.target.value === "" ? undefined : Number(e.target.value))}
              placeholder="0–100"
            />
          </Field>
          <Field label="Estágio">
            <Select value={form.stage} onValueChange={(v) => set("stage", v as LeadStage)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEAD_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{STAGE_META[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Observações">
          <Textarea rows={5} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Histórico, próximos passos, contexto…" />
        </Field>
      </div>

      <SheetFooter className="flex-row items-center justify-between border-t">
        {lead ? (
          <Button variant="ghost" className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="size-4" /> {isDeleting ? "Excluindo…" : "Excluir"}
          </Button>
        ) : <span />}
        <Button variant="accent" onClick={handleSave} disabled={isSaving}>
          <Check className="size-4" /> {isSaving ? "Salvando…" : "Salvar"}
        </Button>
      </SheetFooter>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function LeadsView({ leads }: { leads: Lead[] }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<Lead | null>(null);

  function openEdit(lead: Lead) {
    setCurrent(lead);
    setOpen(true);
  }
  function openCreate() {
    setCurrent(null);
    setOpen(true);
  }

  const counts = LEAD_STAGES.map((s) => ({ stage: s, n: leads.filter((l) => l.stage === s).length }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} {leads.length === 1 ? "lead" : "leads"}
            {counts
              .filter((c) => c.n > 0)
              .map((c) => ` · ${c.n} ${STAGE_META[c.stage].label.toLowerCase()}`)
              .join("")}
          </p>
        </div>
        <Button variant="accent" onClick={openCreate}>
          <Plus className="size-4" /> Novo lead
        </Button>
      </header>

      {/* Cabeçalho de colunas (rótulos, não é tabela) */}
      {leads.length > 0 ? (
        <div className={cn(GRID, "hidden px-4 text-xs font-medium tracking-wide text-muted-foreground uppercase sm:grid")}>
          <span>Lead</span>
          <span>Empresa</span>
          <span>Fonte</span>
          <span>Fit</span>
          <span>Estágio</span>
        </div>
      ) : null}

      {/* Lista de cards */}
      <div className="flex flex-col gap-2.5">
        {leads.length > 0 ? (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} onOpen={() => openEdit(lead)} />)
        ) : (
          <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
            Nenhum lead ainda. Clique em <span className="font-medium text-foreground">Novo lead</span> para começar.
          </div>
        )}
      </div>

      {/* Drawer lateral direito */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
          {/* key força o form a re-montar ao trocar de lead */}
          <LeadForm key={current?.id ?? "new"} lead={current} onDone={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
