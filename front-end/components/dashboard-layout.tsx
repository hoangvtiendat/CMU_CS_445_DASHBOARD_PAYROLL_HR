"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart4,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Menu,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <Sidebar>
            <SidebarHeader>
              <div className="flex h-14 items-center px-4">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                  <BarChart4 className="h-6 w-6" />
                  <span>HR & Payroll</span>
                </Link>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/"}>
                        <Link href="/">
                          <Home className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/employees"}>
                        <Link href="/employees">
                          <Users className="h-4 w-4" />
                          <span>Employees</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/payroll"}>
                        <Link href="/payroll">
                          <CreditCard className="h-4 w-4" />
                          <span>Payroll</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/reports"}>
                        <Link href="/reports">
                          <FileText className="h-4 w-4" />
                          <span>Reports</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild isActive={pathname === "/alerts"}>
                        <Link href="/alerts">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Smart Alerts</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel>Settings</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="#">
                          <Settings className="h-4 w-4" />
                          <span>General</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="#">
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="#">
                          <Calendar className="h-4 w-4" />
                          <span>Calendar</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <User className="h-4 w-4" />
                      <span>Admin User</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
        </div>
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0 sm:max-w-xs">
                <div className="flex h-14 items-center px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
                    <BarChart4 className="h-6 w-6" />
                    <span>HR & Payroll</span>
                  </Link>
                </div>
                <div className="grid gap-2 py-4">
                  <div className="px-4 py-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                      />
                    </div>
                  </div>
                  <div className="px-4 py-2">
                    <Link
                      href="/"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                        pathname === "/" ? "bg-muted" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <Home className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </div>
                  <div className="px-4 py-2">
                    <Link
                      href="/employees"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                        pathname === "/employees" ? "bg-muted" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      Employees
                    </Link>
                  </div>
                  <div className="px-4 py-2">
                    <Link
                      href="/payroll"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                        pathname === "/payroll" ? "bg-muted" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <CreditCard className="h-4 w-4" />
                      Payroll
                    </Link>
                  </div>
                  <div className="px-4 py-2">
                    <Link
                      href="/reports"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                        pathname === "/reports" ? "bg-muted" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Reports
                    </Link>
                  </div>
                  <div className="px-4 py-2">
                    <Link
                      href="/alerts"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                        pathname === "/alerts" ? "bg-muted" : "transparent",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Smart Alerts
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="w-full flex-1">
              <form>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </form>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Avatar"
                className="rounded-full"
                height={32}
                width={32}
              />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

