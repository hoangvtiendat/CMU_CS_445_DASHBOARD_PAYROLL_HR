"use client"

import { useState } from "react"
import { Calendar, Download, FileText, PieChart, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function ReportsPage() {
  const [date, setDate] = useState<Date>()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
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
        </div>
      </div>
      <Tabs defaultValue="hr">
        <TabsList>
          <TabsTrigger value="hr">HR Reports</TabsTrigger>
          <TabsTrigger value="payroll">Payroll Reports</TabsTrigger>
          <TabsTrigger value="shareholder">Shareholder Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="hr" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employee Count Report</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Detailed breakdown of employees by department and employment status.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Distribution</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Visual representation of employee distribution across departments.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Employment Status Report</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Analysis of full-time, part-time, and contract employee distribution.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Custom HR Report</CardTitle>
              <CardDescription>Generate a custom HR report with specific parameters.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label>Report Type</Label>
                  <RadioGroup defaultValue="employee-count" className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="employee-count" id="employee-count" className="peer sr-only" />
                      <Label
                        htmlFor="employee-count"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Users className="mb-3 h-6 w-6" />
                        Employee Count
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="department-distribution"
                        id="department-distribution"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="department-distribution"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <PieChart className="mb-3 h-6 w-6" />
                        Department Distribution
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="employment-status" id="employment-status" className="peer sr-only" />
                      <Label
                        htmlFor="employment-status"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Users className="mb-3 h-6 w-6" />
                        Employment Status
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="grid gap-3">
                  <Label>Time Period</Label>
                  <Select defaultValue="current-month">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Current Month</SelectItem>
                      <SelectItem value="previous-month">Previous Month</SelectItem>
                      <SelectItem value="current-quarter">Current Quarter</SelectItem>
                      <SelectItem value="previous-quarter">Previous Quarter</SelectItem>
                      <SelectItem value="current-year">Current Year</SelectItem>
                      <SelectItem value="previous-year">Previous Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label>Include in Report</Label>
                  <div className="grid gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="charts" defaultChecked />
                      <label
                        htmlFor="charts"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Charts and Graphs
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="tables" defaultChecked />
                      <label
                        htmlFor="tables"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Data Tables
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="summary" defaultChecked />
                      <label
                        htmlFor="summary"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Executive Summary
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Generate Custom Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="payroll" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Salary Report</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Detailed breakdown of monthly salaries for all employees.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payroll Fund Report</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Total payroll fund allocation and expense calculation.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Salary Report</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Salary breakdown by department with comparative analysis.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="shareholder" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quarterly Profit Report</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Quarterly profit allocation based on revenue and expenses.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Annual Profit Report</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Annual profit allocation with year-over-year comparison.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shareholder Distribution</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="py-4">
                <div className="text-sm text-muted-foreground">
                  Profit distribution among shareholders with detailed breakdown.
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

