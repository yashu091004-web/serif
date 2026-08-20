"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative w-full overflow-hidden", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="size-full overflow-hidden rounded-full bg-muted"
      />
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="absolute inset-y-0 left-0 h-full rounded-full bg-primary transition-[width] duration-300 data-indeterminate:w-1/3 data-indeterminate:animate-[progress-indeterminate_1.4s_ease-in-out_infinite]"
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }