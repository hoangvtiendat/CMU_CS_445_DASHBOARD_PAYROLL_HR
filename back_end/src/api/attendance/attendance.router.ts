import passport from 'passport';
import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import authenticateJWT from '../../middleware/authentication'



const AttandanceRouter = Router();



AttandanceRouter.post('/checkin/:id', authenticateJWT, AttendanceController.checkin);
AttandanceRouter.get('/', authenticateJWT, AttendanceController.getAll);

export default AttandanceRouter;
