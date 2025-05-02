import passport from 'passport';
import { Router } from 'express';
import { PayrollController } from './payroll.controller';


const payrollRouter = Router();


payrollRouter.get('/dashboard/status', PayrollController.status)
payrollRouter.get('/', PayrollController.getSalaryByMonth)
payrollRouter.post('/', PayrollController.create)
export default payrollRouter;
