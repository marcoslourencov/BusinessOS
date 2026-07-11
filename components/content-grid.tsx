"use client";

import { cn } from "@/lib/utils";
import { ContentCard, type ContentCardProps } from "@/components/content-card";
import type { ViewMode } from "@/components/view-toggle";

export type ContentGridItem = Omit<ContentCardProps, "layout" | "className"> & {
  /** Stable key for React lists; falls back to title if omitted. */
  id?: string;
};

export type ContentGridProps = {
  items: ContentGridItem[];
  view: ViewMode;
  emptyMessage?: string;
  className?: string;
};

export function ContentGrid({
  items,
  view,
  emptyMessage = "Nenhum item ainda.",
  className,
}: ContentGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-3",
        className
      )}
    >
      {items.map((item) => (
        <ContentCard
          key={item.id ?? item.title}
          layout={view === "grid" ? "grid" : "list"}
          {...item}
        />
      ))}
    </div>
  );
}
