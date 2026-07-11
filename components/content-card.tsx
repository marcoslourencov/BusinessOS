import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ContentStatus =
  | "draft"
  | "in-progress"
  | "review"
  | "done"
  | "blocked";

const statusLabels: Record<ContentStatus, string> = {
  draft: "Rascunho",
  "in-progress": "Em andamento",
  review: "Em revisão",
  done: "Concluído",
  blocked: "Bloqueado",
};

export type ContentCardProps = {
  title: string;
  status?: ContentStatus;
  updatedAt?: string | Date;
  excerpt?: string;
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
  onClick,
  className,
  layout = "grid",
}: ContentCardProps) {
  const formattedDate = updatedAt ? formatUpdatedAt(updatedAt) : undefined;

  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        "group cursor-pointer gap-3 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
}
