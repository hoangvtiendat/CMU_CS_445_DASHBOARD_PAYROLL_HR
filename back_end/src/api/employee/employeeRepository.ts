import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';


const mssqlRepository = MSSQLDataSource.getRepository(MSSQLEmployee);
const mysqlRepository = MySQLDataSource.getRepository(MySQLEmployee);

export const employeeRepository = {
    async findAllAsync(): Promise<MSSQLEmployee[]> {
        const mssqlEmployees = await mssqlRepository.find();
        return [...mssqlEmployees];
    },
    async findByIdAsync(id: number): Promise<MySQLEmployee | null> {
        const mssqlEmployees = await mssqlRepository.findOneBy({ EmployeeID: id });
        if (!mssqlEmployees) {
            const mysqlEmployees = await mysqlRepository.findOneBy({ EmployeeID: id });
            return mysqlEmployees;
        }
        return mssqlEmployees;
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
            return null;
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
        const mysqlTotalEmployees = await mysqlRepository.count();

        //get total employee
        const totalEmployees = Number(mssqlTotalEmployees) + Number(mysqlTotalEmployees);

        //get Employee by Department
        const mssqlEmployeeByDepartment = await mssqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Department', 'name') // Dùng quan hệ đã định nghĩa trong entity
            .select('name.DepartmentName', 'name') // Lấy tên phòng ban từ bảng Departments
            .addSelect('COUNT(employee.EmployeeID)', 'value') // Đếm số lượng nhân viên
            .groupBy('name.DepartmentName')
            .getRawMany();

        const mysqlEmployeeByDepartment = await mysqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Department', 'name')
            .select('name.DepartmentName', 'name')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('name.DepartmentName')
            .getRawMany();

        const mergedEmployeeByDepartment = [...mssqlEmployeeByDepartment, ...mysqlEmployeeByDepartment].reduce((acc: { name: string, value: number }[], curr: { name: string, value: number }) => {
            const existing = acc.find((item: { name: string, value: number }) => item.name === curr.name);
            if (existing) {
                existing.value += Number(curr.value);
            } else {
                acc.push({ ...curr, value: Number(curr.value) });
            }
            return acc;
        }, []);

        const mssqlEmployeeByPosition = await mssqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Position', 'name')
            .select('name.PositionName', 'name')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('name.PositionName')
            .getRawMany();

        const mysqlEmployeeByPosition = await mysqlRepository // Corrected from mssqlRepository to mysqlRepository
            .createQueryBuilder('employee')
            .leftJoin('employee.Position', 'name')
            .select('name.PositionName', 'name')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('name.PositionName')
            .getRawMany();

        const mergedEmployeeByPosition = [...mssqlEmployeeByPosition, ...mysqlEmployeeByPosition].reduce((acc: { name: string, value: number }[], curr: { name: string, value: number }) => {
            const existing = acc.find((item: { name: string, value: number }) => item.name === curr.name);
            if (existing) {
                existing.value += Number(curr.value);
            } else {
                acc.push({ ...curr, value: Number(curr.value) });
            }
            return acc;
        }, []);

        // Get Employee by Status
        const mssqlEmployeeByStatus = await mssqlRepository
            .createQueryBuilder('employee')
            .select('employee.Status', 'status')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('employee.Status')
            .getRawMany();

        const mysqlEmployeeByStatus = await mysqlRepository
            .createQueryBuilder('employee')
            .select('employee.Status', 'status')
            .addSelect('COUNT(employee.EmployeeID)', 'value')
            .groupBy('employee.Status')
            .getRawMany();

        const mergedEmployeeByStatus = [...mssqlEmployeeByStatus, ...mysqlEmployeeByStatus].reduce((acc: { status: string, value: number }[], curr: { status: string, value: number }) => {
            const existing = acc.find((item: { status: string, value: number }) => item.status === curr.status);
            if (existing) {
                existing.value += Number(curr.value);
            } else {
                acc.push({ ...curr, value: Number(curr.value) });
            }
            return acc;
        }, []);

        return {
            totalEmployees,
            employeesByDepartment: mergedEmployeeByDepartment,
            employeesByPosition: mergedEmployeeByPosition,
            employeesByStatus: mergedEmployeeByStatus
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
        await mssqlRepository.delete({ EmployeeID: id });
        await mysqlRepository.delete({ EmployeeID: id });

        return 1;
    }






};
