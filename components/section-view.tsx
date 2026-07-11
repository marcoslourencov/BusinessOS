"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { ContentGrid, type ContentGridItem } from "@/components/content-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="rounded-lg" />}>
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
      <ContentGrid items={items} view={view} />
    </div>
  );
}
