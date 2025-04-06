import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'; // Default expiration time set to 1 hour

export const generateJwt = (payload: any) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: parseInt(JWT_EXPIRES_IN, 10) || '1h' });
};

export const verifyJwt = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};
