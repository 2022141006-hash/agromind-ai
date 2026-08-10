import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendCreated } from '../../shared/utils/response';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      sendSuccess(res, result, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result, 'Usuario registrado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await authService.me(userId);
      sendSuccess(res, user, 'Perfil obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);
      sendSuccess(res, null, 'Si el correo existe, recibirás instrucciones de recuperación');
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);
      sendSuccess(res, null, 'Contraseña restablecida exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // Stateless JWT: client deletes token
    sendSuccess(res, null, 'Sesión cerrada exitosamente');
  }
}
