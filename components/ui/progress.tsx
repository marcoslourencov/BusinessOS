import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  value = 0,
  label,
  showValue = false,
  indicatorClassName,
  className,
  ...props
}: Omit<ProgressPrimitive.Root.Props, "value"> & {
  value?: number | null
  label?: React.ReactNode
  showValue?: boolean
  indicatorClassName?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-muted-foreground">
          {label ? (
            <ProgressPrimitive.Label data-slot="progress-label">
              {label}
            </ProgressPrimitive.Label>
          ) : (
            <span />
          )}
          {showValue && (
            <ProgressPrimitive.Value
              data-slot="progress-value"
              className="tabular-nums text-foreground"
            />
          )}
        </div>
      )}
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className={cn(
            "h-full rounded-full bg-primary transition-all duration-300 ease-out",
            indicatorClassName
          )}
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  )
}

export { Progress }
