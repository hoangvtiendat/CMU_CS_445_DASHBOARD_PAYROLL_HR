"use client"

import { useState } from "react"
import { Calendar, Download, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DepartmentPayroll } from "@/components/department-payroll"

const payrollData = [
  {
    id: "PR001",
    period: "April 2023",
    totalEmployees: 1248,
    grossPayroll: 1423500,
    taxes: 356000,
    netPayroll: 1067500,
    status: "Processed",
    processDate: "2023-04-30",
  },
  {
    id: "PR002",
    period: "March 2023",
    totalEmployees: 1236,
    grossPayroll: 1389000,
    taxes: 347250,
    netPayroll: 1041750,
    status: "Processed",
    processDate: "2023-03-31",
  },
  {
    id: "PR003",
    period: "February 2023",
    totalEmployees: 1225,
    grossPayroll: 1375000,
    taxes: 343750,
    netPayroll: 1031250,
    status: "Processed",
    processDate: "2023-02-28",
  },
  {
    id: "PR004",
    period: "January 2023",
    totalEmployees: 1210,
    grossPayroll: 1350000,
    taxes: 337500,
    netPayroll: 1012500,
    status: "Processed",
    processDate: "2023-01-31",
  },
]

export default function PayrollPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Payroll</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Payroll
          </Button>
        </div>
      </div>
      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="department">Department Breakdown</TabsTrigger>
          <TabsTrigger value="employee">Employee Payroll</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>View and manage payroll records for all pay periods.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search payroll records..."
                        className="pl-8 w-[250px] sm:w-[300px]"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Period</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Gross Payroll</TableHead>
                        <TableHead>Taxes</TableHead>
                        <TableHead>Net Payroll</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Process Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payrollData.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>{record.period}</TableCell>
                          <TableCell>{record.totalEmployees}</TableCell>
                          <TableCell>${record.grossPayroll.toLocaleString()}</TableCell>
                          <TableCell>${record.taxes.toLocaleString()}</TableCell>
                          <TableCell>${record.netPayroll.toLocaleString()}</TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                                record.status === "Processed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800",
                              )}
                            >
                              {record.status}
                            </div>
                          </TableCell>
                          <TableCell>{record.processDate}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Payroll Breakdown</CardTitle>
              <CardDescription>View payroll distribution across departments.</CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentPayroll />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="employee" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Payroll Details</CardTitle>
              <CardDescription>View and manage individual employee payroll information.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search employees..." className="pl-8 w-[250px] sm:w-[300px]" />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Base Salary</TableHead>
                        <TableHead>Bonus</TableHead>
                        <TableHead>Deductions</TableHead>
                        <TableHead>Net Pay</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">John Smith</div>
                          <div className="text-sm text-muted-foreground">EMP001</div>
                        </TableCell>
                        <TableCell>Engineering</TableCell>
                        <TableCell>Senior Developer</TableCell>
                        <TableCell>$7,916.67</TableCell>
                        <TableCell>$1,000.00</TableCell>
                        <TableCell>$2,229.17</TableCell>
                        <TableCell>$6,687.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Sarah Johnson</div>
                          <div className="text-sm text-muted-foreground">EMP002</div>
                        </TableCell>
                        <TableCell>Marketing</TableCell>
                        <TableCell>Marketing Manager</TableCell>
                        <TableCell>$7,083.33</TableCell>
                        <TableCell>$500.00</TableCell>
                        <TableCell>$1,895.83</TableCell>
                        <TableCell>$5,687.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <div className="font-medium">Michael Brown</div>
                          <div className="text-sm text-muted-foreground">EMP003</div>
                        </TableCell>
                        <TableCell>Finance</TableCell>
                        <TableCell>Financial Analyst</TableCell>
                        <TableCell>$6,500.00</TableCell>
                        <TableCell>$750.00</TableCell>
                        <TableCell>$1,812.50</TableCell>
                        <TableCell>$5,437.50</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

