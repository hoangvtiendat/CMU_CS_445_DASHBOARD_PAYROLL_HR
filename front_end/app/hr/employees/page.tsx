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
import { employeeApi, departmentApi, positionApi } from "@/lib/api"
import type { Employee, Department, Position, CreateEmployeeRequest } from "@/lib/api-types"

export default function EmployeesPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newEmployee, setNewEmployee] = useState<Partial<CreateEmployeeRequest>>({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    hireDate: new Date().toISOString().split("T")[0],
    departmentId: 0,
    positionId: 0,
    status: "Active",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch employees
        console.log(1)
        const employeesResponse = await employeeApi.getAll()
        console.log(employeesResponse)
        if (!employeesResponse.success || !employeesResponse.data) {
          throw new Error(employeesResponse.error || "Failed to fetch employees")
        }
        console.log(2)
        console.log(" employeesResponse.data.data", employeesResponse.data.data)
        setEmployees(
          employeesResponse.data?.data ?? []
        )
        // Fetch departments
        const departmentsResponse = await departmentApi.getAll()
        if (!departmentsResponse.success || !departmentsResponse.data) {
          throw new Error(departmentsResponse.error || "Failed to fetch departments")
        }
        setDepartments(departmentsResponse.data)

        // Fetch positions
        const positionsResponse = await positionApi.getAll()
        if (!positionsResponse.success || !positionsResponse.data) {
          throw new Error(positionsResponse.error || "Failed to fetch positions")
        }
        setPositions(positionsResponse.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        // setEmployees([
        //   {
        //     EmployeeID: 1,
        //     FullName: "John Doe",
        //     DateOfBirth: "1985-05-15",
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
        //     EmployeeID: 2,
        //     FullName: "Jane Smith",
        //     DateOfBirth: "1990-08-22",
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
        // ])

        setDepartments([
          { id: 1, name: "Engineering" },
          { id: 2, name: "Marketing" },
          { id: 3, name: "Sales" },
          { id: 4, name: "HR" },
        ])

        setPositions([
          { id: 1, name: "Software Developer", departmentId: 1 },
          { id: 2, name: "QA Engineer", departmentId: 1 },
          { id: 3, name: "Marketing Manager", departmentId: 2 },
          { id: 4, name: "Marketing Specialist", departmentId: 2 },
          { id: 5, name: "Sales Representative", departmentId: 3 },
          { id: 6, name: "Sales Manager", departmentId: 3 },
          { id: 7, name: "HR Specialist", departmentId: 4 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewEmployee((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEmployee = async () => {
    try {
      // Validate required fields
      if (!newEmployee.fullName || !newEmployee.email || !newEmployee.departmentId || !newEmployee.positionId) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        })
        return
      }

      // Convert departmentId and positionId to numbers
      const employeeData = {
        ...(newEmployee as CreateEmployeeRequest),
        departmentId: Number(newEmployee.departmentId),
        positionId: Number(newEmployee.positionId),
      }

      let response: { success: boolean; data?: Employee; error?: string }

      if (isEditing && editingEmployeeId) {
        // Update existing employee
        response = await employeeApi.update({
          id: editingEmployeeId,
          ...employeeData,
        })

        if (!response.success) {
          throw new Error(response.error || "Failed to update employee")
        }

        // Update the employee in the list
        // setEmployees(employees.map((employee) => (employee.data.data.EmployeeID === editingEmployeeId ? response.data! : employee)))
        setEmployees(employees.map((employee) => (employee.EmployeeID === editingEmployeeId ? response.data! : employee)))


        toast({
          title: "Employee updated",
          description: `${newEmployee.fullName} has been updated successfully.`,
        })
      } else {
        // Create new employee
        response = await employeeApi.create(employeeData)

        if (!response.success) {
          throw new Error(response.error || "Failed to add employee")
        }

        // Add the new employee to the list
        setEmployees([...employees, response.data!])

        toast({
          title: "Employee added",
          description: `${newEmployee.fullName} has been added successfully.`,
        })
      }

      setIsAddDialogOpen(false)
      setIsEditing(false)
      setEditingEmployeeId(null)

      // Reset form
      setNewEmployee({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        phoneNumber: "",
        email: "",
        hireDate: new Date().toISOString().split("T")[0],
        departmentId: 0,
        positionId: 0,
        status: "Active",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save employee. Please try again.",
      })
    }
  }

  // Column definitions for the employees table
  const columns = [
    {
      accessorKey: "EmployeeID",
      header: "ID",
    },
    {
      accessorKey: "FullName",
      header: "Full Name",
    },
    {
      accessorKey: "Email",
      header: "Email",
    },
    {
      accessorKey: "DateOfBirth",
      header: "Date of Birth",
    },
    {
      accessorKey: "PhoneNumber",
      header: "Phone Number",
    },
    {
      accessorKey: "Gender",
      header: "Gender",
    },
    {
      accessorKey: "HireDate",
      header: "Hire Date",
    },
    {
      accessorKey: "Department.DepartmentName",
      header: "Department",
    },
    {
      accessorKey: "Position.PositionName",
      header: "Position",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
        const status = row.getValue("status") as string
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${status === "Active" ? "bg-green-500" : status === "On Leave" ? "bg-yellow-500" : "bg-red-500"
                }`}
            />
            {status}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Employee } }) => {
        const employee = row.original as Employee
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee.id)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEditEmployee = (id: number) => {
    // Find the employee to edit
    const employeeToEdit = employees.find((employee) => employee.id === id)
    if (!employeeToEdit) return

    // Set the form values
    setNewEmployee({
      fullName: employeeToEdit.FullName,
      dateOfBirth: employeeToEdit.DateOfBirth,
      gender: employeeToEdit.gender,
      phoneNumber: employeeToEdit.phoneNumber,
      email: employeeToEdit.email,
      hireDate: employeeToEdit.hireDate,
      departmentId: employeeToEdit.departmentId,
      positionId: employeeToEdit.positionId,
      status: employeeToEdit.status,
    })

    // Set editing mode
    setIsEditing(true)
    setEditingEmployeeId(id)
    setIsAddDialogOpen(true)
  }

  const handleDeleteEmployee = async (id: number) => {
    try {
      const response = await employeeApi.delete(id)

      if (!response.success) {
        throw new Error(response.error || "Failed to delete employee")
      }

      // Remove the deleted employee from the list
      setEmployees(employees.filter((employee) => employee.id !== id))

      toast({
        title: "Employee deleted",
        description: "Employee has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete employee. Please try again.",
      })
    }
  }

  return (
    <DashboardLayout role="hr" userName="HR Manager">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">Manage employee information</p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) {
                setIsEditing(false)
                setEditingEmployeeId(null)
                setNewEmployee({
                  fullName: "",
                  dateOfBirth: "",
                  gender: "",
                  phoneNumber: "",
                  email: "",
                  hireDate: new Date().toISOString().split("T")[0],
                  departmentId: 0,
                  positionId: 0,
                  status: "Active",
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update employee details." : "Fill in the details to add a new employee to the system."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="FullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={newEmployee.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={newEmployee.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={newEmployee.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={newEmployee.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input
                      id="hireDate"
                      name="hireDate"
                      type="date"
                      value={newEmployee.hireDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newEmployee.departmentId?.toString()}
                      onValueChange={(value) => handleSelectChange("departmentId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id.toString()}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={newEmployee.positionId?.toString()}
                      onValueChange={(value) => handleSelectChange("positionId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id.toString()}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={newEmployee.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Probation">Probation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee}>{isEditing ? "Save Changes" : "Add Employee"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={employees}
              searchColumn="fullName"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

