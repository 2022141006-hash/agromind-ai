import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/utils/response';
import logger from '../config/logger';

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn(`[${req.method}] ${req.path} - ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Knex/MySQL errors
  if ((err as NodeJS.ErrnoException).code === 'ER_DUP_ENTRY') {
    res.status(409).json({
      success: false,
      message: 'Ya existe un registro con ese valor. Verifique los datos e intente nuevamente.',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  logger.error(`[${req.method}] ${req.path} - Internal Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor. Por favor, inténtelo más tarde.',
    timestamp: new Date().toISOString(),
  });
};
