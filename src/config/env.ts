// src/config/env.ts
import * as dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

export const PORT = Number(process.env.PORT) || 4000;
export const DATABASE_URL = required('DATABASE_URL');
export const JWT_SECRET = required('JWT_SECRET');