"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { dashboardApi } from "@/lib/api"
import type { PayrollStats } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"
import { employeeApi } from "@/lib/api"
import type { EmployeeStats } from "@/lib/api-types"


export default function PayrollDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<PayrollStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statsEpl, setStatsEmpl] = useState<EmployeeStats | null>(null)



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch payroll stats
        const statsResponse = await dashboardApi.getPayrollStats()
        const eplResponse = await employeeApi.status()
        setStats(statsResponse.data.data)
        if (!statsResponse.success || !statsResponse.data.data) {
          throw new Error(statsResponse.error || "Failed to fetch payroll statistics")
        }

        setStatsEmpl(eplResponse.data.data)
        if (!statsResponse.success || !statsResponse.data.data) {
          throw new Error(statsResponse.error || "Failed to fetch number of employees")
        }
        console.log("statsResponse: ", statsResponse)

      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        // setStats({
        //   totalMonthlyPayroll: 767000,
        //   averageSalary: 7670,
        //   monthlySalaryByDepartment: [
        //     {
        //       name: "Jan",
        //       Engineering: 250000,
        //       Marketing: 120000,
        //       Sales: 180000,
        //       HR: 80000,
        //     },
        //     {
        //       name: "Feb",
        //       Engineering: 260000,
        //       Marketing: 125000,
        //       Sales: 190000,
        //       HR: 82000,
        //     },
        //     {
        //       name: "Mar",
        //       Engineering: 270000,
        //       Marketing: 130000,
        //       Sales: 200000,
        //       HR: 85000,
        //     },
        //     {
        //       name: "Apr",
        //       Engineering: 280000,
        //       Marketing: 135000,
        //       Sales: 210000,
        //       HR: 87000,
        //     },
        //     {
        //       name: "May",
        //       Engineering: 290000,
        //       Marketing: 140000,
        //       Sales: 220000,
        //       HR: 90000,
        //     },
        //     {
        //       name: "Jun",
        //       Engineering: 300000,
        //       Marketing: 145000,
        //       Sales: 230000,
        //       HR: 92000,
        //     },
        //   ],
        // })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Use mock data if API data is not available
  const displayStats = stats || {
    totalMonthlyPayroll: 767000,
    averageSalary: 7670,
    monthlySalaryByDepartment: [],
  }

  const employeeStatus = statsEpl

  return (
    <DashboardLayout role="payroll" userName="Payroll Manager">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Dashboard</h1>
          <p className="text-muted-foreground">Overview of salary data across departments</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Salary by Department</CardTitle>
            <CardDescription>
              Total salary expenditure by department over the last {displayStats.monthlySalaryByDepartment.length} months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={displayStats.monthlySalaryByDepartment}
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
                  <Legend
                    formatter={(value) =>
                      value === "TechnologyInformation"
                        ? "Technology Information"
                        : value
                    }
                  />
                  <Bar dataKey="Marketing" fill="#8884d8" />
                  <Bar dataKey="Sales" fill="#82ca9d" />
                  <Bar dataKey="TechnologyInformation" fill="#ffc658" name="Technology Information" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Total Monthly Payroll</CardTitle>
              <CardDescription>Total salary expenditure for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(displayStats.totalMonthlyPayroll)}
              </div>
              {/* <p className="text-sm text-muted-foreground"> +5.2% from last month</p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Salary</CardTitle>
              <CardDescription>Average salary across all departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(displayStats.averageSalary)}
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {employeeStatus?.totalEmployees|| 0} employees
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

