// src/services/userService.ts
import * as repo from '../repositories/userRepository';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const registerUser = async (
    dto: Pick<User, 'email' | 'name' | 'role'> & { rawPassword: string }
): Promise<User> => {
    const hashed = await bcrypt.hash(dto.rawPassword, 12);
    return repo.insert({ email: dto.email, password: hashed, name: dto.name, role: dto.role });
};

export const validatePassword = async (
    email: string,
    rawPassword: string
): Promise<User | null> => {
    const user = await repo.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(rawPassword, user.password);
    return ok ? user : null;
};

export const getUserById = (id: string): Promise<User | null> => repo.findById(id);