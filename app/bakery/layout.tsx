import { BakeryShell } from "@/components/bakery/bakery-shell"

export default function BakeryLayout({ children }: { children: React.ReactNode }) {
  return <BakeryShell>{children}</BakeryShell>
}
