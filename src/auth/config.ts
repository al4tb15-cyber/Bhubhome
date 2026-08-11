export const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET || 'office-businesshub-app-jwt-secret-key-2026-secure',
  cookieName: 'bh_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'sql_office_businesshub_app',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sql_office_businesshub_app',
    port: parseInt(process.env.DB_PORT || '3306', 10)
  }
};
