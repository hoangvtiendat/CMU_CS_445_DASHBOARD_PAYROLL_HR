import passport from 'passport';
import { Router } from 'express';
import { AttendanceController } from './attendance.controller';


const AttandanceRouter = Router();



AttandanceRouter.post('/checkin/:id', AttendanceController.checkin);


export default AttandanceRouter;
