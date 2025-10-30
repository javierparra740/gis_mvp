// src/services/userService.ts
import * as repo from '../repositories/userRepository';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const registerUser = async (
    dto: Pick<User, 'email' | 'name' | 'role'> & { rawPassword: string }
): Promise<User> => {
    const hashed = await bcrypt.hash(dto.rawPassword, 12);
    return repo.insert({
        email: dto.email, password_hash: hashed, name: dto.name, role: dto.role,
        organization_id: null,
        created_at: ''
    });
};

export const validatePassword = async (
    email: string,
    rawPassword: string
): Promise<User | null> => {
    const user = await repo.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(rawPassword, user.password_hash);
    return ok ? user : null;
};

export const getUserById = (id: string): Promise<User | null> => repo.findById(id);