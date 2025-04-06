import express from 'express'
import authRouter from '../api/auth/auth.router'
import employeeRouter from '../api/employee/employee.router'
const router = express.Router();

router.use('/auth', authRouter)
router.use('/employee', employeeRouter)

export default router