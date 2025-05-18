"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BellRing, Calendar, AlertTriangle } from "lucide-react"
import { alertApi } from "@/lib/api"
import type { Alert } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"

export default function AlertsPage() {
  const { toast } = useToast()
  const [allAlerts, setAllAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true)

      try {
        // Fetch all alerts
        const alertsResponse = await alertApi.getAll()
        console.log("alertsResponse", alertsResponse.data.data)
        if (!alertsResponse.success || !alertsResponse.data) {
          throw new Error(alertsResponse.error || "Failed to fetch alerts")
        }
        if (alertsResponse?.data?.data) {
          setAllAlerts(alertsResponse.data.data);
        } else {
          setAllAlerts([]);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching alerts",
        })

        // Set mock data if API fails
        // setAllAlerts([
        //   {
        //     id: 1,
        //     type: "Anniversary",
        //     message: "Jane Smith's 5-year work anniversary is coming up next week.",
        //     date: "2023-07-15",
        //     priority: "medium",
        //   },
        //   {
        //     id: 2,
        //     type: "Leave",
        //     message: "John Doe has taken more than 2 days of leave this month.",
        //     date: "2023-07-10",
        //     priority: "high",
        //   },
        //   {
        //     id: 3,
        //     type: "Leave",
        //     message: "Sarah Johnson has requested 5 days of leave starting next Monday.",
        //     date: "2023-07-08",
        //     priority: "medium",
        //   },
        //   {
        //     id: 4,
        //     type: "Anniversary",
        //     message: "Robert Johnson's 3-year work anniversary is on July 20th.",
        //     date: "2023-07-20",
        //     priority: "medium",
        //   },
        //   {
        //     id: 5,
        //     type: "Leave",
        //     message: "Michael Wilson has been absent for 3 consecutive days without notice.",
        //     date: "2023-07-05",
        //     priority: "high",
        //   },
        // ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlerts()
  }, [toast])

  // Filter alerts by type
  const anniversaryAlerts = allAlerts.filter((alert) => alert.type === "Anniversary")
  const leaveAlerts = allAlerts.filter((alert) => alert.type === "Leave")

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Alerts</h1>
          <p className="text-muted-foreground">Monitor important employee events and notifications</p>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
            <TabsTrigger value="anniversary">Work Anniversaries</TabsTrigger>
            <TabsTrigger value="leave">Leave Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5" />
                  All Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allAlerts.length > 0 ? (
                    allAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{alert.type}</span>
                            <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>
                              {alert.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: alert.message }}></p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No alerts at this time.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="anniversary">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Work Anniversaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {anniversaryAlerts.length > 0 ? (
                    anniversaryAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{alert.type}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: alert.message }}></p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No anniversary alerts at this time.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leave">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Leave Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveAlerts.length > 0 ? (
                    leaveAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{alert.type}</span>
                            <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>
                              {alert.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(alert.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-1 text-sm" dangerouslySetInnerHTML={{ __html: alert.message }}></p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground">No leave alerts at this time.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

