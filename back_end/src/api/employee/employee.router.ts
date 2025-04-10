import passport from 'passport';
import { Router } from 'express';
import { EmployeeController } from './employee.controller';


const empolyeeRouter = Router();



empolyeeRouter.get('/', EmployeeController.getAll);

export default empolyeeRouter;
