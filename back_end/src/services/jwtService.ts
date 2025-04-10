import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default';

const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';

export const generateJwt = (payload: any) => {
  // return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });

};


export const verifyJwt = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

