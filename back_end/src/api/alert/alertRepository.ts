
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';
import { IAlert } from './alert.interface';
import { MySQLEmployee } from '../../model/mysql/employee.entity';


const attendaceRepo = MySQLDataSource.getRepository(MySQLAttendance);
const employeeRepo = MSSQLDataSource.getRepository(MSSQLEmployee);


export const AlertRepository = {
    getAll: async () => {

        let nextAlertId = 1;
        const alerts: IAlert[] = [];
        try {
            // console.log('attendaceRepo', attendaceRepo);
            // console.log('\n\nemployeeRepo', employeeRepo);
            console.log(3);
            const attendace = await attendaceRepo
                .createQueryBuilder('attendance')
                .innerJoin('employees', 'employee', 'attendance.EmployeeID = employee.EmployeeID')
                .select([
                    'employee.FullName as FullName',
                    'SUM(attendance.AbsentDays) as absentDays', // Sử dụng 'absentDays' (lowercase)
                ])
                .where('MONTH(attendance.AttendanceMonth) = MONTH(CURRENT_DATE)')
                .andWhere('YEAR(attendance.AttendanceMonth) = YEAR(CURRENT_DATE)')
                .groupBy('employee.FullName')
                .having('SUM(attendance.AbsentDays) > :value', { value: 4 }) // Tham chiếu kết quả SUM bằng tên bí danh
                .getRawMany();
            console.log(4);
            console.log(attendace);

            console.log(5);

            const employeeData = await employeeRepo
                .createQueryBuilder('employee')
                .select([
                    'employee.EmployeeID as id',
                    'employee.FullName as FullName',
                    'employee.HireDate as HireDate', // Sử dụng HireDate làm date cho alert này
                ])
                .getRawMany();
            console.log("employee: ", employeeData);
            console.log(6);
            attendace.forEach(data => {
                console.log('data', data);
                let priority = 'medium';
                if (Number(data.absentDays) > 7) {
                    priority = 'high';
                }
                alerts.push({
                    id: nextAlertId++,
                    type: 'Leave',
                    message: `Employee <strong> ${data.FullName} </strong> was absent for ${data.absentDays} days this month.`,
                    date: new Date().toLocaleDateString(),
                    priority: priority,
                });
            });
            console.log('alerts', alerts);
            employeeData.forEach(data => {
                const hireDate = new Date(data.HireDate);
                const currentDate = new Date();
                const yearsOfService = currentDate.getFullYear() - hireDate.getFullYear();

                if (yearsOfService > 0) {
                    alerts.push({
                        id: nextAlertId++,
                        type: 'Anniversary',
                        message: `Today is the ${yearsOfService}-year anniversary of employee <strong>${data.FullName}</strong>.`,
                        date: new Date().toLocaleDateString(),
                        priority: 'medium', // Bạn có thể điều chỉnh priority cho loại alert này
                    });
                }
            });

            return alerts;
        } catch (error) {
            throw new Error('Error fetching data from database');
        }
    },
};
