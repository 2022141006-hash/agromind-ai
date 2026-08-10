import db from '../../config/database';
import { Usuario } from '../../shared/types';

export class AuthRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    const user = await db('usuarios')
      .join('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.email', email)
      .where('usuarios.estado', 1)
      .select(
        'usuarios.*',
        'roles.nombre as rol_nombre',
        'roles.permisos as rol_permisos'
      )
      .first();
    return user || null;
  }

  async findById(id: number): Promise<Usuario | null> {
    const user = await db('usuarios')
      .join('roles', 'usuarios.rol_id', 'roles.id')
      .where('usuarios.id', id)
      .where('usuarios.estado', 1)
      .select(
        'usuarios.id',
        'usuarios.rol_id',
        'usuarios.nombre',
        'usuarios.apellido',
        'usuarios.email',
        'usuarios.avatar',
        'usuarios.telefono',
        'usuarios.organizacion',
        'usuarios.cargo',
        'usuarios.ultimo_acceso',
        'usuarios.created_at',
        'roles.nombre as rol_nombre'
      )
      .first();
    return user || null;
  }

  async create(data: Partial<Usuario>): Promise<number> {
    const [id] = await db('usuarios').insert(data);
    return id;
  }

  async updateLastAccess(userId: number): Promise<void> {
    await db('usuarios').where('id', userId).update({ ultimo_acceso: db.fn.now() });
  }

  async saveResetToken(userId: number, token: string, expires: Date): Promise<void> {
    await db('usuarios').where('id', userId).update({
      reset_token: token,
      reset_token_expires: expires,
    });
  }

  async findByResetToken(token: string): Promise<Usuario | null> {
    const user = await db('usuarios')
      .where('reset_token', token)
      .where('reset_token_expires', '>', db.fn.now())
      .where('estado', 1)
      .first();
    return user || null;
  }

  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await db('usuarios').where('id', userId).update({
      password_hash: passwordHash,
      reset_token: null,
      reset_token_expires: null,
    });
  }
}
