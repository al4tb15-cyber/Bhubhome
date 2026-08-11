import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { AUTH_CONFIG } from './config';

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, AUTH_CONFIG.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, AUTH_CONFIG.jwtSecret) as TokenPayload;
    return decoded;
  } catch (err) {
    return null;
  }
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_CONFIG.cookieName, token, AUTH_CONFIG.cookieOptions);
}

export function clearAuthCookie(res: Response): void {
  res.cookie(AUTH_CONFIG.cookieName, '', {
    ...AUTH_CONFIG.cookieOptions,
    maxAge: 0
  });
}
