import passport from 'passport';
import { Router } from 'express';
import { AuthController } from '../auth/auth.controller';


const authRouter = Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);
// authRouter.get('/getme', AuthController.getMe);
export default authRouter;
