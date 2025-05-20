import passport from 'passport';
import { Router } from 'express';
import { AuthController } from '../auth/auth.controller';
import authenticateJWT from '../../middleware/authentication'

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
authRouter.get('/', authenticateJWT, AuthController.getAll)
authRouter.put('/:Id', authenticateJWT, AuthController.udpate);
authRouter.delete('/:Id', authenticateJWT, AuthController.delete)
authRouter.post('/logout/:id', AuthController.logout);

// authRouter.get('/getme', AuthController.getMe);
export default authRouter;
