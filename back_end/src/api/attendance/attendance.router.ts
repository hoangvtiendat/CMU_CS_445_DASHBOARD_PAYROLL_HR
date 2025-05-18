import passport from 'passport';
import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import authenticateJWT from '../../middleware/authencation'



const AttandanceRouter = Router();



AttandanceRouter.post('/checkin/:id', authenticateJWT, AttendanceController.checkin);


export default AttandanceRouter;
