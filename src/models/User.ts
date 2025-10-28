// src/models/User.ts
export type UserRole = 'Viewer' | 'Editor' | 'ProjectManager' | 'Admin' | 'SuperAdmin' | 'External';

export interface User {
    id: number;
    email: string;
    password_hash: string;
    role: UserRole;
    organization_id: number | null;
    created_at: string;
}