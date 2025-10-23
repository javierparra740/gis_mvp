// src/routes/projectRoutes.ts
import { RequestHandler, Router } from 'express';
import * as ctrl from '../controllers/projectController';
import auth from '../middlewares/auth';
//import { projectSchemas } from '../middlewares/validate';
import { celebrate, Joi, Segments } from 'celebrate';

const router = Router();

router.use(auth as RequestHandler); // 🔒 todas protegidas

const uuid = Joi.string().uuid();

router.get('/', ctrl.list);

router.post(
    '/',
    celebrate({
        [Segments.BODY]: Joi.object({
            name: Joi.string().min(3).max(120).required(),
            description: Joi.string().max(500).optional(),
            deadline: Joi.date().iso().greater('now').required(),
            crs: Joi.string().max(50).required(),
            status: Joi.string().valid('active', 'archived').default('active'),
        }),
    }),
    ctrl.create
);

router.get('/:id', celebrate({ [Segments.PARAMS]: Joi.object({ id: uuid }) }), ctrl.single);

router.put(
    '/:id',
    celebrate({
        [Segments.PARAMS]: Joi.object({ id: uuid }),
        [Segments.BODY]: Joi.object({
            name: Joi.string().min(3).max(120),
            description: Joi.string().max(500),
            deadline: Joi.date().iso().greater('now'),
            crs: Joi.string().max(50),
            status: Joi.string().valid('active', 'archived'),
        }).min(1),
    }),
    ctrl.update
);

router.delete('/:id', celebrate({ [Segments.PARAMS]: Joi.object({ id: uuid }) }), ctrl.deleteOne);

router.post('/:id/clone', celebrate({ [Segments.PARAMS]: Joi.object({ id: uuid }) }), ctrl.clone);

export default router;