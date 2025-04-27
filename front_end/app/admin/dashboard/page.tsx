"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/stat-card"
import { Users, Building2, BellRing } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { dashboardApi, alertApi } from "@/lib/api"
import type { EmployeeStats, PayrollStats, Alert } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57", "#8dd1e1"];

export default function AdminDashboard() {
  const { toast } = useToast()
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null)
  const [payrollStats, setPayrollStats] = useState<PayrollStats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<EmployeeStats | null>(null)
  const router = useRouter()

  useEffect(() => {
    // const token = localStorage.getItem("token")  // Lấy token từ localStorage
    // const role = localStorage.getItem("role")  // Lấy role từ localStorage (nếu đã lưu)

    // if (!token || role !== "Admin") {
    //   router.push("/login")  // Nếu không có token hoặc role không phải Admin, chuyển hướng về trang login
    //   return
    // }
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch employee stats
        const employeeStatsResponse = await dashboardApi.getEmployeeStats()
        if (!employeeStatsResponse.success || !employeeStatsResponse.data) {
          throw new Error(employeeStatsResponse.error || "Failed to fetch employee statistics")
        }
        setEmployeeStats(employeeStatsResponse.data.data)

        // Fetch payroll stats
        const payrollStatsResponse = await dashboardApi.getPayrollStats()
        if (!payrollStatsResponse.success || !payrollStatsResponse.data) {
          throw new Error(payrollStatsResponse.error || "Failed to fetch payroll statistics")
        }
        setPayrollStats(payrollStatsResponse.data.data)

        // Fetch alerts
        const alertsResponse = await alertApi.getAll()
        if (!alertsResponse.success || !alertsResponse.data) {
          throw new Error(alertsResponse.error || "Failed to fetch alerts")
        }
        setAlerts(alertsResponse.data.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        setEmployeeStats({
          totalEmployees: 100,
          totalDepartments: 4,
          employeesByDepartment: [ 
            { name: "Engineering", value: 45 },
            { name: "Marketing", value: 20 },
            { name: "Sales", value: 25 },
            { name: "HR", value: 10 },
          ],
          employeesByPosition: [
            { name: "Developer", value: 35 },
            { name: "Manager", value: 15 },
            { name: "Designer", value: 10 },
            { name: "Analyst", value: 20 },
            { name: "Other", value: 20 },
          ],
          employeesByStatus: [
            { name: "Active", count: 85 },
            { name: "On Leave", count: 10 },
            { name: "Probation", count: 5 },
          ],
        })

        setPayrollStats({
          totalMonthlyPayroll: 767000,
          averageSalary: 7670,
          monthlySalaryByDepartment: [
            {
              name: "Jan",
              Engineering: 250000,
              Marketing: 120000,
              Sales: 180000,
              HR: 80000,
            },
            {
              name: "Feb",
              Engineering: 260000,
              Marketing: 125000,
              Sales: 190000,
              HR: 82000,
            },
            {
              name: "Mar",
              Engineering: 270000,
              Marketing: 130000,
              Sales: 200000,
              HR: 85000,
            },
            {
              name: "Apr",
              Engineering: 280000,
              Marketing: 135000,
              Sales: 210000,
              HR: 87000,
            },
            {
              name: "May",
              Engineering: 290000,
              Marketing: 140000,
              Sales: 220000,
              HR: 90000,
            },
            {
              name: "Jun",
              Engineering: 300000,
              Marketing: 145000,
              Sales: 230000,
              HR: 92000,
            },
          ],
        })

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
  const displayEmployeeStats = employeeStats || {
    totalEmployees: 100,
    totalDepartments: 4,
  }

  const displayPayrollStats = payrollStats || {
    monthlySalaryByDepartment: [],
  }

  const displayStats = stats || {
    totalEmployees: 0,
    totalDepartments: 0,
    employeesByDepartment: [
      { name: "Engineering", value: 45 },
      { name: "Marketing", value: 20 },
      { name: "Sales", value: 25 },
      { name: "HR", value: 10 },
    ],
    employeesByPosition: [
      { name: "ADMIN", value: 39 },
      { name: "EMPLOYEE", value: 20 },
      { name: "SALE", value: 15 },
      { name: "HR", value: 10 },],
    employeesByStatus: [],
  }

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the entire HR & Payroll system</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Total Employees"
            value={displayEmployeeStats.totalEmployees}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <StatCard
            title="Total Departments"
            value={displayEmployeeStats.totalDepartments}
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Salary by Department</CardTitle>
            <CardDescription>Total salary expenditure by department over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayPayrollStats.monthlySalaryByDepartment}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        minimumFractionDigits: 0,
                      }).format(value as number)
                    }
                  />
                  <Legend />
                  <Bar dataKey="Engineering" fill="#8884d8" />
                  <Bar dataKey="Marketing" fill="#82ca9d" />
                  <Bar dataKey="Sales" fill="#ffc658" />
                  <Bar dataKey="HR" fill="#ff8042" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

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

