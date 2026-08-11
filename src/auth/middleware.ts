import { Request, Response, NextFunction } from 'express';
import { AUTH_CONFIG } from './config';
import { verifyToken, TokenPayload } from './jwt';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload | null;
    }
  }
}

export const ROLE_HIERARCHY: Record<string, number> = {
  visitor: 0,
  lead: 0,
  client: 1,
  partner: 2,
  staff: 3,
  manager: 3,
  admin: 4,
  ceo: 4
};

export function getRoleLevel(role: string): number {
  const norm = (role || 'visitor').toLowerCase().trim();
  return ROLE_HIERARCHY[norm] !== undefined ? ROLE_HIERARCHY[norm] : 0;
}

export function attachUser(req: Request, res: Response, next: NextFunction): void {
  req.user = null;

  // 1. Check httpOnly Cookie
  let token: string | undefined = req.cookies?.[AUTH_CONFIG.cookieName];

  // 2. Fallback to Authorization Header
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
  }
  next();
}

export function requireRole(minRole: string) {
  const requiredLevel = getRoleLevel(minRole);

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required.' });
    }

    const userLevel = getRoleLevel(req.user.role);
    if (userLevel < requiredLevel) {
      return res.status(403).json({
        error: `Forbidden: Requires minimum '${minRole}' privileges (current role: '${req.user.role}')`
      });
    }

    next();
  };
}

// Simple in-memory rate limiter for auth routes
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function authRateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 10;

  const record = loginAttempts.get(ip);
  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return next();
  }

  if (record.count >= maxAttempts) {
    return res.status(429).json({
      error: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }

  record.count += 1;
  next();
}
