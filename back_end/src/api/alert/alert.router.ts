import passport from 'passport';
import { Router } from 'express';
import { AlertController } from './alert.controller';
import authenticateJWT from '../../middleware/authencation'


const AlertRouter = Router();
// PositionRouter.get('/', PositionController.getAll);
AlertRouter.get('/',authenticateJWT, AlertController.getAll);
export default AlertRouter;
