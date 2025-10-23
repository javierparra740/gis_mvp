// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    const status = err.statusCode || err.status || 500;
    const message = err.message || 'Internal Server Error';

    console.error('[ERROR]', { status, message, stack: err.stack });

    // ➜ Guardar en disco
    logger.error(message, { status, stack: err.stack });

    res.status(status).json({
        error: {
            status,
            message,
            ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
        },
    });
};