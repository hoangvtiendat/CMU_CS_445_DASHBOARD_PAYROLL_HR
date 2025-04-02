"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Download, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const employees = [
  {
    id: "EMP001",
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Engineering",
    position: "Senior Developer",
    status: "Full-time",
    startDate: "2020-05-12",
    salary: 95000,
  },
  {
    id: "EMP002",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "Marketing",
    position: "Marketing Manager",
    status: "Full-time",
    startDate: "2019-03-15",
    salary: 85000,
  },
  {
    id: "EMP003",
    name: "Michael Brown",
    email: "michael.brown@company.com",
    department: "Finance",
    position: "Financial Analyst",
    status: "Full-time",
    startDate: "2021-01-10",
    salary: 78000,
  },
  {
    id: "EMP004",
    name: "Emily Davis",
    email: "emily.davis@company.com",
    department: "Human Resources",
    position: "HR Specialist",
    status: "Part-time",
    startDate: "2022-06-20",
    salary: 45000,
  },
  {
    id: "EMP005",
    name: "David Wilson",
    email: "david.wilson@company.com",
    department: "Engineering",
    position: "Frontend Developer",
    status: "Full-time",
    startDate: "2021-08-05",
    salary: 82000,
  },
]

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Employees</h2>
        <div className="flex items-center gap-2">
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>Manage your employees, view details, and update information.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search employees..."
                    className="pl-8 w-[250px] sm:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Department</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Engineering</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Marketing</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Finance</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Human Resources</DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem checked>Full-time</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Part-time</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Contract</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="10">
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Name
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.email}</div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            employee.status === "Full-time"
                              ? "default"
                              : employee.status === "Part-time"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">${employee.salary.toLocaleString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit employee</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete employee</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

