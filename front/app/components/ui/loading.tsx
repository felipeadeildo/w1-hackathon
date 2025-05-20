import { Grid } from "ldrs/react"
import "ldrs/react/Grid.css"
import { cn } from "~/lib/utils"

export interface LoadingProps {
  className?: string
  label?: string
  labelPosition?: "top" | "bottom" | "left" | "right"
  labelClassName?: string
  size?: number | string
  speed?: number | string
}

export const Loading = ({
  className,
  label,
  labelPosition = "bottom",
  labelClassName,
  size = 40,
  speed = 1.2,
  ...props
}: LoadingProps) => {
  const classNames = cn(
    "flex items-center justify-center gap-2",
    labelPosition === "top" && "flex-col-reverse",
    labelPosition === "bottom" && "flex-col",
    labelPosition === "left" && "flex-row-reverse",
    labelPosition === "right" && "flex-row",
    className
  )

  return (
    <div className={classNames} {...props}>
      <Grid size={size} color="black" speed={speed} />
      {label && (
        <span className={cn("text-sm font-medium", labelClassName)}>
          {label}
        </span>
      )}
    </div>
  )
}