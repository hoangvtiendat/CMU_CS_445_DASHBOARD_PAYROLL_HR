"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

interface HeaderProps {
  userName: string
  role: string
}

export function Header({ userName, role }: HeaderProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState(3)

  const handleLogout = async () => {
    try {
      // Make a POST request to your logout API endpoint using fetch
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You might need to include authorization headers if your logout API requires it
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        // You might need to send a body depending on your backend implementation
        // body: JSON.stringify({}),
      });

      if (response.ok) {
        // Clear any stored tokens (localStorage, cookies, etc.)
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken'); // If you are using refresh tokens

        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });

        // Redirect the user to the login page
        router.push("/login"); // Adjust the route as needed
      } else {
        const errorData = await response.json();
        toast({
          title: "Logout failed",
          description: errorData?.message || "An error occurred during logout.",
          variant: "destructive",
        });
        console.error("Logout failed:", response.status, errorData);
      }
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: "Network error or failed to connect to the server.",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
      <div className="ml-auto flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5 text-business-gray" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-business-danger text-xs text-white">
              {notifications}
            </span>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-business-primary/20">
              <User className="h-4 w-4 text-business-primary" />
              <span className="hidden sm:inline-block">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4 text-business-primary" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-business-danger" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}