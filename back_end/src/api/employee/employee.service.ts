import { employeeRepository } from './employeeRepository';
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';

export const EmployeeService = {

    getAll: async (): Promise<ServiceResponse<MySQLEmployee[] | MSSQLEmployee[] | null>> => {
        try {
            const users = await employeeRepository.getAll();
            return new ServiceResponse<MySQLEmployee[] | MSSQLEmployee[] | null>(
                ResponseStatus.Success,
                'User found',
                users ?? [],
                StatusCodes.OK
            )
        } catch (ex) { 
            const errorMessage = `Error get Employee user: ${(ex as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    status: async (): Promise<ServiceResponse<{ totalEmployees: number; employeesByDepartment: any; employeesByPosition: any; employeesByStatus: any } | null>> => {
        try {
            const status = await employeeRepository.status();
            return new ServiceResponse<{ totalEmployees: number; employeesByDepartment: any; employeesByPosition: any; employeesByStatus: any }>(
                ResponseStatus.Success,
                'status ok',
                status ?? { totalEmployees: 0, employeesByDepartment: {}, employeesByPosition: {}, employeesByStatus: {} },
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching employee status: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (id: number, data: Partial<MySQLEmployee | MSSQLEmployee>): Promise<ServiceResponse<MySQLEmployee | MSSQLEmployee | null>> => {
        try {
            const updatedEmployee = await employeeRepository.updateUserAsync(id, data);
            return new ServiceResponse<MySQLEmployee | MSSQLEmployee | null>(
                ResponseStatus.Success,
                'Employee updated successfully',
                updatedEmployee ?? null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error updating employee: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    create: async (data: Partial<MSSQLEmployee>): Promise<ServiceResponse<MSSQLEmployee | MySQLEmployee | null>> => {
        try {

            if (!data.Email) {
                throw new Error("Email is required to create an employee");
            }
            const checkEmployeeByEmail = await employeeRepository.findByEmail(data.Email);
            if (checkEmployeeByEmail) {
                throw new Error("Someone has already used this email")
            }

            if (!data.PhoneNumber) {
                throw new Error("PhoneNumber is required to create an employee")
            }
            const checkEmployeeByPhoneNumber = await employeeRepository.findByPhonNumber(data.PhoneNumber)
            if (checkEmployeeByPhoneNumber) {
                throw new Error("Someone has already used this phone number")
            }
            const newEmployee = await employeeRepository.createUserAsync(data);
            if (!newEmployee) {
                throw new Error("Error create employee")
            }
            console.log("new employee:", newEmployee)
            return new ServiceResponse<MSSQLEmployee | MySQLEmployee | null>(
                ResponseStatus.Success,
                'Employee created successfully',
                newEmployee ?? null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error creating employee: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

delete: async (id: number): Promise<ServiceResponse<null>> => {
        try {
            const deleteResult = await employeeRepository.deleteUserAsync(id);
            if (!deleteResult) {
                throw new Error("Employee not found or could not be deleted");
            }
            return new ServiceResponse<null>(
                ResponseStatus.Success,
                'Employee deleted successfully',
                null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error deleting employee: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}


