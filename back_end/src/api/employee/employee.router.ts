import passport from 'passport';
import { Router } from 'express';
import { EmployeeController } from './employee.controller';


const employeeRouter = Router();

employeeRouter.get('/status', EmployeeController.status)
employeeRouter.get('/information/:id', EmployeeController.information)
employeeRouter.get('/', EmployeeController.getAll);
employeeRouter.post('/', EmployeeController.create)
employeeRouter.get('/:id', EmployeeController.getById);
employeeRouter.put('/:id', EmployeeController.update)
employeeRouter.delete('/:id', EmployeeController.delete)

export default employeeRouter;
