"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { ContentItem, ContentStatus, Section } from "@/lib/types";
import { saveItemAction } from "@/app/[section]/[slug]/actions";
import { deleteBlockAction } from "@/lib/actions";

const STATUS_OPTIONS: { value: ContentStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "validado", label: "Validado" },
];

export type ContentEditFormProps = {
  section: Section;
  item: ContentItem;
};

export function ContentEditForm({ section, item }: ContentEditFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(item.frontmatter.title);
  const [status, setStatus] = useState<ContentStatus>(item.frontmatter.status);
  const [tagsInput, setTagsInput] = useState(item.frontmatter.tags.join(", "));
  const [aiContext, setAiContext] = useState(item.frontmatter.aiContext ?? "");
  const [body, setBody] = useState(item.body);
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  function handleDelete() {
    startDeleteTransition(async () => {
      await deleteBlockAction(section, item.frontmatter.slug);
      router.push(`/${section}`);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to exclude it from restFrontmatter
    const { updatedAt, ...restFrontmatter } = item.frontmatter;

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    startTransition(async () => {
      const saved = await saveItemAction({
        section,
        slug: item.frontmatter.slug,
        frontmatter: {
          ...restFrontmatter,
          title,
          status,
          tags,
          aiContext: aiContext.trim() ? aiContext.trim() : undefined,
        },
        body,
      });
      setLastSavedAt(saved.frontmatter.updatedAt);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ContentStatus)}
        >
          <SelectTrigger id="status" className="w-56">
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
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="oferta, pricing, proposta-de-valor"
        />
        <p className="text-xs text-muted-foreground">
          Separe as tags por vírgula.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="aiContext">Contexto para IA</Label>
        <Textarea
          id="aiContext"
          value={aiContext}
          onChange={(e) => setAiContext(e.target.value)}
          rows={3}
          placeholder="Instrução curta para orientar agentes de IA sobre este documento."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="body">Conteúdo</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={16}
          className="min-h-64 font-mono text-sm"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
        <Link
          href={`/${section}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Voltar
        </Link>
        {lastSavedAt && !isPending && (
          <span className="text-xs text-muted-foreground">
            Salvo às{" "}
            {new Intl.DateTimeFormat("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).format(new Date(lastSavedAt))}
          </span>
        )}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                className="ml-auto text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              />
            }
          >
            <Trash2 className="size-4" />
            Excluir bloco
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir &ldquo;{title}&rdquo;?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação remove o arquivo de conteúdo permanentemente e não pode ser
                desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </form>
  );
}
