// src/app.ts
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';

const app: Application = express();

/* ---------- GLOBAL MIDDLEWARES ---------- */
app.use(express.json());
// Seguridad: Headers

app.use(helmet());

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000' }));  // Configura origins

// Rate Limiting: Global (ajusta por endpoint si necesitas)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 1000, // Límite por IP
});
app.use(limiter);

// Rate Limiting específico para auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // Solo 5 intentos por IP para login/register
    message: 'Too many login attempts, try again later.',
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

/* ---------- ROUTES ---------- */
/* app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes); */


/* ---------- HEALTH CHECK ---------- */
app.get('/ping', (_, res) => res.send('pong'));

/* ---------- CENTRALIZED ERROR HANDLER ---------- */
app.use(errors()); // ← debe ir DESPUÉS de las rutas
app.use(errorHandler);

export default app;