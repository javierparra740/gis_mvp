import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { User } from '../models/User';
import { getUserById } from '../services/userService';

export interface AuthRequest extends Request {
    user: User; // en lugar de {id, email}
}

interface JWTPayload { sub: string; email?: string; iat?: number; exp?: number; }


export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const hdr = req.headers.authorization;
    if (!hdr) { res.status(401).json({ message: 'Missing token' }); return; }

    const token = hdr.replace('Bearer ', '');
    console.log(token)
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        const user = await getUserById(decoded.sub);
        console.log('[Auth] JWT sub:', decoded.sub, '| User:', user ? 'FOUND' : 'NOT_FOUND');
        if (!user) { res.status(401).json({ message: 'User not found' }); return; }

        req.user = user; // ⬅️ ahora sí es User completo
        next();
    } catch { res.status(401).json({ message: 'Invalid token' }); }
};

export default auth;