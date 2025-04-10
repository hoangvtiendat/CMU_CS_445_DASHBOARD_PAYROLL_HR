// Common response type for all API calls
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Authentication types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  data: {
    user: {
      id: number
      username: string
      fullName: string
      email: string
      role: "Employee" | "Hr" | "Payroll" | "Admin"
    }
    token: string
  }

}

// Employee types
export interface Employee {


    EmployeeID: number
    FullName: string
    DateOfBirth: string
    gender: string
    phoneNumber: string
    email: string
    hireDate: string
    departmentId: number
    department: string
    positionId: number
    position: string
    status: string



}

export interface CreateEmployeeRequest {
  fullName: string
  dateOfBirth: string
  gender: string
  phoneNumber: string
  email: string
  hireDate: string
  departmentId: number
  positionId: number
  status: string
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: number
}

// Salary types
export interface Salary {
  id: number
  employeeId: number
  fullName: string
  department: string
  position: string
  baseSalary: number
  bonus: number
  deductions: number
  netSalary: number
  actualSalary: number
  month: string
}

export interface CreateSalaryRequest {
  employeeId: number
  baseSalary: number
  bonus: number
  deductions: number
  month: string
}

export interface UpdateSalaryRequest extends Partial<CreateSalaryRequest> {
  id: number
}

// Department types
export interface Department {
  id: number
  name: string
}

// Position types
export interface Position {
  id: number
  name: string
  departmentId: number
}

// Attendance types
export interface Attendance {
  id: number
  employeeId: number
  workDays: number
  absentDays: number
  leaveDays: number
  attendanceMonth: string
}

// Alert types
export interface Alert {
  id: number
  type: string
  message: string
  date: string
  priority: string
}

// Account types
export interface Account {
  id: number
  fullName: string
  username: string
  email: string
  role: string
  employeeId: number | null
}

export interface CreateAccountRequest {
  username: string
  password: string
  email: string
  fullName: string
  role: string
  employeeId?: number
}

export interface UpdateAccountRequest {
  id: number
  username?: string
  password?: string
  email?: string
  fullName?: string
  role?: string
  employeeId?: number
}

// Dashboard statistics types
export interface EmployeeStats {
  totalEmployees: number
  totalDepartments: number
  employeesByDepartment: { name: string; value: number }[]
  employeesByPosition: { name: string; value: number }[]
  employeesByStatus: { name: string; count: number }[]
}

export interface PayrollStats {
  totalMonthlyPayroll: number
  averageSalary: number
  monthlySalaryByDepartment: {
    name: string
    Engineering: number
    Marketing: number
    Sales: number
    HR: number
  }[]
}

