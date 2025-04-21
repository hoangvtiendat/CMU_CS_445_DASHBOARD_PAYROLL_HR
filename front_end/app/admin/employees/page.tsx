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
    FullName: "",
    DateOfBirth: "",
    Gender: "",
    PhoneNumber: "",
    Email: "",
    HireDate: new Date().toISOString().split("T")[0],
    Department: {
      DepartmentID: 1
    },
    Position: {
      PositionID: 1
    },
    Status: "FULL TIME",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch employees
        const employeesResponse = await employeeApi.getAll()
        if (!employeesResponse.success || !employeesResponse.data) {
          throw new Error(employeesResponse.error || "Failed to fetch employees")
        }

        setEmployees(
          employeesResponse.data.data ?? []
        )
        // Fetch departments
        const departmentsResponse = await departmentApi.getAll()
        if (!departmentsResponse.success || !departmentsResponse.data) {
          throw new Error(departmentsResponse.error || "Failed to fetch departments")
        }
        setDepartments(departmentsResponse.data?.data ?? [])

        // Fetch positions
        const positionsResponse = await positionApi.getAll()
        if (!positionsResponse.success || !positionsResponse.data) {
          throw new Error(positionsResponse.error || "Failed to fetch positions")
        }
        setPositions(positionsResponse.data?.data ?? [])
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

        // setDepartments([
        //   { id: 1, name: "Engineering" },
        //   { id: 2, name: "Marketing" },
        //   { id: 3, name: "Sales" },
        //   { id: 4, name: "HR" },
        // ])

        // setPositions([
        //   { id: 1, name: "Software Developer", departmentId: 1 },
        //   { id: 2, name: "QA Engineer", departmentId: 1 },
        //   { id: 3, name: "Marketing Manager", departmentId: 2 },
        //   { id: 4, name: "Marketing Specialist", departmentId: 2 },
        //   { id: 5, name: "Sales Representative", departmentId: 3 },
        //   { id: 6, name: "Sales Manager", departmentId: 3 },
        //   { id: 7, name: "HR Specialist", departmentId: 4 },
        // ])
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
    // setNewEmployee((prev) => ({ ...prev, [name]: value }))
    setNewEmployee((prev) => {
      switch (name) {
        case "FullName":
        case "DateOfBirth":
        case "Gender":
        case "PhoneNumber":
        case "Email":
        case "HireDate":
        case "Status":
          return { ...prev, [name]: value };
        case "Department.DepartmentID":
          return { ...prev, Department: { ...prev.Department, DepartmentID: Number(value) } };
        case "Position.PositionID":
          return { ...prev, Position: { ...prev.Position, PositionID: Number(value) } };
        default:
          return prev; // Trả về state cũ nếu không khớp với trường nào
      }
    });
  }

  const handleAddEmployee = async () => {
    try {
      // Validate required fields
      if (!newEmployee.FullName || !newEmployee.Department?.DepartmentID || !newEmployee.Position?.PositionID) {
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
        DepartmentID: Number(newEmployee.Department?.DepartmentID),
        PositionID: Number(newEmployee.Position.PositionID),
      }

      let response: { success: boolean; data?: Employee; error?: string }

      if (isEditing && editingEmployeeId) {
        // Update existing employee
        const apiResponse = await employeeApi.update({
          id: editingEmployeeId,
          ...employeeData,
        })
        response = {
          success: apiResponse.success,
          data: apiResponse.data?.data || undefined,
          error: apiResponse.error,
        }

        if (!response.success) {
          throw new Error(response.error || "Failed to update employee")
        }
        // Update the employee in the list
        // setEmployees(employees.map((employee) => (employee.data.data.EmployeeID === editingEmployeeId ? response.data! : employee)))
        // setEmployees(employees.map((employee) => (employee.EmployeeID === editingEmployeeId ? response.data! : employee)))
        setEmployees(employees.map((employee) => {
          if (employee.EmployeeID === editingEmployeeId && response.data) {
            const updatedDepartment = departments.find(
              (dep) => dep.DepartmentID === response.data?.Department.DepartmentID
            );
            const updatedPosition = positions.find(
              (pos) => pos.PositionID === response.data?.Position.PositionID
            );

            return {
              ...employee,
              ...response.data,
              Department: updatedDepartment || employee.Department, // Sử dụng thông tin mới nếu tìm thấy
              Position: updatedPosition || employee.Position,     // Ngược lại giữ lại thông tin cũ
            };
          }
          return employee;
        }));


        toast({
          title: "Employee updated",
          description: `${newEmployee.FullName} has been updated successfully.`,
        });

      } else {
        // Create new employee
        const apiResponse = await employeeApi.create(employeeData)
        response = {
          success: apiResponse.success,
          data: apiResponse.data?.data || undefined,
          error: apiResponse.error,
        }

        if (!response.success) {
          throw new Error(response.error || "Failed to add employee")
        }

        // Add the new employee to the list
        setEmployees([...employees, response.data!])

        toast({
          title: "Employee added",
          description: `${newEmployee.FullName} has been added successfully.`,
        })
      }

      setIsAddDialogOpen(false)
      setIsEditing(false)
      setEditingEmployeeId(null)


      // Reset form
      setNewEmployee({
        FullName: "",
        DateOfBirth: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        HireDate: new Date().toISOString().split("T")[0],
        Department: {
          DepartmentID: 1,

        },
        Position: {
          PositionID: 1,

        },
        Status: "FULL TIME",
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
      accessorKey: "index",
      header: "ID",
      cell: ({ row }: { row: { index: number } }) => row.index + 1,
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
      accessorKey: "Status",
      header: "Status",
      cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
        const status = row.getValue("Status") as string
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${status === "FULL TIME" ? "bg-green-500" : status === "PART TIME" ? "bg-yellow-500" : "bg-red-500"
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
            <Button variant="ghost" size="icon" onClick={() => handleEditEmployee(employee.EmployeeID)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteEmployee(employee.EmployeeID)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEditEmployee = (id: number) => {
    // Find the employee to edit
    const employeeToEdit = employees.find((employee) => employee.EmployeeID === id)
    if (!employeeToEdit) return

    // Set the form values
    setNewEmployee({
      FullName: employeeToEdit.FullName,
      DateOfBirth: employeeToEdit.DateOfBirth,
      Gender: employeeToEdit.Gender,
      PhoneNumber: employeeToEdit.PhoneNumber,
      Email: employeeToEdit.Email,
      HireDate: employeeToEdit.HireDate,
      Department: {
        DepartmentID: employeeToEdit.Department.DepartmentID,

      },


      Position: {
        PositionID: employeeToEdit.Position.PositionID,

      },


      Status: employeeToEdit.Status,

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
      setEmployees(employees.filter((employee) => employee.EmployeeID !== id))

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
    <DashboardLayout role="admin" userName="Admin">
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
                  FullName: "",
                  DateOfBirth: "",
                  Gender: "",
                  PhoneNumber: "",
                  Email: "",
                  HireDate: new Date().toISOString().split("T")[0],
                  Department: {
                    DepartmentID: 1,
                  },
                  Position: {
                    PositionID: 0,
                  },
                  Status: "FULL TIME",
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
                    <Input id="FullName" name="FullName" value={newEmployee.FullName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="DateOfBirth">Date of Birth</Label>
                    <Input
                      id="DateOfBirth"
                      name="DateOfBirth"
                      type="date"
                      value={newEmployee.DateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Gender">Gender</Label>
                    <Select value={newEmployee.Gender} onValueChange={(value) => handleSelectChange("Gender", value)}>
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
                    <Label htmlFor="PhoneNumber">Phone Number</Label>
                    <Input
                      id="PhoneNumber"
                      name="PhoneNumber"
                      value={newEmployee.PhoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Email">Email</Label>
                    <Input
                      id="Email"
                      name="Email"
                      type="Email"
                      value={newEmployee.Email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="HireDate">Hire Date</Label>
                    <Input
                      id="HireDate"
                      name="HireDate"
                      type="Date"
                      value={newEmployee.HireDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Department">Department</Label>
                    <Select
                      value={newEmployee.Department?.DepartmentID?.toString()}
                      onValueChange={(value) => handleSelectChange("Department.DepartmentID", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.DepartmentID} value={department.DepartmentID.toString()}>
                            {department.DepartmentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Position">Position</Label>
                    <Select
                      value={newEmployee.Position?.PositionID?.toString()}
                      onValueChange={(value) => handleSelectChange("Position.PositionID", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.PositionID} value={position.PositionID.toString()}>
                            {position.PositionName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Status">Status</Label>
                    <Select value={newEmployee.Status} onValueChange={(value) => handleSelectChange("Status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL TIME">FULL TIME</SelectItem>
                        <SelectItem value="PART TIME">PART TIME</SelectItem>
                        {/* <SelectItem value="Probation">Probation</SelectItem> */}
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
              searchColumn="FullName"
              searchPlaceholder="Search by name..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

