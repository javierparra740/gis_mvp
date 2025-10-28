// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
//import bcrypt from 'bcryptjs';
import { registerUser, validatePassword, getUserById } from '../services/userService';
import { findByEmail } from '../repositories/userRepository';
import {
  JWT_SECRET,
  JWT_REFRESH_SECRET
} from '../config/constants';

const isStrongPassword = (p: string): boolean =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(p);

/* ---------- LOGIN ---------- */
export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await validatePassword(email, password);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const accessToken  = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });
    const refreshToken = jwt.sign({ sub: user.id }, JWT_REFRESH_SECRET, {
      expiresIn: '15m'
    });
    res.json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
};

/* ---------- REGISTER ---------- */
export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, role, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      res.status(400).json({ message: 'Passwords do not match' });
      return;
    }
    if (!isStrongPassword(password)) {
      res.status(400).json({
        message: 'Password must be 8+ chars, upper, lower, number, special',
      });
      return;
    }
    if (await findByEmail(email)) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }
    const user = await registerUser({ email, rawPassword: password, name, role });
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    next(e);
  }
};

/* ---------- REFRESH TOKEN ---------- */
export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token required' });
      return;
    }
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { sub: string };
    const user  = await getUserById(decoded.sub);
    if (!user) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }
    const accessToken = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '15m',
    });
    res.json({ accessToken });
  } catch (e) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};