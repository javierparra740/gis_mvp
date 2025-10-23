// src/routes/projectRoutes.ts
import { RequestHandler, Router } from 'express';
import * as ctrl from '../controllers/projectController';
import auth from '../middlewares/auth';
import { projectSchemas } from '../middlewares/validate';

const router = Router();


router.use(auth as RequestHandler); // all endpoints protected

router.get('/', ctrl.list);
router.post('/',projectSchemas.create, ctrl.create);
router.get('/:id',projectSchemas.byId, ctrl.single);
router.put('/:id',projectSchemas.update, ctrl.update);
router.delete('/:id',projectSchemas.byId, ctrl.deleteOne);
router.post('/:id/clone',projectSchemas.byId, ctrl.clone);

export default router;