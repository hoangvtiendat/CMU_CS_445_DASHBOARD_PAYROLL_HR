
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { Salary } from '../../model/mysql/salary.entity';



const mysqlRepository = MySQLDataSource.getRepository(Salary);
type SalaryWithEmployee = Salary & { FullName: string };

export const salaryRepository = {

    async status(): Promise<{ totalMonthlyPayroll: number, averageSalary: number, monthlySalaryByDepartment: { name: string, Marketing: number, TechnologyInformation: number, Sales: number }[] } | null> {
        console.log(0)
        const totalMonthly = await mysqlRepository
            .createQueryBuilder('salary')
            .select('SUM(salary.BaseSalary + salary.Bonus - salary.Deductions)', 'totalSalary')
            .where('MONTH(salary.SalaryMonth) = MONTH(CURRENT_DATE)')
            .andWhere('YEAR(salary.SalaryMonth) = YEAR(CURRENT_DATE)')
            .getRawOne()

        const totalMonthlyPayroll = Number(totalMonthly?.totalSalary || 0);

        console.log("totalMonthlyPayroll", totalMonthly)
        const average = await mysqlRepository
            .createQueryBuilder('salary')
            .select('AVG(salary.BaseSalary + salary.Bonus - salary.Deductions)', 'averageSalary')
            .where('MONTH(salary.SalaryMonth) = MONTH(CURRENT_DATE)')
            .andWhere('YEAR(salary.SalaryMonth) = YEAR(CURRENT_DATE)')
            .getRawOne();

        const averageSalary = Number(average?.averageSalary || 0);
        console.log(2)
        const monthlySalaryByDepartmentRaw = await mysqlRepository
            .createQueryBuilder('salary')
            .innerJoin('employees', 'employee', 'salary.EmployeeID = employee.EmployeeID')
            .innerJoin('departments', 'department', 'employee.DepartmentID = department.DepartmentID')
            .select('DATE_FORMAT(salary.SalaryMonth, "%b")', 'month') // lấy tháng ngắn gọn: Jan, Feb, Mar,...
            .addSelect('department.DepartmentName', 'department')
            .addSelect('SUM(salary.BaseSalary + salary.Bonus - salary.Deductions)', 'totalSalary')
            .where('YEAR(salary.SalaryMonth) = YEAR(CURRENT_DATE())')
            .groupBy('month')
            .addGroupBy('department')
            .orderBy('MIN(salary.SalaryMonth)', 'ASC')
            .getRawMany();

        console.log(3)
        // Biến đổi dữ liệu để ra dạng yêu cầu
        const monthlySalaryByDepartment = [];

        const monthMap = new Map();

        for (const record of monthlySalaryByDepartmentRaw) {
            const { month, department, totalSalary } = record;

            if (!monthMap.has(month)) {
                monthMap.set(month, {
                    name: month,
                    Marketing: 0,
                    TechnologyInformation: 0,
                    Sales: 0,
                });
            }

            const monthData = monthMap.get(month);

            if (department === 'Marketing') {
                monthData.Marketing = Number(totalSalary);
            } else if (department === 'Technology Information') {
                monthData.TechnologyInformation = Number(totalSalary);
            } else if (department === 'Sales') {
                monthData.Sales = Number(totalSalary);
            }

            monthMap.set(month, monthData);
        }

        monthlySalaryByDepartment.push(...monthMap.values());

        return {
            totalMonthlyPayroll,
            averageSalary,
            monthlySalaryByDepartment
        };

    },

    async getSalaryByMonth(month: number, year: number): Promise<SalaryWithEmployee[] | null> {
        const salaries = await mysqlRepository
            .createQueryBuilder('salary')
            .innerJoin('employees', 'employee', 'salary.EmployeeID = employee.EmployeeID')
            .select([
                'salary.SalaryID AS SalaryID',
                'salary.EmployeeID AS EmployeeID',
                'salary.SalaryMonth AS SalaryMonth',
                'salary.BaseSalary AS BaseSalary',
                'salary.Bonus AS Bonus',
                'salary.Deductions AS Deductions',
                'employee.FullName AS FullName', // Lấy tên nhân viên từ bảng employees
            ])
            .where('MONTH(salary.SalaryMonth) = :month', { month })
            .andWhere('YEAR(salary.SalaryMonth) = :year', { year })
            .getRawMany<SalaryWithEmployee>(); // Sử dụng generic để chỉ định kiểu trả về
    
        return salaries.length > 0 ? salaries : null;
    }




};
