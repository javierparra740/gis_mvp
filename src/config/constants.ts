// src/config/constants.ts
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-only-for-dev';
export const JWT_EXPIRES_IN = '7d';

export const BCRYPT_SALT_ROUNDS = 12;

export const AUDIT_ACTIONS = {
    PROJECT_CREATE: 'PROJECT_CREATE',
    PROJECT_UPDATE: 'PROJECT_UPDATE',
    PROJECT_DELETE: 'PROJECT_DELETE',
    PROJECT_CLONE: 'PROJECT_CLONE',
} as const;