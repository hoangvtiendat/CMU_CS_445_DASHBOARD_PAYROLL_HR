import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  description?: string
  className?: string
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
}

export function StatCard({ title, value, icon, description, className, variant = "primary" }: StatCardProps) {
  const borderColorClass = {
    primary: "border-l-business-primary",
    secondary: "border-l-business-secondary",
    success: "border-l-business-success",
    warning: "border-l-business-warning",
    danger: "border-l-business-danger",
  }[variant]

  const iconColorClass = {
    primary: "text-business-primary",
    secondary: "text-business-secondary",
    success: "text-business-success",
    warning: "text-business-warning",
    danger: "text-business-danger",
  }[variant]

  return (
    <Card className={cn(`business-stat-card ${borderColorClass}`, className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={iconColorClass}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

