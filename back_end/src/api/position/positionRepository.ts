
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { MSSQLPosition } from '../../model/mssql/position.entity';
import { MySQLPosition } from '../../model/mysql/position.entity';


const mssqlRepository = MSSQLDataSource.getRepository(MSSQLPosition);
const mysqlRepository = MySQLDataSource.getRepository(MySQLPosition);

export const positionRepository = {


    async getAll(): Promise<MySQLPosition[] | MSSQLPosition[] | null> {
        const mssqlDepartment = await mssqlRepository.find();
        const mysqlDepartment = await mysqlRepository.find();

        if (!mssqlDepartment || !mysqlDepartment) {
            return null;
        }
        const nameSet = new Set<string>();
        const uniqueDepartments: (MySQLPosition | MSSQLPosition)[] = [];

        for (const dept of [...mysqlDepartment, ...mssqlDepartment]) {
            const normalizedName = dept.PositionName.trim().toLowerCase();
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
            const normalizedName = dept.PositionName.trim().toLowerCase();
            nameSet.add(normalizedName);
        }

        return nameSet.size;
    },
   

};
