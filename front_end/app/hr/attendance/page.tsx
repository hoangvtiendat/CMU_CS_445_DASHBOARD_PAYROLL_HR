"use client"

import React, { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { employeeApi, departmentApi, positionApi, attendanceApi } from "@/lib/api"
import type { Department, Position, CreateEmployeeRequest, Attendance } from "@/lib/api-types"

export default function EmployeesPage() {
    const { toast } = useToast()
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [departments, setDepartments] = useState<Department[]>([])
    const [positions, setPositions] = useState<Position[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterDate, setFilterDate] = useState<string>("")

    const [newEmployee, setNewEmployee] = useState<Partial<CreateEmployeeRequest>>({
        FullName: "",
        DateOfBirth: "",
        Gender: "",
        PhoneNumber: "",
        Email: "",
        HireDate: new Date().toISOString().split("T")[0],
        Department: { DepartmentID: 1 },
        Position: { PositionID: 1 },
        Status: "Active",
    })

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const attendancesResponse = await attendanceApi.getAll()
                if (!attendancesResponse.success || !attendancesResponse.data) {
                    throw new Error(attendancesResponse.error || "Failed to fetch attendance")
                }
                setAttendances(attendancesResponse.data.data ?? [])

                const departmentsResponse = await departmentApi.getAll()
                if (!departmentsResponse.success || !departmentsResponse.data) {
                    throw new Error(departmentsResponse.error || "Failed to fetch departments")
                }
                setDepartments(departmentsResponse.data?.data ?? [])

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
        setNewEmployee((prev) => {
            switch (name) {
                case "FullName":
                case "DateOfBirth":
                case "Gender":
                case "PhoneNumber":
                case "Email":
                case "HireDate":
                case "Status":
                    return { ...prev, [name]: value }
                case "Department.DepartmentID":
                    return { ...prev, Department: { ...prev.Department, DepartmentID: Number(value) } }
                case "Position.PositionID":
                    return { ...prev, Position: { ...prev.Position, PositionID: Number(value) } }
                default:
                    return prev
            }
        })
    }

    // Lọc attendance theo ngày
    const filteredAttendances = filterDate
        ? attendances.filter(a =>
            a.AttendanceMonth &&
            new Date(a.AttendanceMonth).toISOString().slice(0, 10) === filterDate
        )
        : attendances

    const columns = [
        {
            accessorKey: "index",
            header: "ID",
            cell: ({ row }: { row: { index: number } }) => row.index + 1,
        },
        {
            accessorKey: "Employee.FullName",
            id: "Employee.FullName",
            header: "Full Name",
        },
        {
            accessorKey: "AttendanceMonth",
            header: "Attendance Month",
        },
        {
            accessorKey: "WorkDays",
            header: "Work Days",
        },
        {
            accessorKey: "AbsentDays",
            header: "Absent Days",
        },
        {
            accessorKey: "LeaveDays",
            header: "Leave Days",
        },
        {
            accessorKey: "Employee.Status",
            id: "Employee.Status",
            header: "Status",
            cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
                const status = row.getValue("Employee.Status") as string
                return (
                    <div className="flex items-center">
                        <span
                            className={`mr-2 h-2 w-2 rounded-full ${status === "Active" ? "bg-green-500" : status === "Pending" ? "bg-yellow-500" : "bg-red-500"
                                }`}
                        />
                        {status}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: () => (
                <div className="flex items-center gap-2">
                    {/* Action buttons can be added here */}
                </div>
            ),
        },
    ]

    return (
        <DashboardLayout role="hr" userName="Human Resources">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
                        <p className="text-muted-foreground">Manage attendance information</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Input
                            type="date"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                            className="w-[180px]"
                            placeholder="Filter by date"
                        />
                        <Dialog
                            open={isAddDialogOpen}
                            onOpenChange={(open) => {
                                setIsAddDialogOpen(open)
                                if (!open) {
                                    setNewEmployee({
                                        FullName: "",
                                        DateOfBirth: "",
                                        Gender: "",
                                        PhoneNumber: "",
                                        Email: "",
                                        HireDate: new Date().toISOString().split("T")[0],
                                        Department: { DepartmentID: 1 },
                                        Position: { PositionID: 1 },
                                        Status: "Active",
                                    })
                                }
                            }}
                        >
                            <DialogTrigger asChild>
                                {/* <Button>
                                    Add Employee
                                </Button> */}
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                    {/* <DialogTitle>Add New Employee</DialogTitle> */}
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
                                                    <SelectItem value="Active">ACTIVE</SelectItem>
                                                    <SelectItem value="Pending">PENDING</SelectItem>
                                                    <SelectItem value="Locked">LOCKED</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    {/* <Button>Add Employee</Button> */}
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Attendance List</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable<Attendance, unknown>
                            columns={columns}
                            data={filteredAttendances}
                            searchColumn="Employee.FullName"
                            searchPlaceholder="Search by name..."
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

