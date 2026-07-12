"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ViewMode = "grid" | "list";

export type ViewToggleProps = {
  value: ViewMode;
  onValueChange: (value: ViewMode) => void;
  className?: string;
};

export function ViewToggle({ value, onValueChange, className }: ViewToggleProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as ViewMode)}
    >
      <SelectTrigger
        className={cn("rounded-full px-3.5", className)}
        aria-label="Modo de visualização"
      >
        <SelectValue placeholder="Visualização" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="grid">Grade</SelectItem>
        <SelectItem value="list">Lista</SelectItem>
      </SelectContent>
    </Select>
  );
}
