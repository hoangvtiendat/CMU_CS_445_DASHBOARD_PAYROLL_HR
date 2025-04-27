
import {
    ServiceResponse,
    ResponseStatus,
} from '../services/serviceResponse';
import { StatusCodes } from 'http-status-codes';
import { Salary } from '../../model/mysql/salary.entity';
import { salaryRepository } from './payrollRepository';




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
    }

}


