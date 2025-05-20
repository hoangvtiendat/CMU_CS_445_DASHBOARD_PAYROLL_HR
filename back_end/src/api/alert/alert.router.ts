import passport from 'passport';
import { Router } from 'express';
import { AlertController } from './alert.controller';
import authenticateJWT from '../../middleware/authentication'


const AlertRouter = Router();
// PositionRouter.get('/', PositionController.getAll);
AlertRouter.get('/',authenticateJWT, AlertController.getAll);
AlertRouter.post('/sendMail', authenticateJWT, AlertController.sendMail);
export default AlertRouter;
