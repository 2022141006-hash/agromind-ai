import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import { AppError } from '../../shared/utils/response';
import { env } from '../../config/env';
import { JwtPayload } from '../../shared/types';

const authRepository = new AuthRepository();

// Normaliza el nombre del rol a un valor canónico (sin acentos, minúsculas)
const normalizeRole = (rol: string): string => {
  const normalized = (rol || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const aliases: Record<string, string> = {
    admin: 'administrador',
    agronomo: 'agronomo',
    agricultor: 'agricultor',
    usuario: 'agricultor',
  };
  return aliases[normalized] || normalized;
};

export interface LoginResult {
  token: string;
  user: {
    id: number;
    nombre: string;
    apellido: string | null;
    email: string;
    avatar: string | null;
    rol: string;
    organizacion: string | null;
    cargo: string | null;
  };
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new AppError('Credenciales inválidas', 401);
    }

    await authRepository.updateLastAccess(user.id);

    const normalizedRole = normalizeRole((user as any).rol_nombre);

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      rolId: user.rol_id,
      rolNombre: normalizedRole,
    };

    const token = jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn as any });

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        avatar: user.avatar,
        rol: normalizedRole,
        organizacion: user.organizacion,
        cargo: user.cargo,
      },
    };
  }

  async register(data: {
    nombre: string;
    apellido?: string;
    email: string;
    password: string;
    rol_id?: number;
    organizacion?: string;
    cargo?: string;
    telefono?: string;
  }): Promise<{ id: number }> {
    const existing = await authRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('Ya existe un usuario con ese correo electrónico', 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const id = await authRepository.create({
      ...data,
      rol_id: data.rol_id || 3,
      password_hash: passwordHash,
    } as any);

    return { id };
  }

  async me(userId: number) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return { ...user, rol_nombre: normalizeRole((user as any).rol_nombre) };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);
    // Always return success to avoid email enumeration
    if (!user) return;

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour
    await authRepository.saveResetToken(user.id, token, expires);

    // TODO: Send email with token - configure SMTP in production
    console.log(`🔑 Reset token for ${email}: ${token}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await authRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Token de recuperación inválido o expirado', 400);
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await authRepository.updatePassword(user.id, passwordHash);
  }
}
