import bcrypt from 'bcryptjs';
import { getDbPool, isMariaDbAvailable } from './db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at?: string;
}

// In-memory fallback store
const inMemoryUsers = new Map<string, UserRecord>();

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normEmail = email.toLowerCase().trim();
  const pool = getDbPool();

  if (pool && isMariaDbAvailable()) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1',
        [normEmail]
      );
      if (rows.length > 0) {
        return rows[0] as UserRecord;
      }
    } catch (err) {
      console.warn('[USERS] MariaDB query failed, checking memory store:', (err as Error).message);
    }
  }

  return inMemoryUsers.get(normEmail) || null;
}

export async function findUserById(id: string): Promise<UserRecord | null> {
  const pool = getDbPool();

  if (pool && isMariaDbAvailable()) {
    try {
      const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      if (rows.length > 0) {
        return rows[0] as UserRecord;
      }
    } catch (err) {
      console.warn('[USERS] MariaDB findById failed:', (err as Error).message);
    }
  }

  for (const u of inMemoryUsers.values()) {
    if (u.id === id) return u;
  }
  return null;
}

export async function createUser(
  email: string,
  passwordPlain: string,
  name: string,
  role: string = 'visitor'
): Promise<UserRecord> {
  const normEmail = email.toLowerCase().trim();
  const existing = await findUserByEmail(normEmail);
  if (existing) {
    throw new Error('User already exists with this email.');
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(passwordPlain, salt);
  const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const userRec: UserRecord = {
    id,
    email: normEmail,
    password_hash,
    name,
    role,
    created_at: new Date().toISOString()
  };

  const pool = getDbPool();
  if (pool && isMariaDbAvailable()) {
    try {
      await pool.query<ResultSetHeader>(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)',
        [id, normEmail, password_hash, name, role]
      );
    } catch (err) {
      console.warn('[USERS] Failed DB insert, saving to memory store:', (err as Error).message);
    }
  }

  inMemoryUsers.set(normEmail, userRec);
  return userRec;
}

export async function verifyCredentials(email: string, passwordPlain: string): Promise<UserRecord | null> {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const match = await bcrypt.compare(passwordPlain, user.password_hash);
  if (!match) return null;

  return user;
}

export async function seedAdminIfEmpty(): Promise<void> {
  const adminEmail = 'admin@businesshub.app';
  const existing = await findUserByEmail(adminEmail);
  if (!existing) {
    console.log('[USERS] Seeding initial admin account: admin@businesshub.app');
    await createUser(adminEmail, 'AdminPass2026!', 'Business HUB Executive', 'admin');
  }
}
