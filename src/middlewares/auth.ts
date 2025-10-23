import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants';
import { User } from '../models/User';
import { getUserById } from '../services/userService';

export interface AuthRequest extends Request {
    user: User; // en lugar de {id, email}
}

// req se tipa con el genérico Request, no con AuthRequest
/* const user = await getUserById(decoded.sub);
if (!user) throw new Error('User not found');
req.user = user; */
/* const auth = (req: Request, res: Response, next: NextFunction): void => {
    const hdr = req.headers.authorization;
    if (!hdr) {
        res.status(401).json({ message: 'Missing token' });
        return;
    }

    const token = hdr.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        // Cast explícito a AuthRequest para añadir la propiedad user
        (req as AuthRequest).user = { id: decoded.sub, email: decoded.email };
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}; */
export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const hdr = req.headers.authorization;
    if (!hdr) { res.status(401).json({ message: 'Missing token' }); return; }

    const token = hdr.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = await getUserById(decoded.sub);
        if (!user) { res.status(401).json({ message: 'User not found' }); return; }

        req.user = user; // ⬅️ ahora sí es User completo
        next();
    } catch { res.status(401).json({ message: 'Invalid token' }); }
};

export default auth;