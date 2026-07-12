"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Layers, CheckCircle2, Clock, PencilLine } from "lucide-react";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { ContentGrid, type ContentGridItem } from "@/components/content-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContentStatus } from "@/lib/types";
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
import { createBlockAction } from "@/lib/actions";
import type { Section } from "@/lib/types";

export type SectionViewProps = {
  section: Section;
  title: string;
  description?: string;
  items: ContentGridItem[];
};

export function SectionView({ section, title, description, items }: SectionViewProps) {
  const router = useRouter();
  const [view, setView] = useState<ViewMode>("grid");
  const [newTitle, setNewTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle.trim()) return;

    startTransition(async () => {
      const created = await createBlockAction(section, newTitle.trim());
      setOpen(false);
      setNewTitle("");
      router.push(`/${section}/${created.frontmatter.slug}`);
    });
  }

  const total = items.length;
  const counts: Record<ContentStatus, number> = {
    validado: 0,
    "em-andamento": 0,
    rascunho: 0,
  };
  for (const item of items) {
    if (item.status) counts[item.status] += 1;
  }

  const stats = [
    {
      key: "total",
      label: "Blocos",
      value: total,
      icon: Layers,
      iconClassName: "bg-primary/10 text-foreground",
    },
    {
      key: "validado",
      label: "Validados",
      value: counts.validado,
      icon: CheckCircle2,
      iconClassName: "bg-accent-orange text-accent-orange-foreground",
    },
    {
      key: "em-andamento",
      label: "Em andamento",
      value: counts["em-andamento"],
      icon: Clock,
      iconClassName:
        "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
    },
    {
      key: "rascunho",
      label: "Rascunhos",
      value: counts.rascunho,
      icon: PencilLine,
      iconClassName: "bg-muted text-muted-foreground",
    },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={<Button variant="accent" size="lg" className="rounded-full" />}
            >
              <Plus className="size-4" />
              Novo bloco
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Novo bloco em {title}</DialogTitle>
                  <DialogDescription>
                    Dê um título ao bloco. Você poderá preencher o conteúdo completo
                    na próxima tela.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1.5 py-4">
                  <Label htmlFor="new-block-title">Título</Label>
                  <Input
                    id="new-block-title"
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex.: Canal de aquisição"
                    required
                  />
                </div>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" type="button" />}>
                    Cancelar
                  </DialogClose>
                  <Button type="submit" disabled={isPending || !newTitle.trim()}>
                    {isPending ? "Criando..." : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <ViewToggle value={view} onValueChange={setView} className="w-36" />
        </div>
      </div>
      {total > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="flex items-center gap-3 rounded-2xl bg-card px-4 py-3 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-full ${stat.iconClassName}`}
              >
                <stat.icon className="size-5" />
              </span>
              <div className="flex flex-col">
                <span className="font-heading text-2xl leading-none font-semibold tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      <ContentGrid items={items} view={view} />
    </div>
  );
}
