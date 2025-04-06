"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/data-table"
import { StatCard } from "@/components/stat-card"
import { Wallet, Calendar, TrendingUp } from "lucide-react"
import { employeeApi, salaryApi } from "@/lib/api"
import type { Employee, Salary } from "@/lib/api-types"
import { useToast } from "@/components/ui/use-toast"

// Column definitions for the salary table
const columns = [
  {
    accessorKey: "month",
    header: "Month",
  },
  {
    accessorKey: "baseSalary",
    header: "Base Salary",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("baseSalary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "bonus",
    header: "Bonus",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("bonus"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "deductions",
    header: "Deductions",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("deductions"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "netSalary",
    header: "Net Salary",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("netSalary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "actualSalary",
    header: "Actual Salary Received",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("actualSalary"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
]

export default function EmployeeDashboard() {
  const { toast } = useToast()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [salaryData, setSalaryData] = useState<Salary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would get the current user's ID from the auth context
        const employeeId = 1 // Mock employee ID

        // Fetch employee data
        const employeeResponse = await employeeApi.getById(employeeId)
        if (!employeeResponse.success || !employeeResponse.data) {
          throw new Error(employeeResponse.error || "Failed to fetch employee data")
        }
        setEmployee(employeeResponse.data)

        // Fetch salary data
        const salaryResponse = await salaryApi.getByEmployeeId(employeeId)
        if (!salaryResponse.success || !salaryResponse.data) {
          throw new Error(salaryResponse.error || "Failed to fetch salary data")
        }
        setSalaryData(salaryResponse.data)
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

  // Mock data for now - in a real app, this would come from the API
  const employeeData = {
    name: employee?.fullName || "John Doe",
    role: "Software Developer",
    department: employee?.department || "Engineering",
    baseSalary: "$5,500.00",
    ytdEarnings: "$33,080.00",
    lastPayment: "$5,280.00",
  }

  // Mock salary data if API call fails
  const mockSalaryData = [
    {
      id: 1,
      month: "January 2023",
      baseSalary: 5000,
      bonus: 500,
      deductions: 200,
      netSalary: 5300,
      actualSalary: 5300,
    },
    {
      id: 2,
      month: "February 2023",
      baseSalary: 5000,
      bonus: 0,
      deductions: 200,
      netSalary: 4800,
      actualSalary: 4800,
    },
    {
      id: 3,
      month: "March 2023",
      baseSalary: 5000,
      bonus: 1000,
      deductions: 200,
      netSalary: 5800,
      actualSalary: 5800,
    },
    {
      id: 4,
      month: "April 2023",
      baseSalary: 5000,
      bonus: 300,
      deductions: 200,
      netSalary: 5100,
      actualSalary: 5100,
    },
    {
      id: 5,
      month: "May 2023",
      baseSalary: 5000,
      bonus: 0,
      deductions: 200,
      netSalary: 4800,
      actualSalary: 4800,
    },
    {
      id: 6,
      month: "June 2023",
      baseSalary: 5500,
      bonus: 0,
      deductions: 220,
      netSalary: 5280,
      actualSalary: 5280,
    },
  ]

  const displaySalaryData = salaryData.length > 0 ? salaryData : mockSalaryData

  return (
    <DashboardLayout role="employee" userName={employeeData.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-business-dark">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {employeeData.name}</p>
        </div>

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
            description="June 2023"
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
                  data={displaySalaryData}
                  searchColumn="month"
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
                    <p className="text-muted-foreground">{employee?.fullName || "John Doe"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Date of Birth</h3>
                    <p className="text-muted-foreground">{employee?.dateOfBirth || "15 May 1985"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Gender</h3>
                    <p className="text-muted-foreground">{employee?.gender || "Male"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Phone Number</h3>
                    <p className="text-muted-foreground">{employee?.phoneNumber || "+1 (555) 123-4567"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Email</h3>
                    <p className="text-muted-foreground">{employee?.email || "john.doe@example.com"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Hire Date</h3>
                    <p className="text-muted-foreground">{employee?.hireDate || "10 Jan 2020"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Department</h3>
                    <p className="text-muted-foreground">{employee?.department || "Engineering"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Position</h3>
                    <p className="text-muted-foreground">{employee?.position || "Software Developer"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-business-dark">Status</h3>
                    <p className="text-muted-foreground">{employee?.status || "Active"}</p>
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

