// src/middlewares/validate.ts
import { celebrate, Joi, Segments } from 'celebrate';

/* ---------- Esquemas reutilizables ---------- */
const uuid = Joi.string().uuid();

export const projectSchemas = {
    create: celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().min(3).max(120).required(),
            description: Joi.string().max(500).optional(),
            deadline: Joi.date().iso().greater('now').required(),
            crs: Joi.string().max(50).required(),
            ownerId: uuid.required(),
            status: Joi.string().valid('active', 'archived').default('active'),
        }),
    }),

    update: celebrate({
        [Segments.PARAMS]: Joi.object({ id: uuid.required() }),
        [Segments.BODY]: Joi.object({
            name: Joi.string().min(3).max(120),
            description: Joi.string().max(500),
            deadline: Joi.date().iso().greater('now'),
            crs: Joi.string().max(50),
            ownerId: uuid,
            status: Joi.string().valid('active', 'archived'),
        }).min(1), // al menos 1 campo
    }),

    byId: celebrate({
        [Segments.PARAMS]: Joi.object({ id: uuid.required() }),
    }),
};