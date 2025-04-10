import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';


const mssqlRepository = MSSQLDataSource.getRepository(MSSQLEmployee);
const mysqlRepository = MySQLDataSource.getRepository(MySQLEmployee);

export const employeeRepository = {
    async findAllAsync(): Promise<MySQLEmployee[]> {
        const mssqlEmployees = await mssqlRepository.find();
        const mysqlEmployees = await mysqlRepository.find();

        return [...mssqlEmployees, ...mysqlEmployees];
    },

    async findByIdAsync(id: number): Promise<MySQLEmployee | null> {
        const mssqlEmployees = await mssqlRepository.findOneBy({ EmployeeID: id });
        if (!mssqlEmployees) {
            const mysqlEmployees = await mysqlRepository.findOneBy({ EmployeeID: id });
            return mysqlEmployees;
        }
        return mssqlEmployees;
    },

    async createUserAsync(userData: Partial<MySQLEmployee>): Promise<MySQLEmployee> {
        const newUser = await mssqlRepository.create(userData);
        const newUser1 = await mysqlRepository.create(userData);

        await mssqlRepository.save(newUser);
        await mysqlRepository.save(newUser1)
        return newUser;
    },




    async updateUserAsync(
        id: number,
        updateData: Partial<MySQLEmployee>
    ): Promise<MySQLEmployee | null> {
        const mssqlEmployees = await mssqlRepository.update(id, updateData);
        const mysqlEmployees = await mysqlRepository.update(id, updateData);


        return mysqlRepository.findOneBy({ EmployeeID: id });
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

        if (!mssqlEmployees || !mysqlEmployees) {
            return null;
        }
        return [...mssqlEmployees, ...mysqlEmployees];
    }


    // async getAll(): Promise<any[] | null> {
    //     const mssqlEmployees = await mssqlRepository.find({
    //         relations: ['Department', 'Position'],
    //     });
    
    //     const mysqlEmployees = await mysqlRepository.find({
    //         relations: ['Department', 'Position'],
    //     });
    
    //     if (!mssqlEmployees || !mysqlEmployees) {
    //         return null;
    //     }
    
    //     const mapEmployee = (emp: any) => ({
    //         EmployeeID: emp.EmployeeID,
    //         FullName: emp.FullName,
    //         DateOfBirth: emp.DateOfBirth,
    //         gender: emp.gender,
    //         PhoneNumber: emp.phoneNumber,
    //         Email: emp.email,
    //         HireDate: emp.hireDate,
    //         DepartmentId: emp.departmentId,
    //         Department: emp.Department?.name || null,
    //         PositionId: emp.positionId,
    //         Position: emp.Position?.name || null,
    //         Status: emp.status,
    //     });
    
    //     const formattedEmployees = [
    //         ...mssqlEmployees.map(mapEmployee),
    //         ...mysqlEmployees.map(mapEmployee),
    //     ];
    
    //     return formattedEmployees;
    // }
    
};
