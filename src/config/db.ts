// src/config/db.ts
import { Pool } from 'pg';
import { DATABASE_URL } from './env';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Salud rápida al arrancar
pool.query('SELECT 1').then(() => console.log('🐘 PostgreSQL connected')).catch(console.error);