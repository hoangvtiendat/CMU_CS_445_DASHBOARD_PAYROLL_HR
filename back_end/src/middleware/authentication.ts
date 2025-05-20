import { NextFunction, Request, Response } from 'express';
import { verifyJwt } from '../api/services/jwtService';
import { authService } from '../api/auth/auth.service';
interface AuthenticatedRequest extends Request {
  user?: string | object;
}

const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = verifyJwt(token);
      if (!decoded) {
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
        return;
      }
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.message === 'jwt expired') {
        res.status(401).json({ message: 'Unauthorized: Token expired' });
        return;
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
    }
  } else {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }
};

export default authenticateJWT;