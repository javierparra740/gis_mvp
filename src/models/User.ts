// src/models/User.ts
export interface User {
    id: string;
    email: string;
    password: string;        // hashed
    name: string;
    role: 'admin' | 'user';
}