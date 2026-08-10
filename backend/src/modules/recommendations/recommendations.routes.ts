import { Router } from 'express';
import { RecommendationsController } from './recommendations.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createRecommendationSchema, queryRecommendationsSchema } from './recommendations.validator';

const router = Router();
const controller = new RecommendationsController();

router.use(authMiddleware);

router.post('/', validate(createRecommendationSchema), controller.create.bind(controller));
router.get('/', validate(queryRecommendationsSchema, 'query'), controller.findAll.bind(controller));
router.get('/stats', controller.getDashboardStats.bind(controller));
router.get('/:id', controller.findById.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

export default router;
