
import { MSSQLDataSource, MySQLDataSource } from '../../config/typeorm.config';
import { MySQLAttendance } from '../../model/mysql/attendance.entity';
import { MSSQLEmployee } from '../../model/mssql/employee.entity';
import { IAlert } from './alert.interface';
import { MySQLEmployee } from '../../model/mysql/employee.entity';
import { generateJwt } from '../services/jwtService'
import mailService from '../services/sendMail.service';
import SendmailTransport from 'nodemailer/lib/sendmail-transport';

const attendaceRepo = MySQLDataSource.getRepository(MySQLAttendance);
const employeeRepo = MSSQLDataSource.getRepository(MSSQLEmployee);


export const AlertRepository = {
    getAll: async () => {

        let nextAlertId = 1;
        const alerts: IAlert[] = [];
        try {
            const attendace = await attendaceRepo
                .createQueryBuilder('attendance')
                .innerJoin('employees', 'employee', 'attendance.EmployeeID = employee.EmployeeID')
                .select([
                    'employee.FullName as FullName',
                    'SUM(attendance.AbsentDays) as absentDays',
                    'employee.EmployeeID as employeeID',
                ])
                .where('MONTH(attendance.AttendanceMonth) = MONTH(CURRENT_DATE)')
                .andWhere('YEAR(attendance.AttendanceMonth) = YEAR(CURRENT_DATE)')
                .groupBy('employee.FullName')
                .addGroupBy('employee.EmployeeID')
                .having('SUM(attendance.AbsentDays) > :value', { value: 4 }) // Tham chiếu kết quả SUM bằng tên bí danh
                .getRawMany();
            console.log('attendace', attendace);
            const employeeData = await employeeRepo
                .createQueryBuilder('employee')
                .select([
                    'employee.EmployeeID as employeeID',
                    'employee.FullName as FullName',
                    'employee.HireDate as HireDate', // Sử dụng HireDate làm date cho alert này
                ])
                .getRawMany();

            console.log('employeeData', employeeData);
            attendace.forEach(data => {
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
                    employeeID: data.employeeID
                });
            });
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
                        employeeID: data.employeeID

                    });
                }
            });

            return alerts;
        } catch (error) {
            throw new Error('Error fetching data from database');
        }
    },

    sendMail: async (email: string, data: string): Promise<boolean> => {
        try {


            const verifyEmailToken = generateJwt({ email });
            console.log('verifyEmailToken generated');

        
            // const verifyUrl = `http://localhost:3000/auth/activate?token=${verifyEmailToken}`;
            console.log('verifyUrl generated, start send email');
            const mailIsSent = await mailService.sendEmail({
                emailFrom: 'hngvtdat010@gmail.com',
                emailTo: email,
                emailSubject: 'Notification from HR & PAYROLL system',
                emailText: `${data}`,
            });

            console.log('mailIsSent', mailIsSent);

            if (!mailIsSent) {
                return false;
            }

            // return new ServiceResponse<string>(
            //   ResponseStatus.Success,
            //   "Email activated successfully",
            //   email,
            //   StatusCodes.OK
            // );
            return true;
        } catch (ex) {
            const errorMessage = `Error activating email: ${(ex as Error).message}`;
            // return new ServiceResponse(
            //   ResponseStatus.Failed,
            //   errorMessage,
            //   null,
            //   StatusCodes.INTERNAL_SERVER_ERROR
            // );
            return false;
        }
    },
};
