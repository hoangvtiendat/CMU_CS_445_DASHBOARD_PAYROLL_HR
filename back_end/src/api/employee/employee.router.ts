import passport from 'passport';
import { Router } from 'express';
import { EmployeeController } from './employee.controller';


const employeeRouter = Router();



employeeRouter.get('/', EmployeeController.getAll);
employeeRouter.get('/status', EmployeeController.status)
employeeRouter.put('/:id', EmployeeController.update)
employeeRouter.post('/', EmployeeController.create)
employeeRouter.delete('/:id', EmployeeController.delete)

export default employeeRouter;
