import { LoginForm } from "@/components/login-form"

export default function Home() {
  // In a real application, you would check if the user is already authenticated
  // and redirect them to their appropriate dashboard
  // For now, we'll just show the login form

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full business-gradient flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-business-dark">HR & Payroll System</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to access your dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

