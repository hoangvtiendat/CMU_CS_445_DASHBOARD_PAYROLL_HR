import express from 'express'
import authRouter from '../api/auth/auth.router'
import employeeRouter from '../api/employee/employee.router'
import departmentRouter from './department/department.router';
import positionRouter  from './position/position.router'
import payrollRouter from './payroll/payroll.router';
import attendanceRouter from './attendance/attendance.router';
const router = express.Router();

router.use('/auth', authRouter)
router.use('/employees', employeeRouter)
router.use('/departments', departmentRouter)
router.use('/positions', positionRouter)
router.use('/salaries', payrollRouter)
router.use('/attendance', attendanceRouter)

export default router