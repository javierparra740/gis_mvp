// src/repositories/userRepository.ts
import { pool } from '../config/db';
import { User } from '../models/User';

export const findByEmail = async (email: string): Promise<User | null> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    return rows[0] || null;
};

export const findById = async (id: string): Promise<User | null> => {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    return rows[0] || null;
};

export const insert = async (u: Omit<User, 'id'>): Promise<User> => {
    const { rows } = await pool.query(
        `INSERT INTO users(email, password, name, role)
     VALUES ($1,$2,$3,$4) RETURNING *`,
        [u.email, u.password, u.name, u.role || 'user']
    );
    return rows[0];
};