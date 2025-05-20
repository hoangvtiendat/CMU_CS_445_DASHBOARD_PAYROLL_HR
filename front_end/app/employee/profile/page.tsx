"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { employeeApi } from "@/lib/api"
import type { Employee } from "@/lib/api-types"

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits." })
    .max(15, { message: "Phone number must be at most 15 digits." })
    .regex(/^[0-9+]{10,15}$/, { message: "Phone number must contain only numbers or start with +" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address." }),
})

export default function EmployeeProfile() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  })

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        // In a real app, you would get the current user's ID from the auth context
        const employeeId = Number(localStorage.getItem("employeeID")) // Retrieve employee ID from localStorage or use a default value

        const response = await employeeApi.getById(employeeId)
        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to fetch employee data")
        }
        const employeeData = response.data.data
        setEmployee(response.data.data)
        // Update form values
        if (employeeData) {
          form.reset({
            fullName: employeeData.FullName,
            phoneNumber: employeeData.PhoneNumber,
            email: employeeData.Email,
          })
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "An error occurred while fetching data",
        })
      }
    }

    fetchEmployeeData()
  }, [toast, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const employeeId = Number(localStorage.getItem("employeeID")) // Retrieve employee ID from localStorage or use a default value


      const response = await employeeApi.updateProfile(employeeId, {
        FullName: values.fullName,
        PhoneNumber: values.phoneNumber,
        Email: values.email,
      })

      if (!response.success) {
        throw new Error(response.error || "Failed to update profile")
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout role="employee" userName={employee?.FullName || "John Doe"}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">View and update your personal information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here. These details will be used for communications and payroll.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Read-Only Information</CardTitle>
            <CardDescription>This information can only be updated by HR.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-medium">Date of Birth</h3>
                <p className="text-muted-foreground">{employee?.DateOfBirth || "15 May 1985"}</p>
              </div>
              <div>
                <h3 className="font-medium">Gender</h3>
                <p className="text-muted-foreground">{employee?.Gender || "Male"}</p>
              </div>
              <div>
                <h3 className="font-medium">Hire Date</h3>
                <p className="text-muted-foreground">{employee?.HireDate || "10 Jan 2020"}</p>
              </div>
              <div>
                <h3 className="font-medium">Department</h3>
                <p className="text-muted-foreground">{employee?.Department.DepartmentName || "Engineering"}</p>
              </div>
              <div>
                <h3 className="font-medium">Position</h3>
                <p className="text-muted-foreground">{employee?.Position.PositionName || "Software Developer"}</p>
              </div>
              <div>
                <h3 className="font-medium">Status</h3>
                <p className="text-muted-foreground">{employee?.Status || "Active"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

