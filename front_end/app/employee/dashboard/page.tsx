"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { StatCard } from "@/components/stat-card"
import { Wallet, Calendar, TrendingUp } from "lucide-react"
import { employeeApi, salaryApi } from "@/lib/api"
import type { Employee, Salary } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"
import { InformationEmployee } from "@/lib/api-types"
import { lastDayOfDecade } from "date-fns"
import { Plus, Trash2, UserCog } from "lucide-react"

// Column definitions for the salary table
const columns = [
  {
    accessorKey: "SalaryMonth",
    header: "Month",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const date = new Date(row.getValue("SalaryMonth"))
      const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return formatted
    },
  },
  {
    accessorKey: "BaseSalary",
    header: "Base Salary",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const amount = Number.parseFloat(row.getValue("BaseSalary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "Bonus",
    header: "Bonus",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const amount = Number.parseFloat(row.getValue("Bonus"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "Deductions",
    header: "Deductions",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const amount = Number.parseFloat(row.getValue("Deductions"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "NetSalary",
    header: "Net Salary",
    cell: ({ row }: { row: { getValue: (key: string) => string } }) => {
      const amount = Number.parseFloat(row.getValue("NetSalary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount)
      return formatted
    },
  },

]

export default function EmployeeDashboard() {
  const { toast } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [salaryData, setSalaryData] = useState<Salary[] | null>([])
  const [isLoading, setIsLoading] = useState(true)
  const [informationEmployee, setInformationEmployee] = useState<InformationEmployee | null>(null)
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    // Chỉ chạy trên client
    const id = Number(localStorage.getItem("employeeID"));
    setEmployeeId(id);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would get the current user's ID from the auth context
        const employeeId = Number(localStorage.getItem("employeeID")) // Retrieve employee ID from localStorage or use a default value

        //fetch information employee
        const informationEmployeeResponse = await employeeApi.getInformationEmployee(employeeId)
        if (!informationEmployeeResponse.success || !informationEmployeeResponse.data) {
          throw new Error(informationEmployeeResponse.error || "Failed to fetch employee data")
        }
        setInformationEmployee(informationEmployeeResponse.data.data)

        // Fetch employee data
        const employeeResponse = await employeeApi.getById(employeeId)
        if (!employeeResponse.success || !employeeResponse.data) {
          throw new Error(employeeResponse.error || "Failed to fetch employee data")
        }
        setEmployee(employeeResponse.data.data)



        // Fetch salary data
        const salaryResponse = await salaryApi.getByEmployeeId(employeeId)
        if (!salaryResponse.success || !salaryResponse.data) {
          throw new Error(salaryResponse.error || "Failed to fetch salary data")
        }

        setSalaryData(Array.isArray(salaryResponse.data?.data) ? salaryResponse.data.data : [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const employeeData = {
    name: employee?.FullName || "error fetch",
    role: informationEmployee?.role || "error fetch",
    department: informationEmployee?.department || "error fetch",
    baseSalary: informationEmployee?.baseSalary || 0,
    ytdEarnings: informationEmployee?.ytdEarnings || 0,
    lastPayment: informationEmployee?.lastPayment || 0,
    lastSalaryMonth: informationEmployee?.lastSalaryMonth || "error fetch",
  }


  useEffect(() => {
    // Chỉ chạy trên client
    const id = Number(localStorage.getItem("employeeID"));
    setEmployeeId(id);
  }, []);

  async function handleCheckIn() {
    setIsLoading(true)
    try {
      
      const id = Number(localStorage.getItem("employeeID"));
      const response = await employeeApi.checkin(id)

      if (!response.success) {
        throw new Error(response.error || "Failed to update profile")
      }

      toast({
        title: "Checkin",
        description: "You have successfully clocked in today.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const displaySalaryData = (salaryData ?? []).length > 0 ? salaryData ?? [] : null

  return (
    <DashboardLayout role="employee" userName={employeeData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-business-dark">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {employeeData.name}</p>
        </div>
        <Button onClick={() => handleCheckIn()}>
          Check In
        </Button>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Base Salary"
            value={employeeData.baseSalary}
            icon={<Wallet className="h-4 w-4" />}
            description="Your monthly base salary"
            variant="primary"
          />
          <StatCard
            title="YTD Earnings"
            value={employeeData.ytdEarnings}
            icon={<TrendingUp className="h-4 w-4" />}
            description="Year to date earnings"
            variant="secondary"
          />
          <StatCard
            title="Last Payment"
            value={employeeData.lastPayment}
            icon={<Calendar className="h-4 w-4" />}
            description={
              employeeData.lastSalaryMonth !== "error fetch"
                ? new Date(employeeData.lastSalaryMonth).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                })
                : "N/A"
            }
            variant="success"
          />
        </div>

        <Tabs defaultValue="salary" className="space-y-4">
          <TabsList className="bg-business-light">
            <TabsTrigger
              value="salary"
              className="data-[state=active]:bg-business-primary data-[state=active]:text-white"
            >
              Salary History
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-business-primary data-[state=active]:text-white"
            >
              Personal Information
            </TabsTrigger>
          </TabsList>
          <TabsContent value="salary" className="space-y-4">
            <Card className="business-card">
              <CardHeader className="bg-business-light/50">
                <CardTitle className="text-business-dark">Salary Records</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={displaySalaryData ?? []}
                  searchColumn="SalaryMonth"
                  searchPlaceholder="Search by month..."
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personal" className="space-y-4">
            <Card className="business-card">
              <CardHeader className="bg-business-light/50">
                <CardTitle className="text-business-dark">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium text-business-dark">Full Name</h3>
                    <p className="text-muted-foreground">{employee?.FullName || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Date of Birth</h3>
                    <p className="text-muted-foreground">{employee?.DateOfBirth || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Gender</h3>
                    <p className="text-muted-foreground">{employee?.Gender || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Phone Number</h3>
                    <p className="text-muted-foreground">{employee?.PhoneNumber || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Email</h3>
                    <p className="text-muted-foreground">{employee?.Email || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Hire Date</h3>
                    <p className="text-muted-foreground">{employee?.HireDate || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Department</h3>
                    <p className="text-muted-foreground">{employee?.Department.DepartmentName || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Position</h3>
                    <p className="text-muted-foreground">{employee?.Position.PositionName || "error fetch"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Status</h3>
                    <p className="text-muted-foreground">{employee?.Status || "error fetch"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </DashboardLayout>
  )
}

