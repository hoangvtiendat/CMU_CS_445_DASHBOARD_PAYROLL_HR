import passport from 'passport';
import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import authenticateJWT from '../../middleware/authentication'


const employeeRouter = Router();

employeeRouter.get('/status', authenticateJWT, EmployeeController.status)
employeeRouter.get('/information/:id', authenticateJWT, EmployeeController.information)
employeeRouter.get('/', authenticateJWT, EmployeeController.getAll);
employeeRouter.post('/', authenticateJWT, EmployeeController.create)
employeeRouter.get('/:id', authenticateJWT, EmployeeController.getById);
employeeRouter.put('/:id', authenticateJWT, EmployeeController.update)
employeeRouter.delete('/:id', authenticateJWT, EmployeeController.delete)

export default employeeRouter;
