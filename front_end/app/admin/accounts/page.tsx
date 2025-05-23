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
import { Plus, Trash2, UserCog } from "lucide-react"
import { accountApi, employeeApi } from "@/lib/api"
import type { Account, Employee, CreateAccountRequest, UpdateAccountRequest } from "@/lib/api-types"

export default function AccountsPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newAccount, setNewAccount] = useState<Partial<CreateAccountRequest>>({
    Username: "",
    Password: "",
    Email: "",
    Role: "",
    Employee: undefined,
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch accounts
        const accountsResponse = await accountApi.getAll()
        if (!accountsResponse.success || !accountsResponse.data) {
          throw new Error(accountsResponse.error || "Failed to fetch accounts")
        }
        setAccounts(accountsResponse.data.data ?? [])

        // Fetch employees for the dropdown
        const employeesResponse = await employeeApi.getAll()
        if (!employeesResponse.success || !employeesResponse.data) {
          throw new Error(employeesResponse.error || "Failed to fetch employees")
        }
        setEmployees(employeesResponse.data.data ?? [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })

        // Set mock data if API fails
        // setAccounts([
        //   {
        //     id: 1,
        //     FullName: "John Doe",
        //     username: "john.doe",
        //     email: "john.doe@example.com",
        //     role: "Employee",
        //     employeeId: 1,
        //   },
        //   {
        //     id: 2,
        //     fullName: "Jane Smith",
        //     username: "jane.smith",
        //     email: "jane.smith@example.com",
        //     role: "Employee",
        //     employeeId: 2,
        //   },
        //   {
        //     id: 3,
        //     fullName: "HR Manager",
        //     username: "hr",
        //     email: "hr@example.com",
        //     role: "HR Manager",
        //     employeeId: 4,
        //   },
        //   {
        //     id: 4,
        //     fullName: "Payroll Manager",
        //     username: "payroll",
        //     email: "payroll@example.com",
        //     role: "Payroll Manager",
        //     employeeId: null,
        //   },
        //   {
        //     id: 5,
        //     fullName: "Admin",
        //     username: "admin",
        //     email: "admin@example.com",
        //     role: "Admin",
        //     employeeId: null,
        //   },
        // ])

        // setEmployees([
        //   {
        //     EmployeeID: 1,
        //     FullName: "John Doe",
        //     DateOfBirth: "1985-05-15",
        //     Gender: "Male",
        //     PhoneNumber: "+1 (555) 123-4567",
        //     Email: "john.doe@example.com",
        //     HireDate: "2020-01-10",
        //     DepartmentId: 1,
        //     Department: {
        //       DepartmentID: 1
        //     },
        //     Position: {
        //       PositionID: 1,
        //     },
        //     Status: "Active",
        //   },

        //   {
        //     EmployeeID: 2,
        //     FullName: "John Doe2",
        //     DateOfBirth: "1985-05-15",
        //     Gender: "Male",
        //     PhoneNumber: "+1 (555) 123-4567",
        //     Email: "john.doe@example.com",
        //     HireDate: "2020-01-10",
        //     DepartmentId: 1,
        //     Department: {
        //       DepartmentID: 1
        //     },
        //     Position: {
        //       PositionID: 1,
        //     },
        //     Status: "Active",
        //   },
        // ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "confirmPassword") {
      setConfirmPassword(value)
    } else {
      setNewAccount((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "employeeId" && value) {
      // If an employee is selected, auto-fill the name and email
      const selectedEmployee = employees.find((emp) => emp.EmployeeID.toString() === value)
      if (selectedEmployee) {
        setNewAccount((prev) => ({
          ...prev,
          [name]: Number(value),
          // fullName: selectedEmployee.FullName,
          email: selectedEmployee.Email,
        }))
      } else {
        setNewAccount((prev) => ({ ...prev, [name]: Number(value) }))
      }
    } else {
      setNewAccount((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Validate username & password
  const validateAccount = () => {
    console.log("Validating account:", newAccount)
    if (!newAccount.Username || newAccount.Username.length < 5) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Username must be at least 6 characters.",
      })
      return false
    }
    if (!newAccount.Password || newAccount.Password.length <= 6) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 6 characters.",
      })
      return false
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newAccount.Password || "")) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must contain at least one special character.",
      })
      return false
    }

    if (newAccount.Password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Error",
        description: "Passwords do not match.",
      })
      return false
    }

    return true
  }

  const handleAddAccount = async () => {
    try {
      // Validate required fields
      if (!newAccount.Username || !newAccount.Employee || !newAccount.Role) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        })
        return
      }

      // Validate username & password
      if (!validateAccount()) return

      // Validate password confirmation for new accounts
      if (!isEditing && newAccount.Password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Password Error",
          description: "Passwords do not match.",
        })
        return
      }

      if (isEditing && editingAccountId) {
        // Update existing account
        const accountData: UpdateAccountRequest = {
          Id: editingAccountId,
          Username: newAccount.Username,
          Password: "",
          Email: newAccount.Email,
          Role: newAccount.Role,
          Employee: { EmployeeID: Number(newAccount.Employee) },
        }

        // Only include password if it was changed
        if (newAccount.Password) {
          accountData.Password = newAccount.Password
        }

        const response = await accountApi.update(accountData)
        if (!response.success) {
          throw new Error(response.error || "Failed to update account")
        }

        // Update the account in the list
        setAccounts(accounts.map((account) => (account.Id === editingAccountId ? response.data!.data! : account)))

        toast({
          title: "Account updated",
          description: `Account for ${newAccount.Employee} has been updated successfully.`,
        })
      } else {
        // Create new account
        const accountData: CreateAccountRequest = {
          ...(newAccount as CreateAccountRequest),
          Employee: newAccount.Employee
        }

        const response = await accountApi.create(accountData)
        console.log("New account created:", newAccount)
        if (!response.success) {
          throw new Error(response.error || "Failed to create account")
        }

        // Add the new account to the list
        setAccounts([...accounts, response.data!.data!])

        toast({
          title: "Account created",
          description: `Account for ${newAccount.Employee} has been created successfully.`,
        })
      }

      setIsAddDialogOpen(false)
      setIsEditing(false)
      setEditingAccountId(null)

      // Reset form
      setNewAccount({
        Username: "",
        Password: "",
        Email: "",
        Role: "",
        Employee: undefined,
      })
      setConfirmPassword("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save account. Please try again.",
      })
    }
  }

  // Xác nhận xoá account
  const handleDeleteAccount = async (id: number) => {
    setDeleteConfirmId(id)
  }

  const confirmDeleteAccount = async () => {
    if (deleteConfirmId === null) return
    try {
      const response = await accountApi.delete(deleteConfirmId)
      if (!response.success) {
        throw new Error(response.error || "Failed to delete account")
      }
      setAccounts(accounts.filter((account) => account.Id !== deleteConfirmId))
      toast({
        title: "Account deleted",
        description: "Account has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
      })
    } finally {
      setDeleteConfirmId(null)
    }
  }

  // Column definitions for the accounts table
  const columns = [
    {
      accessorKey: "Id",
      header: "ID",
      cell: ({ row }: { row: { index: number } }) => row.index + 1,
    },
    {
      accessorKey: "Username",
      header: "Username",
    },
    // {
    //   accessorKey: "Email",
    //   header: "Email",
    // },

    {
      accessorKey: "FullName",
      header: "Employee",

    },
    {
      accessorKey: "Role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Account } }) => {
        const account = row.original as Account
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account.Id)}>
              <UserCog className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.Id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEditAccount = (id: number) => {
    // Find the account to edit
    const accountToEdit = accounts.find((account) => account.Id === id)
    if (!accountToEdit) return

    // Set the form values
    setNewAccount({
      Username: accountToEdit.Username,
      Email: accountToEdit.Email,
      Role: accountToEdit.Role,
      Employee: accountToEdit.EmployeeID?.toString(),
      Password: "", // Password field is empty when editing
    })

    // Set editing mode
    setIsEditing(true)
    setEditingAccountId(id)
    setIsAddDialogOpen(true)
  }

  return (
    <DashboardLayout role="admin" userName="Admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Management</h1>
            <p className="text-muted-foreground">Manage user accounts and access control</p>
          </div>
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) {
                setIsEditing(false)
                setEditingAccountId(null)
                setNewAccount({
                  Username: "",
                  Password: "",
                  Email: "",
                  Role: "",
                  Employee: undefined,
                })
                setConfirmPassword("")
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Edit Account" : "Create New Account"}</DialogTitle>
                <DialogDescription>
                  {isEditing ? "Update account details." : "Fill in the details to create a new user account."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="Username" name="Username" value={newAccount.Username} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee</Label>
                    <Select
                      value={newAccount.Employee?.toString() || ""}
                      onValueChange={(value) => handleSelectChange("Employee", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem
                            key={employee.EmployeeID}
                            value={employee.EmployeeID.toString()} // Sử dụng EmployeeID làm value
                          >
                            {employee.FullName} {/* Hiển thị FullName */}
                          </SelectItem>
                        ))}
                        {isEditing && newAccount.Employee && !employees.find(emp => emp.EmployeeID.toString() === newAccount.Employee) && (
                          <SelectItem value={newAccount.Employee}>
                            {employees.find(emp => emp.EmployeeID.toString() === newAccount.Employee)?.FullName || "Unknown Employee"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="Email" name="Email" type="email" value={newAccount.Email} onChange={handleInputChange} />
                  </div> */}
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newAccount.Role} onValueChange={(value) => handleSelectChange("Role", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Employee">Employee</SelectItem>
                        <SelectItem value="HR Manager">HR Manager</SelectItem>
                        <SelectItem value="Payroll Manager">Payroll Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="Password"
                      name="Password"
                      type="Password"
                      value={newAccount.Password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="Password"
                      value={confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount}>{isEditing ? "Save Changes" : "Create Account"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={accounts}
              searchColumn="FullName"
              searchPlaceholder="Search by any field..."
            />
          </CardContent>
        </Card>
        {/* Dialog xác nhận xoá */}
        <Dialog open={deleteConfirmId !== null} onOpenChange={open => !open && setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div>Do you sure delete this account?</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteAccount}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

