
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { Salary } from '../../model/mysql/salary.entity';
import { salaryRepository } from './payrollRepository';
import { errorMonitor } from 'events';




export const PayrollService = {

    status: async (): Promise<ServiceResponse<{ totalMonthlyPayroll: number, averageSalary: number, monthlySalaryByDepartment: { name: string, Engineering: number, Marketing: number, Sales: number, HR: number }[] } | null>> => {
        try {
            const status = await salaryRepository.status() as { totalMonthlyPayroll: number, averageSalary: number, monthlySalaryByDepartment: { name: string, Engineering: number, Marketing: number, Sales: number, HR: number }[] } | null;
            return new ServiceResponse<{ totalMonthlyPayroll: number, averageSalary: number, monthlySalaryByDepartment: { name: string, Engineering: number, Marketing: number, Sales: number, HR: number }[] }>(
                ResponseStatus.Success,
                'status ok',
                status ?? { totalMonthlyPayroll: 0, averageSalary: 0, monthlySalaryByDepartment: [{ name: '', Engineering: 0, Marketing: 0, Sales: 0, HR: 0 }] },
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching payroll status: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getById: async (id: number): Promise<ServiceResponse<Salary | null>> => {
        try {
            const salary = await salaryRepository.getById(id);
            if (!salary) {
                throw new Error("This user does not exist")
            }
            return new ServiceResponse<Salary | null>(
                ResponseStatus.Success,
                'get salary by id successfull',
                salary,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching get salary by id: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    getByIdEmployee: async (id: number): Promise<ServiceResponse<Salary[] | null>> => {
        try {
            const salary = await salaryRepository.getByIdEmployee(id);
            if (!salary) {
                throw new Error("This user does not exist")
            }
            return new ServiceResponse<Salary[] | null>(
                ResponseStatus.Success,
                'get salary by id employee successfull',
                salary,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching get salary by id employee: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },
    getSalaryByMonth: async (month: number, year: number): Promise<ServiceResponse<Salary[] | null>> => {
        try {
            const result = await salaryRepository.getSalaryByMonth(month, year);
            return new ServiceResponse<Salary[]>(
                ResponseStatus.Success,
                'get salary successfull',
                result ?? [],
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error fetching get salary by month: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    create: async (data: Partial<Salary>): Promise<ServiceResponse<Salary | null>> => {
        try {
            if (data.BaseSalary == undefined || data.BaseSalary == null || data.Bonus == undefined || data.Bonus == null || data.SalaryMonth == null || data.SalaryMonth == undefined || data.Deductions == null || data.Deductions == undefined) {
                throw new Error("Please fill data!");
            }

            if (!data.EmployeeID) {
                throw new Error("Please choose Employee")
            }
            const newSalaryRecord = await salaryRepository.create(data);
            if (!newSalaryRecord) {
                throw new Error("Error create salary record");
            }
            return new ServiceResponse<Salary>(
                ResponseStatus.Success,
                'create salary record successfull',
                newSalaryRecord ?? null,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error creating salary record: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    },

    update: async (id: number, data: Partial<Salary>): Promise<ServiceResponse<Salary | null>> => {
        try {
            if (data.BaseSalary == undefined || data.BaseSalary == null || data.Bonus == undefined || data.Bonus == null || data.SalaryMonth == null || data.SalaryMonth == undefined || data.Deductions == null || data.Deductions == undefined) {
                throw new Error("Please fill data!");
            }
            if (!id) {
                throw new Error("Please choose record")
            }

            const salaryUpdate = await salaryRepository.update(id, data);
            return new ServiceResponse<Salary | null>(
                ResponseStatus.Success,
                'updating salary record successfull',
                salaryUpdate,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error creating salary record: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

    },

    delete: async (id: number): Promise<ServiceResponse<string>> => {
        try {
            const salaryDelete: string = await salaryRepository.delete(id);
            return new ServiceResponse<string>(
                ResponseStatus.Success,
                'deleting salary record successful',
                salaryDelete,
                StatusCodes.OK
            );
        } catch (error) {
            const errorMessage = `Error deleting salary record: ${(error as Error).message}`;
            return new ServiceResponse(
                ResponseStatus.Failed,
                errorMessage,
                'delete failed',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

}


