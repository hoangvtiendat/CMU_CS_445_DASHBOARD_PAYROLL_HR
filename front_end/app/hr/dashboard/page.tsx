"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { Users, Building2, BellRing } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { dashboardApi, alertApi, departmentApi, employeeApi } from "@/lib/api"
import type { EmployeeStats, Alert, Department } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"

// Colors for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function HRDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<EmployeeStats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [department, setCountDepartment] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {

        //Fetch total number department
        const departmentResponsive = await departmentApi.getCount();

        if (!departmentResponsive.success || !departmentResponsive.data) {
          throw new Error(departmentResponsive.error || "Failed to fetch alerts")
        }

        setCountDepartment(Number(departmentResponsive.data?.data) || 0);


        // Fetch employee stats
        const statsResponse = await employeeApi.status()
        if (!statsResponse.success || !statsResponse.data) {
          throw new Error(statsResponse.error || "Failed to fetch employee statistics")
        }
        setStats(statsResponse.data.data)
        // Fetch alerts
        const alertsResponse = await alertApi.getAll()
        if (!alertsResponse.success || !alertsResponse.data) {
          throw new Error(alertsResponse.error || "Failed to fetch alerts")
        }
        setAlerts(alertsResponse.data?.data || [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        // setStats({
        //   totalEmployees: 100,
        //   employeesByDepartment: [
        //     { name: "Engineering", value: 45 },
        //     { name: "Marketing", value: 20 },
        //     { name: "Sales", value: 25 },
        //     { name: "HR", value: 10 },
        //   ],
        //   employeesByPosition: [
        //     { name: "Developer", value: 35 },
        //     { name: "Manager", value: 15 },
        //     { name: "Designer", value: 10 },
        //     { name: "Analyst", value: 20 },
        //     { name: "Other", value: 20 },
        //   ],
        //   employeesByStatus: [
        //     { name: "Active", count: 85 },
        //     { name: "On Leave", count: 10 },
        //     { name: "Probation", count: 5 },
        //   ],
        // })

        setAlerts([
          {
            id: 1,
            type: "Anniversary",
            message: "Jane Smith's 5-year work anniversary is coming up next week.",
            date: "2023-07-15",
            priority: "medium",
          },
          {
            id: 2,
            type: "Leave",
            message: "John Doe has taken more than 2 days of leave this month.",
            date: "2023-07-10",
            priority: "high",
          },
          {
            id: 3,
            type: "Leave",
            message: "Sarah Johnson has requested 5 days of leave starting next Monday.",
            date: "2023-07-08",
            priority: "medium",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Use mock data if API data is not available
  const displayStats = stats || {
    totalEmployees: 0,
    totalDepartments: 0,
    employeesByDepartment: [
      { name: "Engineering", value: 45 },
      { name: "Marketing", value: 20 },
      { name: "Sales", value: 25 },
      { name: "HR", value: 10 },
    ],
    employeesByPosition: [],
    employeesByStatus: [],
  }


  return (
    <DashboardLayout role="hr" userName="HR Manager">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">HR Dashboard</h1>
          <p className="text-muted-foreground">Overview of employee statistics and alerts</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Total Employees"
            value={displayStats.totalEmployees}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Departments"
            value={department}
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Employees by Department</CardTitle>
              <CardDescription>Distribution of employees across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayStats.employeesByDepartment}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {displayStats.employeesByDepartment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip

                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employees by Position</CardTitle>
              <CardDescription>Distribution of employees across positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={displayStats.employeesByPosition}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {displayStats.employeesByPosition.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Status</CardTitle>
            <CardDescription>Distribution of employees by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayStats.employeesByStatus}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip

                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div>
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription>Recent alerts that require attention</CardDescription>
            </div>
            <BellRing className="ml-auto h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{alert.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm">{alert.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No alerts at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

