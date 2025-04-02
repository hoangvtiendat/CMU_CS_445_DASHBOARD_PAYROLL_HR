"use client"

import { Calendar, User } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function RecentAlerts() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-sm font-medium">Work Anniversaries</div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">John Smith (Engineering) - 5 years</p>
              <p className="text-sm text-muted-foreground">Today</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Sarah Johnson (Marketing) - 1 year</p>
              <p className="text-sm text-muted-foreground">In 3 days</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-1">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Michael Brown (Finance) - 10 years</p>
              <p className="text-sm text-muted-foreground">In 8 days</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" asChild>
            <Link href="/alerts">View all anniversaries</Link>
          </Button>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium">Leave Alerts</div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <div className={cn("mr-4 rounded-full p-1", "bg-red-100")}>
              <User className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Sarah Johnson (Marketing) - Vacation</p>
              <p className="text-sm text-muted-foreground">15/15 days used (Exceeded)</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={cn("mr-4 rounded-full p-1", "bg-red-100")}>
              <User className="h-4 w-4 text-red-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">Michael Brown (Finance) - Sick Leave</p>
              <p className="text-sm text-muted-foreground">12/10 days used (Exceeded)</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={cn("mr-4 rounded-full p-1", "bg-yellow-100")}>
              <User className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">John Smith (Engineering) - Sick Leave</p>
              <p className="text-sm text-muted-foreground">8/10 days used (Warning)</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-right">
          <Button variant="link" size="sm" asChild>
            <Link href="/alerts">View all leave alerts</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

