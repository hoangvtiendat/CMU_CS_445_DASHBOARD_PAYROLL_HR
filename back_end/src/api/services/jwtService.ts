import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import ms from 'ms'; // Import để có kiểu ms.StringValue (nếu cần)

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'default';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export const generateJwt = (payload: any) => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as ms.StringValue };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJwt = (token: string): any => {
  return jwt.verify(token, JWT_SECRET);
};