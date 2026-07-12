"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { deleteBlockAction } from "@/lib/actions";
import type { ContentStatus, Section } from "@/lib/types";

const statusLabels: Record<ContentStatus, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
};

const statusStyles: Record<ContentStatus, string> = {
  rascunho: "bg-muted text-muted-foreground",
  "em-andamento":
    "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
  validado: "bg-accent-orange text-accent-orange-foreground",
};

const statusDotStyles: Record<ContentStatus, string> = {
  rascunho: "bg-muted-foreground/50",
  "em-andamento": "bg-amber-500 dark:bg-amber-300",
  validado: "bg-accent-orange-foreground/70",
};

export type ContentCardProps = {
  title: string;
  status?: ContentStatus;
  updatedAt?: string | Date;
  excerpt?: string;
  tags?: string[];
  /** When provided, the whole card navigates to this route. */
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Render as a stacked list row instead of a grid card. */
  layout?: "grid" | "list";
  /** When provided together with `slug`, renders a delete affordance on the card. */
  section?: Section;
  slug?: string;
};

function formatUpdatedAt(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ContentCard({
  title,
  status,
  updatedAt,
  excerpt,
  tags,
  href,
  onClick,
  className,
  layout = "grid",
  section,
  slug,
}: ContentCardProps) {
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();
  const formattedDate = updatedAt ? formatUpdatedAt(updatedAt) : undefined;
  const isInteractive = Boolean(href) || Boolean(onClick);
  const canDelete = Boolean(section) && Boolean(slug);

  function handleDelete() {
    if (!section || !slug) return;
    startDeleteTransition(async () => {
      await deleteBlockAction(section, slug);
      router.refresh();
    });
  }

  const card = (
    <Card
      role={isInteractive && !href ? "button" : undefined}
      tabIndex={isInteractive && !href ? 0 : undefined}
      onClick={!href ? onClick : undefined}
      onKeyDown={
        !href && onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        isInteractive &&
          "group cursor-pointer gap-3 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:ring-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !isInteractive && "gap-3",
        layout === "list" && "flex-row items-center gap-4 py-4",
        className
      )}
    >
      <CardHeader className={cn(layout === "list" && "flex-1 gap-1")}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {status && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 gap-1.5 border-transparent px-2.5 font-medium",
                statusStyles[status]
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  statusDotStyles[status]
                )}
                aria-hidden
              />
              {statusLabels[status]}
            </Badge>
          )}
        </div>
        {excerpt && (
          <CardDescription className="line-clamp-2">{excerpt}</CardDescription>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardHeader>
      {formattedDate && (
        <CardFooter
          className={cn(
            "text-xs text-muted-foreground",
            layout === "list" && "shrink-0 pt-0"
          )}
        >
          Atualizado em {formattedDate}
        </CardFooter>
      )}
    </Card>
  );

  return (
    <div className="group/card relative">
      {href ? (
        <Link
          href={href}
          className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {card}
        </Link>
      ) : (
        card
      )}
      {canDelete && (
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="outline"
                size="icon"
                aria-label={`Excluir ${title}`}
                className="absolute -top-2 -right-2 size-7 rounded-full border-border bg-background text-muted-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover/card:opacity-100 hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100"
                onClick={(event: React.MouseEvent) => event.stopPropagation()}
              />
            }
          >
            <Trash2 className="size-3.5" />
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(event) => event.stopPropagation()}>
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
      )}
    </div>
  );
}
