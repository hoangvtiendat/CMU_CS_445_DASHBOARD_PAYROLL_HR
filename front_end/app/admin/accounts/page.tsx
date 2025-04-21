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
    username: "",
    password: "",
    email: "",
    fullName: "",
    role: "",
    employeeId: undefined,
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editingAccountId, setEditingAccountId] = useState<number | null>(null)

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
        setAccounts([
          {
            id: 1,
            fullName: "John Doe",
            username: "john.doe",
            email: "john.doe@example.com",
            role: "Employee",
            employeeId: 1,
          },
          {
            id: 2,
            fullName: "Jane Smith",
            username: "jane.smith",
            email: "jane.smith@example.com",
            role: "Employee",
            employeeId: 2,
          },
          {
            id: 3,
            fullName: "HR Manager",
            username: "hr",
            email: "hr@example.com",
            role: "HR Manager",
            employeeId: 4,
          },
          {
            id: 4,
            fullName: "Payroll Manager",
            username: "payroll",
            email: "payroll@example.com",
            role: "Payroll Manager",
            employeeId: null,
          },
          {
            id: 5,
            fullName: "Admin",
            username: "admin",
            email: "admin@example.com",
            role: "Admin",
            employeeId: null,
          },
        ])

        setEmployees([
          {
            EmployeeID: 1,
            FullName: "John Doe",
            DateOfBirth: "1985-05-15",
            Gender: "Male",
            PhoneNumber: "+1 (555) 123-4567",
            Email: "john.doe@example.com",
            HireDate: "2020-01-10",
            DepartmentId: 1,
            Department: {
              DepartmentID: 1
            },
            Position: {
              PositionID: 1,
            },
            Status: "Active",
          },

          {
            EmployeeID: 2,
            FullName: "John Doe2",
            DateOfBirth: "1985-05-15",
            Gender: "Male",
            PhoneNumber: "+1 (555) 123-4567",
            Email: "john.doe@example.com",
            HireDate: "2020-01-10",
            DepartmentId: 1,
            Department: {
              DepartmentID: 1
            },
            Position: {
              PositionID: 1,
            },
            Status: "Active",
          },
        ])
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
          fullName: selectedEmployee.FullName,
          email: selectedEmployee.Email,
        }))
      } else {
        setNewAccount((prev) => ({ ...prev, [name]: Number(value) }))
      }
    } else {
      setNewAccount((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleAddAccount = async () => {
    try {
      // Validate required fields
      if (!newAccount.username || !newAccount.email || !newAccount.fullName || !newAccount.role) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please fill in all required fields.",
        })
        return
      }

      // Validate password confirmation for new accounts
      if (!isEditing && newAccount.password !== confirmPassword) {
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
          id: editingAccountId,
          username: newAccount.username,
          email: newAccount.email,
          fullName: newAccount.fullName,
          role: newAccount.role,
          employeeId: newAccount.employeeId ? Number(newAccount.employeeId) : undefined,
        }

        // Only include password if it was changed
        if (newAccount.password) {
          accountData.password = newAccount.password
        }

        const response = await accountApi.update(accountData)

        if (!response.success) {
          throw new Error(response.error || "Failed to update account")
        }

        // Update the account in the list
        setAccounts(accounts.map((account) => (account.id === editingAccountId ? response.data!.data! : account)))

        toast({
          title: "Account updated",
          description: `Account for ${newAccount.fullName} has been updated successfully.`,
        })
      } else {
        // Create new account
        const accountData: CreateAccountRequest = {
          ...(newAccount as CreateAccountRequest),
          employeeId: newAccount.employeeId ? Number(newAccount.employeeId) : undefined,
        }

        const response = await accountApi.create(accountData)

        if (!response.success) {
          throw new Error(response.error || "Failed to create account")
        }

        // Add the new account to the list
        setAccounts([...accounts, response.data!.data!])

        toast({
          title: "Account created",
          description: `Account for ${newAccount.fullName} has been created successfully.`,
        })
      }

      setIsAddDialogOpen(false)
      setIsEditing(false)
      setEditingAccountId(null)

      // Reset form
      setNewAccount({
        username: "",
        password: "",
        email: "",
        fullName: "",
        role: "",
        employeeId: undefined,
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

  // Column definitions for the accounts table
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
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }: { row: { original: Account } }) => {
        const account = row.original as Account
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account.id)}>
              <UserCog className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const handleEditAccount = (id: number) => {
    // Find the account to edit
    const accountToEdit = accounts.find((account) => account.id === id)
    if (!accountToEdit) return

    // Set the form values
    setNewAccount({
      username: accountToEdit.username,
      email: accountToEdit.email,
      fullName: accountToEdit.fullName,
      role: accountToEdit.role,
      employeeId: accountToEdit.employeeId || undefined,
      password: "", // Password field is empty when editing
    })

    // Set editing mode
    setIsEditing(true)
    setEditingAccountId(id)
    setIsAddDialogOpen(true)
  }

  const handleDeleteAccount = async (id: number) => {
    try {
      const response = await accountApi.delete(id)

      if (!response.success) {
        throw new Error(response.error || "Failed to delete account")
      }

      // Remove the deleted account from the list
      setAccounts(accounts.filter((account) => account.id !== id))

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
    }
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
                  username: "",
                  password: "",
                  email: "",
                  fullName: "",
                  role: "",
                  employeeId: undefined,
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
                    <Input id="username" name="username" value={newAccount.username} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" name="fullName" value={newAccount.fullName} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={newAccount.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newAccount.role} onValueChange={(value) => handleSelectChange("role", value)}>
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
                      id="password"
                      name="password"
                      type="password"
                      value={newAccount.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID (if applicable)</Label>
                    <Input
                      id="employeeId"
                      name="employeeId"
                      type="number"
                      placeholder="Enter employee ID"
                      value={newAccount.employeeId?.toString() || ""}
                      onChange={(e) => handleInputChange(e)}
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
              searchColumn="username"
              searchPlaceholder="Search by username..."
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

