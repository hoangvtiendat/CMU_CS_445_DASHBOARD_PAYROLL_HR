"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash2 } from "lucide-react"
import { salaryApi, employeeApi } from "@/lib/api"
import type { Salary, Employee, CreateSalaryRequest, UpdateSalaryRequest } from "@/lib/api-types"

export default function SalaryPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState("June 2023")
  const [selectedMonthName, setSelectedMonthName] = useState("June")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [salaryData, setSalaryData] = useState<Salary[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSalaryId, setEditingSalaryId] = useState<number | null>(null)
  const [newSalary, setNewSalary] = useState<Partial<CreateSalaryRequest>>({
    employeeId: 0,
    baseSalary: 0,
    bonus: 0,
    deductions: 0,
    month: selectedMonth,
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Combine month and year for API call
        const monthYearString = `${selectedMonthName} ${selectedYear}`
        setSelectedMonth(monthYearString)

        // Fetch salary data for the selected month
        const salaryResponse = await salaryApi.getAll(monthYearString)
        if (!salaryResponse.success || !salaryResponse.data) {
          throw new Error(salaryResponse.error || "Failed to fetch salary data")
        }
        setSalaryData(salaryResponse.data)

        // Fetch employees for the dropdown
        const employeesResponse = await employeeApi.getAll()
        if (!employeesResponse.success || !employeesResponse.data) {
          throw new Error(employeesResponse.error || "Failed to fetch employees")
        }
        setEmployees(employeesResponse.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        setSalaryData([
          {
            id: 1,
            employeeId: 1,
            fullName: "John Doe",
            department: "Engineering",
            position: "Software Developer",
            baseSalary: 5000,
            bonus: 500,
            deductions: 200,
            netSalary: 5300,
            actualSalary: 5300,
            month: "June 2023",
          },
          {
            id: 2,
            employeeId: 2,
            fullName: "Jane Smith",
            department: "Marketing",
            position: "Marketing Manager",
            baseSalary: 6000,
            bonus: 800,
            deductions: 250,
            netSalary: 6550,
            actualSalary: 6550,
            month: "June 2023",
          },
          {
            id: 3,
            employeeId: 3,
            fullName: "Robert Johnson",
            department: "Sales",
            position: "Sales Representative",
            baseSalary: 4500,
            bonus: 1200,
            deductions: 180,
            netSalary: 5520,
            actualSalary: 5520,
            month: "June 2023",
          },
          {
            id: 4,
            employeeId: 4,
            fullName: "Emily Davis",
            department: "HR",
            position: "HR Specialist",
            baseSalary: 4800,
            bonus: 300,
            deductions: 190,
            netSalary: 4910,
            actualSalary: 4910,
            month: "June 2023",
          },
          {
            id: 5,
            fullName: "Michael Wilson",
            department: "Engineering",
            position: "QA Engineer",
            baseSalary: 4700,
            bonus: 400,
            deductions: 185,
            netSalary: 4915,
            actualSalary: 4915,
            month: "June 2023",
          },
        ])

        setEmployees([
          {
            id: 1,
            fullName: "John Doe",
            dateOfBirth: "1985-05-15",
            gender: "Male",
            phoneNumber: "+1 (555) 123-4567",
            email: "john.doe@example.com",
            hireDate: "2020-01-10",
            departmentId: 1,
            department: "Engineering",
            positionId: 1,
            position: "Software Developer",
            status: "Active",
          },
          {
            id: 2,
            fullName: "Jane Smith",
            dateOfBirth: "1990-08-22",
            gender: "Female",
            phoneNumber: "+1 (555) 987-6543",
            email: "jane.smith@example.com",
            hireDate: "2019-03-15",
            departmentId: 2,
            department: "Marketing",
            positionId: 3,
            position: "Marketing Manager",
            status: "Active",
          },
          {
            id: 3,
            fullName: "Robert Johnson",
            dateOfBirth: "1988-11-30",
            gender: "Male",
            phoneNumber: "+1 (555) 456-7890",
            email: "robert.johnson@example.com",
            hireDate: "2021-05-20",
            departmentId: 3,
            department: "Sales",
            positionId: 5,
            position: "Sales Representative",
            status: "Active",
          },
          {
            id: 4,
            fullName: "Emily Davis",
            dateOfBirth: "1992-02-10",
            gender: "Female",
            phoneNumber: "+1 (555) 234-5678",
            email: "emily.davis@example.com",
            hireDate: "2018-09-05",
            departmentId: 4,
            department: "HR",
            positionId: 7,
            position: "HR Specialist",
            status: "On Leave",
          },
          {
            id: 5,
            fullName: "Michael Wilson",
            dateOfBirth: "1987-07-18",
            gender: "Male",
            phoneNumber: "+1 (555) 876-5432",
            email: "michael.wilson@example.com",
            hireDate: "2022-01-15",
            departmentId: 1,
            department: "Engineering",
            positionId: 2,
            position: "QA Engineer",
            status: "Probation",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast, selectedMonthName, selectedYear])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewSalary((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewSalary((prev) => ({ ...prev, [name]: value }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    try {
      // Combine month and year for API call
      const monthYearString = `${selectedMonthName} ${selectedYear}`
      setSelectedMonth(monthYearString)

      // Fetch salary data for the selected month
      const response = await salaryApi.getAll(monthYearString)
      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch salary data")
      }
      setSalaryData(response.data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while fetching salary data",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSalary = async () => {
    try {
      // Validate required fields
      if ((!isEditing && !newSalary.employeeId) || !newSalary.baseSalary) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        })
        return
      }

      // Calculate net salary
      const baseSalary = Number(newSalary.baseSalary)
      const bonus = Number(newSalary.bonus) || 0
      const deductions = Number(newSalary.deductions) || 0

      if (isEditing && editingSalaryId) {
        // Get the current salary record to maintain the employee ID
        const currentSalary = salaryData.find((s) => s.id === editingSalaryId)
        if (!currentSalary) {
          throw new Error("Salary record not found")
        }

        // Update existing salary record
        const salaryData: UpdateSalaryRequest = {
          id: editingSalaryId,
          employeeId: currentSalary.employeeId, // Maintain the same employee ID
          baseSalary: baseSalary,
          bonus: bonus,
          deductions: deductions,
          month: selectedMonth,
        }

        const response = await salaryApi.update(salaryData)

        if (!response.success) {
          throw new Error(response.error || "Failed to update salary record")
        }

        // Update the salary record in the list
        setSalaryData((prevData) => prevData.map((salary) => (salary.id === editingSalaryId ? response.data! : salary)))

        toast({
          title: "Salary record updated",
          description: "Salary record has been updated successfully.",
        })
      } else {
        // Create new salary record
        const salaryData: CreateSalaryRequest = {
          employeeId: Number(newSalary.employeeId),
          baseSalary: baseSalary,
          bonus: bonus,
          deductions: deductions,
          month: selectedMonth,
        }

        const response = await salaryApi.create(salaryData)

        if (!response.success) {
          throw new Error(response.error || "Failed to add salary record")
        }

        // Add the new salary record to the list
        setSalaryData((prevData) => [...prevData, response.data!])

        toast({
          title: "Salary record added",
          description: "Salary record has been added successfully.",
        })
      }

      setIsAddDialogOpen(false)
      setIsEditing(false)
      setEditingSalaryId(null)

      // Reset form
      setNewSalary({
        employeeId: 0,
        baseSalary: 0,
        bonus: 0,
        deductions: 0,
        month: selectedMonth,
      })

      // Refresh the salary data
      handleSearch()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save salary record. Please try again.",
      })
    }
  }

  // Column definitions for the salary table
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "fullName",
      header: "Full Name",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "position",
      header: "Position",
    },
    {
      accessorKey: "month",
      header: "Salary Month",
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
      header: "Actual Salary",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("actualSalary"))
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount)
        return formatted
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const salary = row.original as Salary
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditSalary(salary.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteSalary(salary.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  // Update the handleEditSalary function to fetch the employee name
  const handleEditSalary = (id: number) => {
    // Find the salary record to edit
    const salaryToEdit = salaryData.find((salary) => salary.id === id)
    if (!salaryToEdit) return

    // Find the employee name
    const employeeName = salaryToEdit.fullName

    // Set the form values
    setNewSalary({
      employeeId: salaryToEdit.employeeId,
      baseSalary: salaryToEdit.baseSalary,
      bonus: salaryToEdit.bonus,
      deductions: salaryToEdit.deductions,
      month: salaryToEdit.month,
    })

    // Set editing mode
    setIsEditing(true)
    setEditingSalaryId(id)
    setIsAddDialogOpen(true)
  }

  const handleDeleteSalary = async (id: number) => {
    try {
      const response = await salaryApi.delete(id)

      if (!response.success) {
        throw new Error(response.error || "Failed to delete salary record")
      }

      // Remove the deleted salary record from the list
      setSalaryData(salaryData.filter((salary) => salary.id !== id))

      toast({
        title: "Salary record deleted",
        description: "Salary record has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete salary record. Please try again.",
      })
    }
  }

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll Management</h1>
            <p className="text-muted-foreground">Manage employee salary records</p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) {
                setIsEditing(false)
                setEditingSalaryId(null)
                setNewSalary({
                  employeeId: 0,
                  baseSalary: 0,
                  bonus: 0,
                  deductions: 0,
                  month: selectedMonth,
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Salary Record
              </Button>
            </DialogTrigger>
            {/* Update the DialogContent to show the employee name when editing */}
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Salary Record" : "Add New Salary Record"}</DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the salary details for this employee."
                    : "Fill in the details to add a new salary record to the system."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-business-primary">
                        Employee: {salaryData.find((s) => s.id === editingSalaryId)?.fullName}
                      </Label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee</Label>
                      <Select
                        value={newSalary.employeeId?.toString()}
                        onValueChange={(value) => handleSelectChange("employeeId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary</Label>
                    <Input
                      id="baseSalary"
                      name="baseSalary"
                      type="number"
                      value={newSalary.baseSalary?.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bonus">Bonus</Label>
                    <Input
                      id="bonus"
                      name="bonus"
                      type="number"
                      value={newSalary.bonus?.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="deductions"
                      name="deductions"
                      type="number"
                      value={newSalary.deductions?.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSalary} className="bg-business-primary hover:bg-business-highlight">
                  {isEditing ? "Save Changes" : "Add Salary Record"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="month">Select Month</Label>
            <div className="flex gap-2">
              <Select value={selectedMonthName} onValueChange={setSelectedMonthName}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January">January</SelectItem>
                  <SelectItem value="February">February</SelectItem>
                  <SelectItem value="March">March</SelectItem>
                  <SelectItem value="April">April</SelectItem>
                  <SelectItem value="May">May</SelectItem>
                  <SelectItem value="June">June</SelectItem>
                  <SelectItem value="July">July</SelectItem>
                  <SelectItem value="August">August</SelectItem>
                  <SelectItem value="September">September</SelectItem>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="mt-auto" onClick={handleSearch}>
            Search
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Salary Records - {selectedMonth}</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={salaryData}
              searchColumn="fullName"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

