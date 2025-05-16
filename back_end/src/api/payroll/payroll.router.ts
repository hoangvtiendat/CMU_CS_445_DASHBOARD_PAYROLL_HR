import passport from 'passport';
import { Router } from 'express';
import { PayrollController } from './payroll.controller';


const payrollRouter = Router();


payrollRouter.get('/dashboard/status', PayrollController.status)
payrollRouter.get('/employee/:id', PayrollController.getByIdEmplpoyee)
payrollRouter.get('/', PayrollController.getSalaryByMonth)
payrollRouter.post('/', PayrollController.create)
payrollRouter.put('/:id', PayrollController.update);
payrollRouter.delete('/:id', PayrollController.delete)

export default payrollRouter;
