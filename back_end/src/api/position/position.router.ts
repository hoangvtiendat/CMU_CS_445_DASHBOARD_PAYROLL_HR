import passport from 'passport';
import { Router } from 'express';
import { PositionController } from './position.controller';


const PositionRouter = Router();



PositionRouter.get('/', PositionController.getAll);


export default PositionRouter;
