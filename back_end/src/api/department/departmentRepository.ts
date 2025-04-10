
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { MySQLDepartment } from '../../model/mysql/department.entity';
import { MSSQLDepartment } from '../../model/mssql/department.entity';


const mssqlRepository = MSSQLDataSource.getRepository(MSSQLDepartment);
const mysqlRepository = MySQLDataSource.getRepository(MySQLDepartment);

export const departmentRepository = {


    async getAll(): Promise<MySQLDepartment[] | MSSQLDepartment[] | null> {
        const mssqlDepartment = await mssqlRepository.find();
        const mysqlDepartment = await mysqlRepository.find();

        if (!mssqlDepartment || !mysqlDepartment) {
            return null;
        }
        const nameSet = new Set<string>();
        const uniqueDepartments: (MySQLDepartment | MSSQLDepartment)[] = [];

        for (const dept of [...mysqlDepartment, ...mssqlDepartment]) {
            const normalizedName = dept.DepartmentName.trim().toLowerCase();
            if (!nameSet.has(normalizedName)) {
                nameSet.add(normalizedName);
                uniqueDepartments.push(dept);
            }
        }

        return uniqueDepartments;
    },

    async getCount(): Promise<number | null> {
        const mssqlDepartment = await mssqlRepository.findAndCount();
        const mysqlDepartment = await mysqlRepository.findAndCount();

        if (!mssqlDepartment || !mysqlDepartment) {
            return null;
        }
        const nameSet = new Set<string>();
        for (const dept of [...mysqlDepartment[0], ...mssqlDepartment[0]]) {
            const normalizedName = dept.DepartmentName.trim().toLowerCase();
            nameSet.add(normalizedName);
        }

        return nameSet.size;
    },
   

};
