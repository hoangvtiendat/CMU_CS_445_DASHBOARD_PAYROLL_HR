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
  const [salaryData, setSalaryData] = useState<Salary[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newSalary, setNewSalary] = useState<Partial<CreateSalaryRequest>>({
    EmployeeID: 0,
    BaseSalary: 0,
    Bonus: 0,
    Deductions: 0,
    SalaryMonth: new Date(selectedMonth).toISOString().split("T")[0],
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingSalaryId, setEditingSalaryId] = useState<number | null>(null)

  const [selectedMonthName, setSelectedMonthName] = useState("May")
  const [selectedYear, setSelectedYear] = useState("2025")

  useEffect(() => {
    // const currentDate = new Date();
    // const currentMonthName = currentDate.toLocaleString("default", { month: "long" }); // Ví dụ: "June"
    // const currentYear = currentDate.getFullYear().toString(); // Ví dụ: "2025"

    // // Cập nhật selectedMonthName và selectedYear
    // setSelectedMonthName(currentMonthName);
    // setSelectedYear(currentYear);
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
        if (salaryResponse.data.data) {
          setSalaryData(salaryResponse.data.data)
        } else {
          setSalaryData([])
        }

        // Fetch employees for the dropdown
        const employeesResponse = await employeeApi.getAll()
        if (!employeesResponse.success || !employeesResponse.data) {
          throw new Error(employeesResponse.error || "Failed to fetch employees")
        }


        setEmployees(employeesResponse.data.data || [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        // setSalaryData([
        //   {
        //     id: 1,
        //     employeeId: 1,
        //     fullName: "John Doe",
        //     department: "Engineering",
        //     position: "Software Developer",
        //     baseSalary: 5000,
        //     bonus: 500,
        //     deductions: 200,
        //     netSalary: 5300,
        //     actualSalary: 5300,
        //     month: "June 2023",
        //   },
        //   {
        //     id: 2,
        //     employeeId: 2,
        //     fullName: "Jane Smith",
        //     department: "Marketing",
        //     position: "Marketing Manager",
        //     baseSalary: 6000,
        //     bonus: 800,
        //     deductions: 250,
        //     netSalary: 6550,
        //     actualSalary: 6550,
        //     month: "June 2023",
        //   },
        //   {
        //     id: 3,
        //     employeeId: 3,
        //     fullName: "Robert Johnson",
        //     department: "Sales",
        //     position: "Sales Representative",
        //     baseSalary: 4500,
        //     bonus: 1200,
        //     deductions: 180,
        //     netSalary: 5520,
        //     actualSalary: 5520,
        //     month: "June 2023",
        //   },
        //   {
        //     id: 4,
        //     employeeId: 4,
        //     fullName: "Emily Davis",
        //     department: "HR",
        //     position: "HR Specialist",
        //     baseSalary: 4800,
        //     bonus: 300,
        //     deductions: 190,
        //     netSalary: 4910,
        //     actualSalary: 4910,
        //     month: "June 2023",
        //   },
        //   {
        //     id: 5,
        //     employeeId: 5,
        //     fullName: "Michael Wilson",
        //     department: "Engineering",
        //     position: "QA Engineer",
        //     baseSalary: 4700,
        //     bonus: 400,
        //     deductions: 185,
        //     netSalary: 4915,
        //     actualSalary: 4915,
        //     month: "June 2023",
        //   },
        // ])

        // setEmployees([
        //   {
        //     id: 1,
        //     fullName: "John Doe",
        //     dateOfBirth: "1985-05-15",
        //     gender: "Male",
        //     phoneNumber: "+1 (555) 123-4567",
        //     email: "john.doe@example.com",
        //     hireDate: "2020-01-10",
        //     departmentId: 1,
        //     department: "Engineering",
        //     positionId: 1,
        //     position: "Software Developer",
        //     status: "Active",
        //   },
        //   {
        //     id: 2,
        //     fullName: "Jane Smith",
        //     dateOfBirth: "1990-08-22",
        //     gender: "Female",
        //     phoneNumber: "+1 (555) 987-6543",
        //     email: "jane.smith@example.com",
        //     hireDate: "2019-03-15",
        //     departmentId: 2,
        //     department: "Marketing",
        //     positionId: 3,
        //     position: "Marketing Manager",
        //     status: "Active",
        //   },
        //   {
        //     id: 3,
        //     fullName: "Robert Johnson",
        //     dateOfBirth: "1988-11-30",
        //     gender: "Male",
        //     phoneNumber: "+1 (555) 456-7890",
        //     email: "robert.johnson@example.com",
        //     hireDate: "2021-05-20",
        //     departmentId: 3,
        //     department: "Sales",
        //     positionId: 5,
        //     position: "Sales Representative",
        //     status: "Active",
        //   },
        //   {
        //     id: 4,
        //     fullName: "Emily Davis",
        //     dateOfBirth: "1992-02-10",
        //     gender: "Female",
        //     phoneNumber: "+1 (555) 234-5678",
        //     email: "emily.davis@example.com",
        //     hireDate: "2018-09-05",
        //     departmentId: 4,
        //     department: "HR",
        //     positionId: 7,
        //     position: "HR Specialist",
        //     status: "On Leave",
        //   },
        //   {
        //     id: 5,
        //     fullName: "Michael Wilson",
        //     dateOfBirth: "1987-07-18",
        //     gender: "Male",
        //     phoneNumber: "+1 (555) 876-5432",
        //     email: "michael.wilson@example.com",
        //     hireDate: "2022-01-15",
        //     departmentId: 1,
        //     department: "Engineering",
        //     positionId: 2,
        //     position: "QA Engineer",
        //     status: "Probation",
        //   },
        // ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast, selectedMonthName, selectedYear])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "SalaryMonth") {
      // Cập nhật selectedMonth để hiển thị trong ô input
      setSelectedMonth(value);
      // Cập nhật newSalary.SalaryMonth
      setNewSalary((prev) => ({ ...prev, [name]: new Date(value).toISOString().split("T")[0] }));
    } else {
      setNewSalary((prev) => ({ ...prev, [name]: value }));
    }
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
      if (response.data.data) {
        setSalaryData(response.data.data)
      } else {
        setSalaryData([])
      }

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

  // Update the handleEditSalary function to fetch the employee name
  const handleEditSalary = (SalaryID: number) => {
    // Find the salary record to edit
    const salaryToEdit = salaryData.find((salary) => salary.SalaryID === SalaryID)
    if (!salaryToEdit) return

    // Find the employee name

    const formattedSalaryMonth = formatDateToYYYYMMDD(salaryToEdit.SalaryMonth);

    // Set the form values
    setNewSalary({
      EmployeeID: salaryToEdit.EmployeeID,
      BaseSalary: salaryToEdit.BaseSalary,
      Bonus: salaryToEdit.Bonus,
      Deductions: salaryToEdit.Deductions,
      // SalaryMonth: salaryToEdit.SalaryMonth instanceof Date
      //   ? salaryToEdit.SalaryMonth.toISOString().split("T")[0]
      //   : salaryToEdit.SalaryMonth,
      SalaryMonth: formattedSalaryMonth
    })

    // Set editing mode
    setSelectedMonth(formattedSalaryMonth);
    setIsEditing(true)
    setEditingSalaryId(SalaryID)
    setIsAddDialogOpen(true)
  }

  const handleDeleteSalary = async (id: number) => {
    try {
      const response = await salaryApi.delete(id)

      if (!response.success) {
        throw new Error(response.error || "Failed to delete salary record")
      }

      // Remove the deleted salary record from the list
      setSalaryData(salaryData.filter((salary) => salary.SalaryID !== id))

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

  const formatDateToYYYYMMDD = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Trả về định dạng YYYY-MM-DD
  };

  // Update the handleSaveSalary function to maintain the employee ID when editing
  const handleSaveSalary = async () => {
    try {
      // Validate required fields
      if ((!isEditing && !newSalary.EmployeeID) || !newSalary.BaseSalary) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        })
        return
      }

      // Calculate net salary
      const baseSalary = Number(newSalary.BaseSalary)
      const bonus = Number(newSalary.Bonus) || 0
      const deductions = Number(newSalary.Deductions) || 0

      if (isEditing && editingSalaryId) {
        // Get the current salary record to maintain the employee ID
        const currentSalary = salaryData?.find((s) => s.SalaryID === editingSalaryId)
        if (!currentSalary) {
          throw new Error("Salary record not found")
        }

        // Update existing salary record
        const updatedSalaryData: UpdateSalaryRequest = {
          SalaryID: editingSalaryId,
          EmployeeID: currentSalary.EmployeeID, // Maintain the same employee ID
          BaseSalary: baseSalary,
          Bonus: bonus,
          Deductions: deductions,
          SalaryMonth: formatDateToYYYYMMDD(newSalary.SalaryMonth || selectedMonth), // Keep the format as yyyy-MM-dd
        }

        const response = await salaryApi.update(updatedSalaryData)

        if (!response.success) {
          throw new Error(response.error || "Failed to update salary record")
        }

        // Update the salary record in the list
        setSalaryData((prevData) => prevData.map((salary) => {
          if (salary.SalaryID === editingSalaryId && response.data) {
            const updatedSalary: Salary = {
              ...salary,
              ...response.data, // Ensure response.data matches the Salary type
            };
            return updatedSalary;
          }
          return salary;
        }));

        toast({
          title: "Salary record updated",
          description: "Salary record has been updated successfully.",
        })
      } else {
        // Create new salary record
        const salaryData: CreateSalaryRequest = {
          EmployeeID: Number(newSalary.EmployeeID),
          BaseSalary: baseSalary,
          Bonus: bonus,
          Deductions: deductions,
          SalaryMonth: formatDateToYYYYMMDD(newSalary.SalaryMonth || selectedMonth),
        }

        const response = await salaryApi.create(salaryData)

        if (!response.success) {
          throw new Error(response.error || "Failed to add salary record")
        }

        // Add the new salary record to the list
        if (response.data) {
          const newSalaryRecord: Salary = {
            SalaryID: response.data?.data?.SalaryID || 0,
            EmployeeID: response.data?.data?.EmployeeID || 0,
            BaseSalary: response.data?.data?.BaseSalary || 0,
            Bonus: response.data?.data?.Bonus || 0,
            Deductions: response.data?.data?.Deductions || 0,
            NetSalary: response.data?.data?.NetSalary || 0,
            // ActualSalary: response.data?.data?.ActualSalary || 0,
            SalaryMonth: response.data?.data?.SalaryMonth || new Date(),
            FullName: response.data?.data?.FullName || "",
          };
          setSalaryData((prevData) => [...prevData, newSalaryRecord]);
        }

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
        EmployeeID: 0,
        BaseSalary: 0,
        Bonus: 0,
        Deductions: 0,
        SalaryMonth: new Date(selectedMonth).toISOString().split("T")[0],
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
      accessorKey: "SalaryID",
      header: "ID",
    },
    {
      accessorKey: "FullName",
      header: "Full Name",
    },
    {
      accessorKey: "DepartmentName",
      header: "Department",
    },
    {
      accessorKey: "PositionName",
      header: "Position",
    },
    {
      accessorKey: "SalaryMonth",
      header: "Salary Month",
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
        }).format(amount)
        return formatted
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Salary } }) => {
        const salary = row.original as Salary
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditSalary(salary.SalaryID)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteSalary(salary.SalaryID)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]


  // Update the DialogContent to show the employee name when editing
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
                  EmployeeID: 0,
                  BaseSalary: 0,
                  Bonus: 0,
                  Deductions: 0,
                  SalaryMonth: formatDateToYYYYMMDD(new Date()),
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
                        Employee: {salaryData.find((s) => s.SalaryID === editingSalaryId)?.FullName}
                      </Label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="EmployeeID">Employee</Label>
                      <Select
                        value={newSalary.EmployeeID?.toString()}
                        onValueChange={(value) => handleSelectChange("EmployeeID", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.EmployeeID} value={employee.EmployeeID.toString()}>
                              {employee.FullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="Salary Date">Salary Month</Label>
                    <Input
                      id="SalaryMonth"
                      name="SalaryMonth"
                      type="date"
                      value={newSalary.SalaryMonth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary</Label>
                    <Input
                      id="BaseSalary"
                      name="BaseSalary"
                      type="number"
                      value={newSalary.BaseSalary?.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Bonus">Bonus</Label>
                    <Input
                      id="Bonus"
                      name="Bonus"
                      type="number"
                      value={newSalary.Bonus?.toString()}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Deductions</Label>
                    <Input
                      id="Deductions"
                      name="Deductions"
                      type="number"
                      value={newSalary.Deductions?.toString()}
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
              searchColumn="FullName"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

