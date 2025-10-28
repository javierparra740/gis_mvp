// src/routes/authRoutes.ts
import { Router } from 'express';
import { login, register, refreshToken } from '../controllers/authController';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

router.post(
    '/register',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).required(),  // Aumenta min
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),  // Agrega confirm
            name: Joi.string().max(120).required(),
            role: Joi.string().valid('admin', 'user').default('user'),
        }),
    }),
    register
);

router.post(
    '/login',
    celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
        }),
    }),
    login
);

router.post(
    '/refresh',
    celebrate({
        [Segments.BODY]: Joi.object({
            refreshToken: Joi.string().required(),
        }),
    }),
    refreshToken
);

export default router;