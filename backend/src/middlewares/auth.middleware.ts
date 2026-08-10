import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../shared/utils/response';
import { JwtPayload } from '../shared/types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Token de autenticación requerido', 401);
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, env.jwt.secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError('Token expirado. Inicie sesión nuevamente', 401);
    }
    throw new AppError('Token inválido', 401);
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('No autenticado', 401);
    }
    if (!roles.includes(req.user.rolNombre)) {
      throw new AppError('No tiene permisos para acceder a este recurso', 403);
    }
    next();
  };
};
