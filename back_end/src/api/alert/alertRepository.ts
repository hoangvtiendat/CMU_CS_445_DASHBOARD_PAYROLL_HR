
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';


const attendaceRepo = MSSQLDataSource.getRepository(MySQLAttendance);
const emoloyeeRepo = MySQLDataSource.getRepository(MSSQLEmployee);

export const AlertRepository = {
};
