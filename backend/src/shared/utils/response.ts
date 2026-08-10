import { Response } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operación exitosa',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: { field: string; message: string }[]
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message: string = 'Recurso creado exitosamente'): Response =>
  sendSuccess(res, data, message, 201);

export const sendNoContent = (res: Response): Response => res.status(204).send();
