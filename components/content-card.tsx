import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ContentStatus } from "@/lib/types";

const statusLabels: Record<ContentStatus, string> = {
  rascunho: "Rascunho",
  "em-andamento": "Em andamento",
  validado: "Validado",
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
}: ContentCardProps) {
  const formattedDate = updatedAt ? formatUpdatedAt(updatedAt) : undefined;
  const isInteractive = Boolean(href) || Boolean(onClick);

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
          "group cursor-pointer gap-3 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        !isInteractive && "gap-3",
        layout === "list" && "flex-row items-center gap-4 py-4",
        className
      )}
    >
      <CardHeader className={cn(layout === "list" && "flex-1 gap-1")}>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {status && (
            <Badge variant="secondary" className="shrink-0 font-normal">
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
                className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground"
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

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {card}
      </Link>
    );
  }

  return card;
}
