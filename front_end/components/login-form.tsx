"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { authApi } from "@/lib/api"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Call the login API
      const response = await authApi.login({
        username: values.username,
        password: values.password,
      })
      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed")
      }
      // Store token in localStorage
      if (response.data.data) {
        localStorage.setItem("token", response.data.data.token)
        localStorage.setItem("employeeID", response.data.data.Employee.EmployeeID);
        

      }
      // Redirect based on role
      const role = response.data.data?.Role
      if (role === "Employee") {
        router.push("/employee/dashboard")
      } else if (role === "HR Manager") {
        router.push("/hr/dashboard")
      } else if (role === "Payroll Manager") {
        router.push("/payroll/dashboard")
      } else if (role === "Admin") {
        router.push("/admin/dashboard")
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.data?.Employee.FullName || "User"}!`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes only - in a real app, this would be removed
  const handleDemoLoginAdmin = (role: string) => {
    form.setValue("username", 'admin')
    form.setValue("password", '123456')
  }

  const handleDemoLoginEmployee = (role: string) => {
    form.setValue("username", 'employee')
    form.setValue("password", '123456')
  }

  const handleDemoLoginHR = (role: string) => {
    form.setValue("username", 'hrhrhr')
    form.setValue("password", '123456')
  }

  const handleDemoLoginPayroll = (role: string) => {
    form.setValue("username", 'payroll')
    form.setValue("password", '123456')
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-business-primary hover:bg-business-highlight" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
     
    </Form>
  )
}

