import React, { ReactNode } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DashboardLayoutProps {
  children: ReactNode
  role: "employee" | "hr" | "payroll" | "admin"
  userName: string
}

export function DashboardLayout({ children, role, userName }: DashboardLayoutProps) {
  // const router = useRouter()

  // const token = localStorage.getItem("token")  // Lấy token từ localStorage
  // const realRole = role  // Lấy role từ localStorage (nếu đã lưu)

  // if (!token) {
  //   router.push("/")  // Nếu không có token hoặc role không phải Admin, chuyển hướng về trang login
  //   return
  // }

  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/")  // Nếu không có token → redirect
    } else {
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) return null // Hoặc loading spinner nếu thích

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Header userName={userName} role={role} />
        <main className="flex-1 bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  )
}

// Removed conflicting local useEffect declaration

