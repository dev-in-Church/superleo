import { cn } from "@/lib/utils"

interface SuperleoWordmarkProps {
  className?: string
  animate?: boolean
}

export function SuperleoWordmark({ className, animate = true }: SuperleoWordmarkProps) {
  const letters = "Superleo".split("")
  return (
    <span className={cn("font-serif tracking-tight", className)} aria-label="Superleo">
      {letters.map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={animate ? "superleo-letter" : undefined}
          style={animate ? ({ "--delay": `${i * 0.08}s` } as React.CSSProperties) : undefined}
        >
          {letter}
        </span>
      ))}
    </span>
  )
}
