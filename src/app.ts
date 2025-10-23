// src/app.ts
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import projectRoutes from './routes/projectRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { errors } from 'celebrate';
import authRoutes from './routes/authRoutes';

const app: Application = express();

/* ---------- GLOBAL MIDDLEWARES ---------- */
app.use(helmet());
app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);

/* ---------- HEALTH CHECK ---------- */
app.get('/ping', (_, res) => res.send('pong'));

/* ---------- CENTRALIZED ERROR HANDLER ---------- */
app.use(errors()); // ← debe ir DESPUÉS de las rutas
app.use(errorHandler);

export default app;