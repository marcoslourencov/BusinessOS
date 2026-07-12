"use client";

import { cn } from "@/lib/utils";
import { ContentCard, type ContentCardProps } from "@/components/content-card";
import type { ViewMode } from "@/components/view-toggle";

export type ContentGridItem = Omit<ContentCardProps, "layout" | "className"> & {
  /** Stable key for React lists; falls back to title if omitted. */
  id?: string;
  /** Optional visual grouping label (e.g. "Editorias"). Consecutive items sharing the same group render under one heading. */
  group?: string;
};

export type ContentGridProps = {
  items: ContentGridItem[];
  view: ViewMode;
  emptyMessage?: string;
  className?: string;
};

function itemsGridClassName(view: ViewMode) {
  return view === "grid"
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    : "flex flex-col gap-3";
}

export function ContentGrid({
  items,
  view,
  emptyMessage = "Nenhum item ainda.",
  className,
}: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Agrupa itens consecutivos que compartilham o mesmo `group`, preservando a
  // ordem original. Itens sem `group` formam um bloco próprio sem cabeçalho.
  const chunks: { group?: string; items: ContentGridItem[] }[] = [];
  for (const item of items) {
    const last = chunks[chunks.length - 1];
    if (last && last.group === item.group) {
      last.items.push(item);
    } else {
      chunks.push({ group: item.group, items: [item] });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {chunks.map((chunk, index) => (
        <div key={chunk.group ?? `ungrouped-${index}`} className="flex flex-col gap-3">
          {chunk.group && (
            <h2 className="flex items-center gap-2 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              <span
                className="size-2 rounded-full bg-accent-orange"
                aria-hidden
              />
              {chunk.group}
            </h2>
          )}
          <div className={itemsGridClassName(view)}>
            {chunk.items.map((item) => (
              <ContentCard
                key={item.id ?? item.title}
                layout={view === "grid" ? "grid" : "list"}
                {...item}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
