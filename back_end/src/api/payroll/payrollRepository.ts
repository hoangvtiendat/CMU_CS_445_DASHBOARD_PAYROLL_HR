
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { Salary } from '../../model/mysql/salary.entity';



const mysqlRepository = MySQLDataSource.getRepository(Salary);
type SalaryWithEmployee = Salary & { FullName: string } & { PosisitonName: string } & { DepartmentName: string };

export const salaryRepository = {

    async status(): Promise<{ totalMonthlyPayroll: number, averageSalary: number, monthlySalaryByDepartment: { name: string, Marketing: number, TechnologyInformation: number, Sales: number }[] } | null> {

        const totalMonthly = await mysqlRepository
            .createQueryBuilder('salary')
            .select('SUM(salary.BaseSalary + salary.Bonus - salary.Deductions)', 'totalSalary')
            .where('MONTH(salary.SalaryMonth) = MONTH(CURRENT_DATE)')
            .andWhere('YEAR(salary.SalaryMonth) = YEAR(CURRENT_DATE)')
            .getRawOne()

        const totalMonthlyPayroll = Number(totalMonthly?.totalSalary || 0);

        const average = await mysqlRepository
            .createQueryBuilder('salary')
            .select('AVG(salary.BaseSalary + salary.Bonus - salary.Deductions)', 'averageSalary')
            .where('MONTH(salary.SalaryMonth) = MONTH(CURRENT_DATE)')
            .andWhere('YEAR(salary.SalaryMonth) = YEAR(CURRENT_DATE)')
            .getRawOne();

        const averageSalary = Number(average?.averageSalary || 0);

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
                'ROUND(salary.BaseSalary, 0) AS BaseSalary',
                'ROUND(salary.Bonus, 0) AS Bonus',
                'ROUND(salary.Deductions, 0) AS Deductions',
                'ROUND(salary.BaseSalary + salary.Bonus - salary.Deductions, 0) AS NetSalary', 'employee.FullName AS FullName', // Lấy tên nhân viên từ bảng employees
            ])
            .innerJoin('positions', 'position', 'employee.PositionID = position.PositionID')
            .innerJoin('departments', 'department', 'employee.DepartmentID = department.DepartmentID')
            .addSelect('position.PositionName AS PositionName') // Lấy tên vị trí từ bảng positions
            .addSelect('department.DepartmentName AS DepartmentName') // Lấy tên phòng ban từ bảng departments
            .where('MONTH(salary.SalaryMonth) = :month', { month })
            .andWhere('YEAR(salary.SalaryMonth) = :year', { year })
            .getRawMany<SalaryWithEmployee>(); // Sử dụng generic để chỉ định kiểu trả về

        return salaries.length > 0 ? salaries : null;
    },

    async create(data: Partial<Salary>): Promise<Salary | null> {
        const existingRecord = await mysqlRepository
            .createQueryBuilder('salary')
            .where('salary.EmployeeID = :employeeID', { employeeID: data.EmployeeID })
            .andWhere('MONTH(salary.SalaryMonth) = MONTH(:salaryMonth)', { salaryMonth: data.SalaryMonth })
            .andWhere('YEAR(salary.SalaryMonth) = YEAR(:salaryMonth)', { salaryMonth: data.SalaryMonth })
            .getOne();

        if (existingRecord) {
            throw new Error('A salary record for this employee and month already exists.');
        }
        const newSalaryRecord = await mysqlRepository.create(data);
        const createSalaryRecord = await mysqlRepository.save(newSalaryRecord);

        return createSalaryRecord;

    },

    async update(id: number, data: Partial<Salary>): Promise<Salary | null> {
        const existingRecord = await mysqlRepository.findOneBy({ SalaryID: id });
        if (!existingRecord) {
            return null;
        }
        await mysqlRepository.update({ SalaryID: id }, data);
        const updatedRecord = await mysqlRepository.findOneBy({ SalaryID: id });
        return updatedRecord;
    },
    async delete(id: number): Promise<string> {
        const existingRecord = await mysqlRepository.findOneBy({ SalaryID: id });
        if (!existingRecord) {
            return 'This payroll record does not exist.';
        }

        await mysqlRepository.delete({ SalaryID: id });
        return 'Deleted Salary Record';

    },

    async getById(id: number): Promise<Salary | null> {
        const salary = await mysqlRepository.findOneBy({ SalaryID: id });
        return salary;
    },

    async getByIdEmployee(id: number): Promise<Salary[] | null> {
        const salary = await mysqlRepository
            .createQueryBuilder('salary')
            .innerJoin('employees', 'employee', 'salary.EmployeeID = employee.EmployeeID')
            .select([
                'salary.SalaryID AS SalaryID',
                'salary.EmployeeID AS EmployeeID',
                'salary.SalaryMonth AS SalaryMonth',
                'ROUND(salary.BaseSalary, 0) AS BaseSalary',
                'ROUND(salary.Bonus, 0) AS Bonus',
                'ROUND(salary.Deductions, 0) AS Deductions',
                'ROUND(salary.BaseSalary + salary.Bonus - salary.Deductions, 0) AS NetSalary', // Lấy tên nhân viên từ bảng employees
            ])
            .where('employee.EmployeeID = :id', { id })
            .getRawMany<SalaryWithEmployee>(); // Sử dụng generic để chỉ định kiểu trả về

        return salary.length > 0 ? salary : null;
    }
};
