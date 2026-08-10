import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../shared/utils/response';

export const validate = (schema: Joi.ObjectSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[source];
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/['"]/g, ''),
      }));
      const errorMessage = errors.map((e) => `${e.field}: ${e.message}`).join('; ');
      const appError = new AppError(`Datos de entrada inválidos: ${errorMessage}`, 422);
      next(appError);
      return;
    }

    req[source] = value;
    next();
  };
};
