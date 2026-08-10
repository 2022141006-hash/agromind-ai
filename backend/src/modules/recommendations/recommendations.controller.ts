import { Request, Response, NextFunction } from 'express';
import { RecommendationsService } from './recommendations.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';

const recommendationsService = new RecommendationsService();

export class RecommendationsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const result = await recommendationsService.create(userId, req.body);
      sendCreated(res, result, 'Recomendación generada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const rolNombre = req.user!.rolNombre;
      const isAdmin = rolNombre === 'administrador' || rolNombre === 'agronomo';
      const result = await recommendationsService.findAll(req.query, userId, isAdmin);
      sendSuccess(res, result, 'Recomendaciones obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await recommendationsService.findById(Number(req.params.id));
      sendSuccess(res, result, 'Recomendación obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const isAdmin = req.user!.rolNombre === 'administrador';
      const result = await recommendationsService.delete(Number(req.params.id), userId, isAdmin);
      sendSuccess(res, result, 'Recomendación eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const isAdmin = ['administrador', 'agronomo'].includes(req.user!.rolNombre);
      const result = await recommendationsService.getDashboardStats(isAdmin ? undefined : userId);
      sendSuccess(res, result, 'Estadísticas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  }
}
