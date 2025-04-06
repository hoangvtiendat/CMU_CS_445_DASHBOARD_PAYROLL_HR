import type { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

interface DashboardLayoutProps {
  children: ReactNode
  role: "employee" | "hr" | "payroll" | "admin"
  userName: string
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Header userName={userName} role={role} />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

