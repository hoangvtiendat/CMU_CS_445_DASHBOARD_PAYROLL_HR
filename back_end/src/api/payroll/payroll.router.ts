import passport from 'passport';
import { Router } from 'express';
import { PayrollController } from './payroll.controller';
import authenticateJWT from '../../middleware/authentication'


const payrollRouter = Router();


payrollRouter.get('/dashboard/status', authenticateJWT, PayrollController.status)
payrollRouter.get('/employee/:id', authenticateJWT, PayrollController.getByIdEmplpoyee)
payrollRouter.get('/', authenticateJWT, PayrollController.getSalaryByMonth)
payrollRouter.post('/', authenticateJWT, PayrollController.create)
payrollRouter.put('/:id', authenticateJWT, PayrollController.update);
payrollRouter.delete('/:id', authenticateJWT, PayrollController.delete)

export default payrollRouter;
