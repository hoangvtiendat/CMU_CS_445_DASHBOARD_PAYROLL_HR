import passport from 'passport';
import { Router } from 'express';
import { EmployeeController } from './employee.controller';


const authRouter = Router();



authRouter.get('/', EmployeeController.getAll);

export default authRouter;
