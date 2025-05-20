// filepath: /Users/tiendathoangvan/Downloads/hoangVanTienDat/DuyTanUniversity/CMU-CS 445/GROUP_PROJECT/hr-dashboard/back_end/src/scheduler/attendance.cron.ts
import cron from 'node-cron';
import { MySQLDataSource } from '../config/typeorm.config';
import { MySQLEmployee } from '../model/mysql/employee.entity';
import { MySQLAttendance } from '../model/mysql/attendance.entity';

const employeeRepo = MySQLDataSource.getRepository(MySQLEmployee);
const attendanceRepo = MySQLDataSource.getRepository(MySQLAttendance);

async function autoMarkAbsent() {
  const now = new Date();
  // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const todayStr = now.toISOString().slice(0, 10);
  const today = new Date(todayStr);

  // Lấy tất cả nhân viên
  const employees = await employeeRepo.find();

  // Lấy tất cả bản ghi attendance của ngày hôm nay
  const attendances = await attendanceRepo.find({
    where: { AttendanceMonth: today },
    relations: ['Employee'],
  });

  // Lấy danh sách EmployeeID đã có attendance hôm nay
  const attendedIds = attendances.map(a => a.Employee.EmployeeID);

  // Lọc ra các nhân viên chưa có attendance hôm nay
  const absentEmployees = employees.filter(e => !attendedIds.includes(e.EmployeeID));

  // Tạo bản ghi attendance với AbsentDays = 1 cho các nhân viên này
  for (const emp of absentEmployees) {
    const newAttendance = attendanceRepo.create({
      Employee: { EmployeeID: emp.EmployeeID },
      WorkDays: 0,
      AbsentDays: 1,
      LeaveDays: 0,
      AttendanceMonth: today,
      CreatedAt: now,
    });
    await attendanceRepo.save(newAttendance);
  }
}

// Lên lịch chạy mỗi ngày lúc 23:59
cron.schedule('55 15 * * *', () => {
  autoMarkAbsent();
  console.log('Auto mark absent executed!');
});