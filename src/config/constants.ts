// src/config/constants.ts
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || (() => { throw new Error('JWT_REFRESH_SECRET is required'); })();
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const BCRYPT_SALT_ROUNDS = 12;

export const AUDIT_ACTIONS = {
    PROJECT_CREATE: 'PROJECT_CREATE',
    PROJECT_UPDATE: 'PROJECT_UPDATE',
    PROJECT_DELETE: 'PROJECT_DELETE',
    PROJECT_CLONE: 'PROJECT_CLONE',
} as const;