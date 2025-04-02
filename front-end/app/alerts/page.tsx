"use client"

import { useState } from "react"
import { Bell, Calendar, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const anniversaryAlerts = [
  {
    id: 1,
    name: "John Smith",
    department: "Engineering",
    milestone: "5 years",
    date: "2023-05-12",
    daysAway: 0,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    department: "Marketing",
    milestone: "1 year",
    date: "2023-05-15",
    daysAway: 3,
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Finance",
    milestone: "10 years",
    date: "2023-05-20",
    daysAway: 8,
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Human Resources",
    milestone: "1 year",
    date: "2023-06-01",
    daysAway: 20,
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Engineering",
    milestone: "5 years",
    date: "2023-06-05",
    daysAway: 24,
  },
]

const leaveAlerts = [
  {
    id: 1,
    name: "John Smith",
    department: "Engineering",
    leaveType: "Sick Leave",
    daysUsed: 8,
    daysAllowed: 10,
    status: "Warning",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    department: "Marketing",
    leaveType: "Vacation",
    daysUsed: 15,
    daysAllowed: 15,
    status: "Exceeded",
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Finance",
    leaveType: "Sick Leave",
    daysUsed: 12,
    daysAllowed: 10,
    status: "Exceeded",
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Human Resources",
    leaveType: "Vacation",
    daysUsed: 12,
    daysAllowed: 15,
    status: "Normal",
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Engineering",
    leaveType: "Vacation",
    daysUsed: 14,
    daysAllowed: 15,
    status: "Warning",
  },
]

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAnniversaries = anniversaryAlerts.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.milestone.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredLeaves = leaveAlerts.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.leaveType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Smart Alerts</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Configure Alerts
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search alerts..."
            className="pl-8 w-[250px] sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <Tabs defaultValue="anniversaries">
        <TabsList>
          <TabsTrigger value="anniversaries">Work Anniversaries</TabsTrigger>
          <TabsTrigger value="leave">Leave Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="anniversaries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Work Anniversaries</CardTitle>
              <CardDescription>Employees reaching 1-year, 5-year, or 10-year milestones.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAnniversaries.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No upcoming anniversaries found.</div>
                ) : (
                  filteredAnniversaries.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{alert.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.department} • {alert.milestone} milestone
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <div>{alert.date}</div>
                          <div className="text-muted-foreground">
                            {alert.daysAway === 0 ? "Today" : `${alert.daysAway} days away`}
                          </div>
                        </div>
                        <Badge
                          variant={alert.daysAway === 0 ? "default" : alert.daysAway <= 7 ? "secondary" : "outline"}
                        >
                          {alert.daysAway === 0 ? "Today" : alert.daysAway <= 7 ? "Soon" : "Upcoming"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Alerts</CardTitle>
              <CardDescription>Employees approaching or exceeding their allowed leave days.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLeaves.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No leave alerts found.</div>
                ) : (
                  filteredLeaves.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "rounded-full p-2",
                            alert.status === "Exceeded"
                              ? "bg-red-100"
                              : alert.status === "Warning"
                                ? "bg-yellow-100"
                                : "bg-green-100",
                          )}
                        >
                          <User
                            className={cn(
                              "h-5 w-5",
                              alert.status === "Exceeded"
                                ? "text-red-600"
                                : alert.status === "Warning"
                                  ? "text-yellow-600"
                                  : "text-green-600",
                            )}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{alert.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.department} • {alert.leaveType}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-right">
                          <div>
                            {alert.daysUsed} / {alert.daysAllowed} days used
                          </div>
                          <div className="text-muted-foreground">
                            {alert.daysAllowed - alert.daysUsed} days remaining
                          </div>
                        </div>
                        <Badge
                          variant={
                            alert.status === "Exceeded"
                              ? "destructive"
                              : alert.status === "Warning"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

