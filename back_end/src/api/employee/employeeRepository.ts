import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { InformationEmployee } from './employee.interface';
import { Salary } from '../../model/mysql/salary.entity';

const mssqlRepository = MSSQLDataSource.getRepository(MSSQLEmployee);
const mysqlRepository = MySQLDataSource.getRepository(MySQLEmployee);
const salaryRepository = MySQLDataSource.getRepository(Salary)
export const employeeRepository = {
    async findAllAsync(): Promise<MSSQLEmployee[]> {
        const mssqlEmployees = await mssqlRepository.find();
        return [...mssqlEmployees];
    },
    async findByIdAsync(id: number): Promise<MSSQLEmployee | null> {
        const mssqlEmployee = await mssqlRepository.findOne({
            where: { EmployeeID: id },
            relations: ['Department', 'Position'], // Thêm các quan hệ cần lấy
        });
        return mssqlEmployee;
    },

    async getEmployeeInformation(id: number): Promise<InformationEmployee | null> {
        // Lấy thông tin cơ bản của nhân viên
        const employee = await mysqlRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('Departments', 'department', 'employee.DepartmentID = department.DepartmentID')
            .leftJoinAndSelect('Positions', 'position', 'employee.PositionID = position.PositionID')
            .select([
                'employee.FullName AS name',
                'position.PositionName AS role',
                'department.DepartmentName AS department',
            ])
            .where('employee.EmployeeID = :id', { id }) // Thêm điều kiện WHERE
            .getRawOne(); // Lấy một bản ghi duy nhất
        if (!employee) {
            throw new Error("This user does not exist");
        }

        // Tính tổng NetSalary trong năm hiện tại từ bảng salaries
        let ytdEarningsResult = await salaryRepository
            .createQueryBuilder('salaries')
            .select('SUM(salaries.NetSalary)', 'ytdEarnings')
            .where('salaries.EmployeeID = :id', { id })
            .andWhere('YEAR(salaries.SalaryMonth) = YEAR(CURRENT_DATE())') // Lọc theo năm hiện tại
            .getRawOne();
        if (!ytdEarningsResult) {
            ytdEarningsResult = 0;
        }
        const ytdEarnings = Number(ytdEarningsResult?.ytdEarnings || 0); // Nếu không có dữ liệu, mặc định là 0

        let baseSalary = await salaryRepository
            .createQueryBuilder('salaries')
            .select('salaries.BaseSalary', ' baseSalary')
            .where('salaries.EmployeeID = :id', { id })
            .orderBy('salaries.SalaryMonth', 'DESC') // Lấy lần thanh toán gần nhất
            .getRawOne();
        if (!baseSalary.baseSalary) {
            baseSalary = 0;
        }
        // Lấy NetSalary của lần thanh toán gần nhất từ bảng salaries
        let lastPaymentResult = await salaryRepository
            .createQueryBuilder('salaries')
            .select([
                'salaries.NetSalary AS lastPayment',
                'salaries.SalaryMonth AS lastSalaryMonth'
            ])
            .where('salaries.EmployeeID = :id', { id })
            .orderBy('salaries.SalaryMonth', 'DESC') // Lấy lần thanh toán gần nhất
            .getRawOne();
        if (!lastPaymentResult) {
            lastPaymentResult = 0; // Trả về null nếu không tìm thấy dữ liệu
        }
        const lastPayment = Number(lastPaymentResult?.lastPayment || 0); // Nếu không có dữ liệu, mặc định là 0
        const lastSalaryMonth = lastPaymentResult?.lastSalaryMonth || null;

        // Trả về thông tin nhân viên theo định dạng của interface InformationEmployee
        return {
            name: employee.name,
            role: employee.role,
            department: employee.department,
            baseSalary: Number(baseSalary.baseSalary),
            ytdEarnings,
            lastPayment,
            lastSalaryMonth,
        };
    },
    async createUserAsync(userData: Partial<MSSQLEmployee>): Promise<MSSQLEmployee | null> {
        const newEmployeeMSSQL = await mssqlRepository.create(userData);
        const newEmployeeMySQL = await mysqlRepository.create(userData);
        // Retrieve the generated ID from MSSQL
        const createdEmployeeMSSQL = await mssqlRepository.save(newEmployeeMSSQL);
        // Use the generated ID to create the employee in MySQL
        newEmployeeMySQL.EmployeeID = createdEmployeeMSSQL.EmployeeID;
        await mysqlRepository.save(newEmployeeMySQL);

        return createdEmployeeMSSQL;
    },
    async updateUserAsync(
        id: number,
        data: Partial<MySQLEmployee>
    ): Promise<MSSQLEmployee | MySQLEmployee | null> {
        const mssqlEmployee = await mssqlRepository.findOneBy({ EmployeeID: id });
        const mysqlEmployee = await mysqlRepository.findOneBy({ EmployeeID: id });

        if (!mssqlEmployee || !mysqlEmployee) {
            throw new Error("This user does not exist");
        }

        if (mssqlEmployee) {
            Object.assign(mssqlEmployee, data);
            await mssqlRepository.save(mssqlEmployee);
        }

        if (mysqlEmployee) {
            Object.assign(mysqlEmployee, data);
            await mysqlRepository.save(mysqlEmployee);

        }
        return mssqlEmployee;
    },
    async getAll(): Promise<MySQLEmployee[] | MSSQLEmployee[] | null> {
        const mssqlEmployees = await mssqlRepository.find(
            {
                relations: ['Department', 'Position'], // Giả sử bạn đã định nghĩa quan hệ trong Entity
            }
        );
        const mysqlEmployees = await mysqlRepository.find(
            {
                relations: ['Department', 'Position'], // Giả sử bạn đã định nghĩa quan hệ trong Entity
            }
        );
        const uniqueEmployees = mysqlEmployees.filter(mysqlEmployee =>
            !mssqlEmployees.some(mssqlEmployee => mssqlEmployee.FullName === mysqlEmployee.FullName)
        );

        return [...mssqlEmployees, ...uniqueEmployees];
        // if (!mssqlEmployees || !mysqlEmployees) {
        //     return null;
        // }

        // return [...mssqlEmployees, ...mysqlEmployees];
    },
    async status(): Promise<{ totalEmployees: number, employeesByDepartment: any, employeesByPosition: any, employeesByStatus: any } | null> {

        const mssqlTotalEmployees = await mssqlRepository.count();
        //get total employee
        const totalEmployees = Number(mssqlTotalEmployees);

        //get Employee by Department
        const mssqlEmployeeByDepartment = await mssqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Department', 'name') // Dùng quan hệ đã định nghĩa trong entity
            .select('name.DepartmentName', 'name') // Lấy tên phòng ban từ bảng Departments
            .addSelect('COUNT(employee.EmployeeID)', 'value') // Đếm số lượng nhân viên
            .groupBy('name.DepartmentName')
            .getRawMany();

        // const mysqlEmployeeByDepartment = await mysqlRepository
        //     .createQueryBuilder('employee')
        //     .leftJoin('employee.Department', 'name')
        //     .select('name.DepartmentName', 'name')
        //     .addSelect('COUNT(employee.EmployeeID)', 'value')
        //     .groupBy('name.DepartmentName')
        //     .getRawMany();

        // const mergedEmployeeByDepartment = [...mssqlEmployeeByDepartment, ...mysqlEmployeeByDepartment].reduce((acc: { name: string, value: number }[], curr: { name: string, value: number }) => {
        //     const existing = acc.find((item: { name: string, value: number }) => item.name === curr.name);
        //     if (existing) {
        //         existing.value += Number(curr.value);
        //     } else {
        //         acc.push({ ...curr, value: Number(curr.value) });
        //     }
        //     return acc;
        // }, []);

        const mssqlEmployeeByPosition = await mssqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Position', 'name')
            .select('name.PositionName', 'name')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('name.PositionName')
            .getRawMany();

        // const mysqlEmployeeByPosition = await mysqlRepository // Corrected from mssqlRepository to mysqlRepository
        //     .createQueryBuilder('employee')
        //     .leftJoin('employee.Position', 'name')
        //     .select('name.PositionName', 'name')
        //     .addSelect('COUNT(employee.EmployeeID)', 'value')
        //     .groupBy('name.PositionName')
        //     .getRawMany();

        // const mergedEmployeeByPosition = [...mssqlEmployeeByPosition, ...mysqlEmployeeByPosition].reduce((acc: { name: string, value: number }[], curr: { name: string, value: number }) => {
        //     const existing = acc.find((item: { name: string, value: number }) => item.name === curr.name);
        //     if (existing) {
        //         existing.value += Number(curr.value);
        //     } else {
        //         acc.push({ ...curr, value: Number(curr.value) });
        //     }
        //     return acc;
        // }, []);

        // Get Employee by Status
        const mssqlEmployeeByStatus = await mssqlRepository
            .createQueryBuilder('employee')
            .select('employee.Status', 'status')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('employee.Status')
            .getRawMany();

        // const mysqlEmployeeByStatus = await mysqlRepository
        //     .createQueryBuilder('employee')
        //     .select('employee.Status', 'status')
        //     .addSelect('COUNT(employee.EmployeeID)', 'value')
        //     .groupBy('employee.Status')
        //     .getRawMany();

        // const mergedEmployeeByStatus = [...mssqlEmployeeByStatus, ...mysqlEmployeeByStatus].reduce((acc: { status: string, value: number }[], curr: { status: string, value: number }) => {
        //     const existing = acc.find((item: { status: string, value: number }) => item.status === curr.status);
        //     if (existing) {
        //         existing.value += Number(curr.value);
        //     } else {
        //         acc.push({ ...curr, value: Number(curr.value) });
        //     }
        //     return acc;
        // }, []);

        return {
            totalEmployees,
            employeesByDepartment: mssqlEmployeeByDepartment,
            employeesByPosition: mssqlEmployeeByPosition,
            employeesByStatus: mssqlEmployeeByStatus
        };

    },
    async findByEmail(email: string): Promise<MSSQLEmployee | MySQLEmployee | null> {
        const employee = await mssqlRepository.findOneBy({ Email: email })
        return employee;
    },
    async findByPhonNumber(phoneNumber: string): Promise<MSSQLEmployee | MySQLEmployee | null> {
        const employee = await mssqlRepository.findOneBy({ PhoneNumber: phoneNumber });
        return employee
    },
    async deleteUserAsync(id: number): Promise<number> {
        const employee = await mssqlRepository.findOneBy({ EmployeeID: id });
        if (!employee) {
            throw new Error("This user does not exist")
        }
        const check = await mysqlRepository.delete({ EmployeeID: id });
        if (!check) {
            throw new Error("Error delete employee")
        }
        await mssqlRepository.delete({ EmployeeID: id });


        return 1;
    },

    async getCountDepartment(): Promise<number | null> {
        const mssqlDepartment = await mssqlRepository
            .createQueryBuilder('employee')
            .select('COUNT(DISTINCT employee.DepartmentID)', 'count')
            .getRawOne();

        if (!mssqlDepartment) {
            return null;
        }
        return Number(mssqlDepartment.count);
    },

    async findEmailById(id: number) : Promise<string | null> {
        const employee = await mssqlRepository.findOneBy({ EmployeeID: id });
        if (!employee) {
            throw new Error("This user does not exist")
        }
        return employee.Email;
    }




};
