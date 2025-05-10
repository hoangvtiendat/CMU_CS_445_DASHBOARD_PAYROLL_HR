// Common response type for all API calls
export interface ApiResponse<T> {
  success: boolean;
  data: {
    data: T | null;
    status: string;
  };
  error?: string;
}

// Authentication types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {

  user: {
    id: number
    username: string
    fullName: string
    email: string
    role: "Employee" | "Hr" | "Payroll" | "Admin"
  }
  token: string
}

// Employee types
export interface Employee {
  EmployeeID: number
  FullName: string
  DateOfBirth: string
  Gender: string
  PhoneNumber: string
  Email: string
  HireDate: string
  DepartmentId: number
  Department: {
    DepartmentID: number;
  }
  Position: {
    PositionID: number;
  }
  Status: string




}

export interface CreateEmployeeRequest {
  FullName: string
  DateOfBirth: string
  Gender: string
  PhoneNumber: string
  Email: string
  HireDate: string
  Department: {
    DepartmentID: number
  }
  Position: {
    PositionID: number
  }
  Status: string
}

export interface UpdateEmployeeRequest extends Partial<CreateEmployeeRequest> {
  id: number
}

// Salary types
export interface Salary {
  SalaryID: number
  EmployeeID: number
  BaseSalary: number
  Bonus: number
  Deductions: number
  NetSalary: number
  SalaryMonth: Date
  FullName: string
}

export interface CreateSalaryRequest {
  EmployeeID: number
  BaseSalary: number
  Bonus: number
  Deductions: number
  SalaryMonth: string // formatted as "yyyy-MM-dd"
}

export interface UpdateSalaryRequest extends Partial<CreateSalaryRequest> {
  SalaryID: number
}

// Department types
export interface Department {
  DepartmentID: number
  DepartmentName: string
}

// Position types
export interface Position {
  PositionID: number;
  PositionName: string
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
  Id: number
  FullName: string
  Username: string
  Email: string
  Role: string
  Employee: string
  EmployeeID:number
}

export interface CreateAccountRequest {
  Username: string
  Password: string
  FullName: string,
  Email: string
  Role: string
  Employee: string
  EmployeeID: number
}

export interface UpdateAccountRequest {
  Id: number
  Username?: string
  Password?: string
  FullName?: string
  Email?: string
  Role?: string
  Employee: string
}

// Dashboard statistics types
export interface EmployeeStats {
  totalEmployees: number
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

