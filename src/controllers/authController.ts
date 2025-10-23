// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { registerUser, validatePassword } from '../services/userService';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants';
import { findByEmail } from '../repositories/userRepository';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await validatePassword(email, password);
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        res.json({ token });
    } catch (e) {
        next(e);
    }
};


export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password, name, role } = req.body;
        const existing = await findByEmail(email);
        if (existing) {
            res.status(409).json({ message: 'Email already registered' });
            return;
        }
        const user = await registerUser({ email, rawPassword: password, name, role });
        res.status(201).json({ id: user.id, email: user.email, name: user.name });
    } catch (e) {
        next(e);
    }
};
