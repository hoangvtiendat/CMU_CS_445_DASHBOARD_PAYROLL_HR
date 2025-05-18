import passport from 'passport';
import { Router } from 'express';
import { PositionController } from './position.controller';
import authenticateJWT from '../../middleware/authencation'


const PositionRouter = Router();



PositionRouter.get('/', authenticateJWT, PositionController.getAll);


export default PositionRouter;
