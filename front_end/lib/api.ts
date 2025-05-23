import { send } from "process"
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Salary,
  CreateSalaryRequest,
  UpdateSalaryRequest,
  Department,
  Position,
  Attendance,
  Alert,
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  EmployeeStats,
  PayrollStats,
  InformationEmployee
} from "./api-types"

// Base API URL - replace with your actual API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json()
    return {
      success: false,
      data: { data: null, status: "error" },
      error: errorData.message || "An error occurred",
    }
  }

  const data = await response.json()
  return {
    success: true,
    data,
  }
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  body?: any,
  headers: HeadersInit = {},
): Promise<ApiResponse<T>> {
  try {
    // Get token from localStorage
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (token) {
      (requestHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
    }

    if (body) {
      requestOptions.body = JSON.stringify(body)
    }

    const response = await fetch(`${API_URL}${endpoint}`, requestOptions)
    return handleResponse<T>(response)
  } catch (error) {
    return {
      success: false,
      data: { data: null, status: "error" },
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Authentication APIs
export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<LoginResponse>> =>
    apiRequest<LoginResponse>("/auth/login", "POST", data),

  logout: (id: number): Promise<ApiResponse<null>> => apiRequest<null>(`/auth/logout/${id}`, "POST"),

  getCurrentUser: (): Promise<ApiResponse<LoginResponse>> => apiRequest<LoginResponse>("/auth/me"),
}

// Employee APIs
export const employeeApi = {
  getAll: (): Promise<ApiResponse<Employee[]>> => apiRequest<Employee[]>("/employees"),
  status: (): Promise<ApiResponse<EmployeeStats>> => apiRequest<EmployeeStats>("/employees/status"),
  getById: (id: number): Promise<ApiResponse<Employee>> => apiRequest<Employee>(`/employees/${id}`),
  getInformationEmployee: (id: number): Promise<ApiResponse<InformationEmployee>> => apiRequest<InformationEmployee>(`/employees/information/${id}`),
  create: (data: CreateEmployeeRequest): Promise<ApiResponse<Employee>> =>
    apiRequest<Employee>("/employees", "POST", data),

  update: (data: UpdateEmployeeRequest): Promise<ApiResponse<Employee>> =>
    apiRequest<Employee>(`/employees/${data.id}`, "PUT", data),

  delete: (id: number): Promise<ApiResponse<null>> => apiRequest<null>(`/employees/${id}`, "DELETE"),

  updateProfile: (id: number, data: Partial<Employee>): Promise<ApiResponse<Employee>> =>
    apiRequest<Employee>(`/employees/${id}`, "PUT", data),

  checkin: (id: number): Promise<ApiResponse<Employee>> =>
    apiRequest<Employee>(`/attendance/checkin/${id}`, "POST",),

}

// Salary APIs
export const salaryApi = {
  getAll: (month?: string): Promise<ApiResponse<Salary[]>> =>
    apiRequest<Salary[]>(`/salaries${month ? `?month=${month}` : ""}`),

  getByEmployeeId: (employeeId: number): Promise<ApiResponse<Salary[]>> =>
    apiRequest<Salary[]>(`/salaries/employee/${employeeId}`),

  getById: (id: number): Promise<ApiResponse<Salary>> => apiRequest<Salary>(`/salaries/${id}`),

  create: (data: CreateSalaryRequest): Promise<ApiResponse<Salary>> => apiRequest<Salary>("/salaries", "POST", data),

  update: (data: UpdateSalaryRequest): Promise<ApiResponse<Salary>> =>
    apiRequest<Salary>(`/salaries/${data.SalaryID}`, "PUT", data),

  delete: (id: number): Promise<ApiResponse<null>> => apiRequest<null>(`/salaries/${id}`, "DELETE"),
}

// Department APIs
export const departmentApi = {
  getAll: (): Promise<ApiResponse<Department[]>> => apiRequest<Department[]>("/departments"),

  getById: (id: number): Promise<ApiResponse<Department>> => apiRequest<Department>(`/departments/${id}`),

  getCount: (): Promise<ApiResponse<Department>> => apiRequest<Department>("/departments/count")
}


// Position APIs
export const positionApi = {
  getAll: (): Promise<ApiResponse<Position[]>> => apiRequest<Position[]>("/positions"),

  getByDepartmentId: (departmentId: number): Promise<ApiResponse<Position[]>> =>
    apiRequest<Position[]>(`/positions/department/${departmentId}`),

  getById: (id: number): Promise<ApiResponse<Position>> => apiRequest<Position>(`/positions/${id}`),
}

// Attendance APIs
export const attendanceApi = {
  getByEmployeeId: (employeeId: number): Promise<ApiResponse<Attendance[]>> =>
    apiRequest<Attendance[]>(`/attendance/employee/${employeeId}`),

  getByMonth: (month: string): Promise<ApiResponse<Attendance[]>> =>
    apiRequest<Attendance[]>(`/attendance?month=${month}`),

  getAll: (): Promise<ApiResponse<Attendance[]>> => apiRequest<Attendance[]>("/attendance"),




}

// Alert APIs
export const alertApi = {
  getAll: (): Promise<ApiResponse<Alert[]>> => apiRequest<Alert[]>("/alerts"),
  sendMail: (id: number, data: string): Promise<ApiResponse<string>> => apiRequest<string>("/alerts/sendMail", "POST", { id, data }),
  getByType: (type: string): Promise<ApiResponse<Alert[]>> => apiRequest<Alert[]>(`/alerts?type=${type}`),
}

// Account APIs
export const accountApi = {
  getAll: (): Promise<ApiResponse<Account[]>> => apiRequest<Account[]>("/auth"),

  getById: (id: number): Promise<ApiResponse<Account>> => apiRequest<Account>(`/accounts/${id}`),

  create: (data: CreateAccountRequest): Promise<ApiResponse<Account>> => apiRequest<Account>("/auth/register", "POST", data),

  update: (data: UpdateAccountRequest): Promise<ApiResponse<Account>> =>
    apiRequest<Account>(`/auth/${data.Id}`, "PUT", data),

  delete: (id: number): Promise<ApiResponse<null>> => apiRequest<null>(`/auth/${id}`, "DELETE"),
}

// Dashboard statistics APIs
export const dashboardApi = {
  getEmployeeStats: (): Promise<ApiResponse<EmployeeStats>> => apiRequest<EmployeeStats>("/employees/status"),

  getPayrollStats: (): Promise<ApiResponse<PayrollStats>> => apiRequest<PayrollStats>("/salaries/dashboard/status"),
}

