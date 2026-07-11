"use client";

import { useState } from "react";
import { ViewToggle, type ViewMode } from "@/components/view-toggle";
import { ContentGrid, type ContentGridItem } from "@/components/content-grid";

export type SectionViewProps = {
  title: string;
  description?: string;
  items: ContentGridItem[];
};

export function SectionView({ title, description, items }: SectionViewProps) {
  const [view, setView] = useState<ViewMode>("grid");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <ViewToggle value={view} onValueChange={setView} className="w-36" />
      </div>
      <ContentGrid items={items} view={view} />
    </div>
  );
}
