import * as React from "react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

type StatCardTone = "light" | "dark" | "moss"

const toneStyles: Record<
  StatCardTone,
  { card: string; chip: string; badge: "accent" | "accentMoss"; label: string }
> = {
  light: {
    card: "",
    chip: "bg-muted text-foreground",
    badge: "accent",
    label: "text-muted-foreground",
  },
  dark: {
    card: "bg-surface-dark text-surface-dark-foreground ring-transparent",
    chip: "bg-surface-dark-muted text-surface-dark-foreground",
    badge: "accent",
    label: "text-surface-dark-foreground/60",
  },
  moss: {
    card: "bg-accent-moss text-accent-moss-foreground ring-transparent",
    chip: "bg-accent-moss-foreground/10 text-accent-moss-foreground",
    badge: "accentMoss",
    label: "text-accent-moss-foreground/70",
  },
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  tone = "light",
  className,
  children,
  ...props
}: React.ComponentProps<typeof Card> & {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
  unit?: string
  trend?: string
  tone?: StatCardTone
}) {
  const styles = toneStyles[tone]

  return (
    <Card
      data-slot="stat-card"
      className={cn("gap-4", styles.card, className)}
      {...props}
    >
      <div className="flex items-start justify-between gap-2 px-(--card-spacing)">
        {Icon ? (
          <span
            className={cn(
              "flex size-10 items-center justify-center rounded-full [&_svg]:size-5",
              styles.chip
            )}
          >
            <Icon className="size-5" />
          </span>
        ) : (
          <span />
        )}
        {trend ? (
          <Badge variant={tone === "moss" ? "default" : styles.badge}>
            {trend}
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-col gap-1 px-(--card-spacing)">
        <span
          className={cn("text-xs font-medium tracking-wide", styles.label)}
        >
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-3xl leading-none font-semibold tracking-tight">
            {value}
          </span>
          {unit ? (
            <span className={cn("text-sm font-medium", styles.label)}>
              {unit}
            </span>
          ) : null}
        </div>
        {children}
      </div>
    </Card>
  )
}

export { StatCard }
