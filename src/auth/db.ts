import mysql from 'mysql2/promise';
import { AUTH_CONFIG } from './config';

let pool: mysql.Pool | null = null;
let isDbAvailable = false;

export function getDbPool(): mysql.Pool | null {
  if (pool) return pool;

  try {
    pool = mysql.createPool({
      host: AUTH_CONFIG.db.host,
      user: AUTH_CONFIG.db.user,
      password: AUTH_CONFIG.db.password,
      database: AUTH_CONFIG.db.database,
      port: AUTH_CONFIG.db.port,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000
    });
    return pool;
  } catch (err) {
    console.warn('[DB] Failed to create MariaDB pool:', (err as Error).message);
    pool = null;
    return null;
  }
}

export async function ensureUserSchema(): Promise<boolean> {
  const p = getDbPool();
  if (!p) return false;

  try {
    const conn = await p.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(64) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'visitor',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      isDbAvailable = true;
      console.log('[DB] MariaDB users schema verified successfully.');
      return true;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.warn('[DB] MariaDB connection failed or table creation skipped. Memory store active:', (err as Error).message);
    isDbAvailable = false;
    return false;
  }
}

export function isMariaDbAvailable(): boolean {
  return isDbAvailable;
}
