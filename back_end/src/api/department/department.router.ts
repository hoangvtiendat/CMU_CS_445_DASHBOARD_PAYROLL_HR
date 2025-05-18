import passport from 'passport';
import { Router } from 'express';
import { DepartmentController } from './department.controller';
import authenticateJWT from '../../middleware/authentication'


const departmentRouter = Router();



departmentRouter.get('/', DepartmentController.getAll);
departmentRouter.get('/count', authenticateJWT, DepartmentController.getCount);

export default departmentRouter;
