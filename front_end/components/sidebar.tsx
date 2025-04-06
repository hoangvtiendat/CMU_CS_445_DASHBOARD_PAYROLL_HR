"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Users, BellRing, Wallet, UserCog, Home, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface SidebarProps {
  role: "employee" | "hr" | "payroll" | "admin"
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: `/${role}/dashboard`,
      active: pathname === `/${role}/dashboard`,
      roles: ["employee", "hr", "payroll", "admin"],
    },
    {
      label: "My Profile",
      icon: UserCog,
      href: "/employee/profile",
      active: pathname === "/employee/profile",
      roles: ["employee"],
    },
    {
      label: "Employees",
      icon: Users,
      href: "/hr/employees",
      active: pathname === "/hr/employees",
      roles: ["hr"],
    },
    {
      label: "Employees",
      icon: Users,
      href: "/admin/employees",
      active: pathname === "/admin/employees",
      roles: ["admin"],
    },
    {
      label: "Smart Alerts",
      icon: BellRing,
      href: "/hr/alerts",
      active: pathname === "/hr/alerts",
      roles: ["hr"],
    },
    {
      label: "Smart Alerts",
      icon: BellRing,
      href: "/admin/alerts",
      active: pathname === "/admin/alerts",
      roles: ["admin"],
    },
    {
      label: "Payroll",
      icon: Wallet,
      href: "/payroll/salary",
      active: pathname === "/payroll/salary",
      roles: ["payroll"],
    },
    {
      label: "Payroll",
      icon: Wallet,
      href: "/admin/salary",
      active: pathname === "/admin/salary",
      roles: ["admin"],
    },
    {
      label: "Account Management",
      icon: UserCog,
      href: "/admin/accounts",
      active: pathname === "/admin/accounts",
      roles: ["admin"],
    },
  ]

  const filteredRoutes = routes.filter((route) => route.roles.includes(role))

  const SidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b border-business-dark/10 px-4 bg-business-primary">
        <Link href={`/${role}/dashboard`} className="flex items-center gap-2 font-semibold text-white">
          <BarChart3 className="h-6 w-6" />
          <span>HR & Payroll</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 px-2 bg-business-dark">
        <div className="space-y-1 py-2">
          {filteredRoutes.map((route) => (
            <Button
              key={route.href}
              variant={route.active ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                route.active
                  ? "bg-business-primary text-white hover:bg-business-highlight"
                  : "text-gray-300 hover:bg-business-primary/80 hover:text-white",
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )

  if (isMobile) {
    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40 bg-white">
              <Menu className="h-5 w-5 text-business-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-business-dark">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </>
    )
  }

  return <div className="hidden border-r bg-business-dark md:block md:w-64">{SidebarContent}</div>
}

