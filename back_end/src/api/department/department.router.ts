import passport from 'passport';
import { Router } from 'express';
import { DepartmentController } from './department.controller';


const departmentRouter = Router();



departmentRouter.get('/', DepartmentController.getAll);
departmentRouter.get('/count', DepartmentController.getCount);

export default departmentRouter;
