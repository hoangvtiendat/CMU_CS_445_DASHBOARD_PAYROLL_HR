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
      localStorage.setItem("token", response.data.data.token)

      console.log("respon: ", response)
      // Redirect based on role
      const { role } = response.data.data.user
      console.log("role: ", role)
      if (role === "Employee") {
        router.push("/employee/dashboard")
      } else if (role === "Hr") {
        router.push("/hr/dashboard")
      } else if (role === "Payroll") {
        router.push("/payroll/dashboard")
      } else if (role === "Admin") {
        router.push("/admin/dashboard")
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.data.user.fullName}!`,
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
  const handleDemoLogin = (role: string) => {
    form.setValue("username", role)
    form.setValue("password", "password123")
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
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Demo accounts:</p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("employee")}
            className="border-business-primary/30 text-business-primary hover:bg-business-primary/10"
          >
            Employee
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("hr")}
            className="border-business-secondary/30 text-business-secondary hover:bg-business-secondary/10"
          >
            HR Manager
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("payroll")}
            className="border-business-accent/30 text-business-accent hover:bg-business-accent/10"
          >
            Payroll
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDemoLogin("admin")}
            className="border-business-dark/30 text-business-dark hover:bg-business-dark/10"
          >
            Admin
          </Button>
        </div>
        <p className="mt-2">Use any password (min 6 characters)</p>
      </div>
    </Form>
  )
}

