import { Router, Request, Response } from 'express';
import { verifyCredentials, seedAdminIfEmpty } from './users';
import { generateToken, setAuthCookie, clearAuthCookie } from './jwt';
import { authRateLimiter } from './middleware';

export const authRouter = Router();

// Bootstrapping initial admin account
authRouter.post('/bootstrap', async (req: Request, res: Response) => {
  try {
    await seedAdminIfEmpty();
    res.json({ success: true, message: 'Admin account bootstrapped or verified successfully.' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// User Login
authRouter.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Always attempt bootstrap check on login
    await seedAdminIfEmpty();

    const user = await verifyCredentials(email, password);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = generateToken(payload);
    setAuthCookie(res, token);

    res.json({
      success: true,
      user: payload
    });
  } catch (err) {
    res.status(500).json({ error: 'Login server error: ' + (err as Error).message });
  }
});

// User Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Get Current User Session
authRouter.get('/me', (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthenticated' });
  }
  res.json({
    user: req.user
  });
});
