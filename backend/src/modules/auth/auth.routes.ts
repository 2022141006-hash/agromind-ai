import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validator';

const router = Router();
const controller = new AuthController();

router.post('/login', validate(loginSchema), controller.login.bind(controller));
router.post('/register', validate(registerSchema), controller.register.bind(controller));
router.post('/logout', authMiddleware, controller.logout.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword.bind(controller));
router.post('/reset-password', validate(resetPasswordSchema), controller.resetPassword.bind(controller));

export default router;
