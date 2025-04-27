import passport from 'passport';
import { Router } from 'express';
import { PayrollController } from './payroll.controller';


const payrollRouter = Router();


payrollRouter.get('/dashboard/status', PayrollController.status)
payrollRouter.get('/', PayrollController.getSalaryByMonth)
export default payrollRouter;
