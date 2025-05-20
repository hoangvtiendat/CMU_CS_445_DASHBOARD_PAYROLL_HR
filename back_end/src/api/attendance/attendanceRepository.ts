import { MySQLDataSource } from '../../config/typeorm.config';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';

const mysqlRepository = MySQLDataSource.getRepository(MySQLAttendance);

export const AttendanceRepository = {
    async checkin(employeeId: number): Promise<MySQLAttendance> {
        const now = new Date();
        const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let attendance = await mysqlRepository.findOne({
            where: {
                Employee: { EmployeeID: employeeId },
                AttendanceMonth: currentDate,
            },
            relations: ['Employee'],
        });

        if (attendance) {
           return attendance;
        } else {
            attendance = mysqlRepository.create({
                Employee: { EmployeeID: employeeId },
                WorkDays: 1,
                AbsentDays: 0,
                LeaveDays: 0,
                AttendanceMonth: currentDate,
                CreatedAt: now,
            });
        }

        await mysqlRepository.save(attendance);
        return attendance;
    },

    async getAll(): Promise<MySQLAttendance[]> {
        return await mysqlRepository.find({
            relations: ['Employee'],
        });
    },
};
