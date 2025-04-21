import express from 'express'
import authRouter from '../api/auth/auth.router'
import employeeRouter from '../api/employee/employee.router'
import departmentRouter from './department/department.router';
import positionRouter  from './position/position.router'
const router = express.Router();

router.use('/auth', authRouter)
router.use('/employees', employeeRouter)
router.use('/departments', departmentRouter)
router.use('/positions', positionRouter)

export default router