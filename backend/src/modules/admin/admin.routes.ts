import { Router } from 'express';
import { authMiddleware, requireRole } from '../../middlewares/auth.middleware';
import db from '../../config/database';
import { sendSuccess, sendCreated, AppError } from '../../shared/utils/response';
import { validate } from '../../middlewares/validate.middleware';
import Joi from 'joi';

const router = Router();
router.use(authMiddleware);

// ─── Crops (Cultivos) ─────────────────────────────────────────
const cultivoSchema = Joi.object({
  nombre: Joi.string().min(2).max(100).required(),
  nombre_cientifico: Joi.string().max(150).optional().allow('', null),
  descripcion: Joi.string().optional().allow('', null),
  familia: Joi.string().max(100).optional().allow('', null),
  ciclo_cultivo: Joi.string().max(100).optional().allow('', null),
  temperatura_optima_min: Joi.number().optional().allow(null),
  temperatura_optima_max: Joi.number().optional().allow(null),
  humedad_optima_min: Joi.number().optional().allow(null),
  humedad_optima_max: Joi.number().optional().allow(null),
  ph_optimo_min: Joi.number().optional().allow(null),
  ph_optimo_max: Joi.number().optional().allow(null),
  requerimiento_n: Joi.string().optional().allow('', null),
  requerimiento_p: Joi.string().optional().allow('', null),
  requerimiento_k: Joi.string().optional().allow('', null),
});

router.get('/crops', async (_req, res, next) => {
  try {
    const data = await db('cultivos').where('estado', 1).orderBy('nombre', 'asc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.post('/crops', requireRole('administrador', 'agronomo'), validate(cultivoSchema), async (req, res, next) => {
  try {
    const [id] = await db('cultivos').insert({ ...req.body, estado: 1 });
    const created = await db('cultivos').where('id', id).first();
    sendCreated(res, created, 'Cultivo creado exitosamente');
  } catch (e) { next(e); }
});

router.put('/crops/:id', requireRole('administrador', 'agronomo'), validate(cultivoSchema), async (req, res, next) => {
  try {
    await db('cultivos').where('id', req.params.id).update(req.body);
    const updated = await db('cultivos').where('id', req.params.id).first();
    sendSuccess(res, updated, 'Cultivo actualizado exitosamente');
  } catch (e) { next(e); }
});

router.delete('/crops/:id', requireRole('administrador'), async (req, res, next) => {
  try {
    await db('cultivos').where('id', req.params.id).update({ estado: 0 });
    sendSuccess(res, null, 'Cultivo eliminado exitosamente');
  } catch (e) { next(e); }
});

// ─── Soil Types (Tipos de Suelo) ──────────────────────────────
router.get('/soil-types', async (_req, res, next) => {
  try {
    const data = await db('tipos_suelo').where('estado', 1).orderBy('nombre', 'asc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// ─── Fertilizers ──────────────────────────────────────────────
router.get('/fertilizers', async (req, res, next) => {
  try {
    const data = await db('fertilizantes as f')
      .leftJoin('tipos_fertilizantes as tf', 'f.tipo_fertilizante_id', 'tf.id')
      .leftJoin('empresas_fabricantes as ef', 'f.fabricante_id', 'ef.id')
      .where('f.estado', 1)
      .orderBy('f.nombre', 'asc')
      .select('f.*', 'tf.nombre as tipo_nombre', 'ef.nombre as fabricante_nombre');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.get('/fertilizers/:id', async (req, res, next) => {
  try {
    const fert = await db('fertilizantes as f')
      .leftJoin('tipos_fertilizantes as tf', 'f.tipo_fertilizante_id', 'tf.id')
      .leftJoin('empresas_fabricantes as ef', 'f.fabricante_id', 'ef.id')
      .where('f.id', req.params.id).where('f.estado', 1)
      .select('f.*', 'tf.nombre as tipo_nombre', 'ef.nombre as fabricante_nombre', 'ef.sitio_web', 'ef.pais')
      .first();
    if (!fert) throw new AppError('Fertilizante no encontrado', 404);
    const nutrientes = await db('fertilizante_nutrientes as fn')
      .join('nutrientes as n', 'fn.nutriente_id', 'n.id')
      .where('fn.fertilizante_id', fert.id)
      .select('n.*', 'fn.porcentaje', 'fn.es_primario');
    sendSuccess(res, { ...fert, nutrientes });
  } catch (e) { next(e); }
});

// ─── Users (Admin only) ───────────────────────────────────────
router.get('/users', requireRole('administrador'), async (_req, res, next) => {
  try {
    const data = await db('usuarios as u')
      .join('roles as r', 'u.rol_id', 'r.id')
      .where('u.estado', 1)
      .select('u.id', 'u.nombre', 'u.apellido', 'u.email', 'u.organizacion', 'u.cargo', 'u.ultimo_acceso', 'u.created_at', 'r.nombre as rol_nombre');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.put('/users/:id', requireRole('administrador'), async (req, res, next) => {
  try {
    const allowed = ['nombre', 'apellido', 'email', 'rol_id', 'organizacion', 'cargo', 'telefono', 'estado'];
    const data = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    await db('usuarios').where('id', req.params.id).update(data);
    sendSuccess(res, null, 'Usuario actualizado exitosamente');
  } catch (e) { next(e); }
});

router.delete('/users/:id', requireRole('administrador'), async (req, res, next) => {
  try {
    await db('usuarios').where('id', req.params.id).update({ estado: 0 });
    sendSuccess(res, null, 'Usuario desactivado exitosamente');
  } catch (e) { next(e); }
});

// ─── Roles ────────────────────────────────────────────────────
router.get('/roles', requireRole('administrador'), async (_req, res, next) => {
  try {
    const data = await db('roles').where('estado', 1).orderBy('id');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// ─── Manufacturers ────────────────────────────────────────────
router.get('/manufacturers', async (_req, res, next) => {
  try {
    const data = await db('empresas_fabricantes').where('estado', 1).orderBy('nombre', 'asc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// ─── Nutrients ────────────────────────────────────────────────
router.get('/nutrients', async (_req, res, next) => {
  try {
    const data = await db('nutrientes').where('estado', 1).orderBy('tipo').orderBy('nombre');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

// ─── Dashboard Stats (global) ─────────────────────────────────
router.get('/dashboard', requireRole('administrador', 'agronomo'), async (_req, res, next) => {
  try {
    const [usuarios] = await db('usuarios').where('estado', 1).count('id as total');
    const [cultivos] = await db('cultivos').where('estado', 1).count('id as total');
    const [fertilizantes] = await db('fertilizantes').where('estado', 1).count('id as total');
    const [recomendaciones] = await db('recomendaciones').where('estado', 1).count('id as total');
    const [avgConf] = await db('recomendaciones').where('estado', 1).avg('nivel_confianza as avg');
    const modeloActivo = await db('modelo_ia').where('activo', 1).where('estado', 1).first();

    sendSuccess(res, {
      usuarios: Number((usuarios as any).total),
      cultivos: Number((cultivos as any).total),
      fertilizantes: Number((fertilizantes as any).total),
      recomendaciones: Number((recomendaciones as any).total),
      precisionModelo: Number((avgConf as any).avg) || 0,
      modeloActivo: modeloActivo || null,
    });
  } catch (e) { next(e); }
});

// ─── Reports ──────────────────────────────────────────────────
router.get('/reports/by-crop', requireRole('administrador', 'agronomo'), async (_req, res, next) => {
  try {
    const data = await db('recomendaciones as r')
      .join('cultivos as c', 'r.cultivo_id', 'c.id')
      .where('r.estado', 1)
      .groupBy('c.id', 'c.nombre')
      .select('c.nombre as cultivo', db.raw('COUNT(r.id) as total'), db.raw('AVG(r.nivel_confianza) as confianza_promedio'))
      .orderBy('total', 'desc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.get('/reports/by-fertilizer', requireRole('administrador', 'agronomo'), async (_req, res, next) => {
  try {
    const data = await db('recomendaciones as r')
      .join('fertilizantes as f', 'r.fertilizante_id', 'f.id')
      .where('r.estado', 1).whereNotNull('r.fertilizante_id')
      .groupBy('f.id', 'f.nombre', 'f.codigo')
      .select('f.nombre as fertilizante', 'f.codigo', db.raw('COUNT(r.id) as total'))
      .orderBy('total', 'desc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.get('/reports/by-soil', requireRole('administrador', 'agronomo'), async (_req, res, next) => {
  try {
    const data = await db('recomendaciones as r')
      .join('tipos_suelo as ts', 'r.tipo_suelo_id', 'ts.id')
      .where('r.estado', 1)
      .groupBy('ts.id', 'ts.nombre')
      .select('ts.nombre as tipo_suelo', db.raw('COUNT(r.id) as total'))
      .orderBy('total', 'desc');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.get('/reports/by-month', requireRole('administrador', 'agronomo'), async (_req, res, next) => {
  try {
    const data = await db.raw(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as total
      FROM recomendaciones WHERE estado = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY mes ORDER BY mes ASC
    `);
    sendSuccess(res, data[0]);
  } catch (e) { next(e); }
});

// ─── Config ───────────────────────────────────────────────────
router.get('/config', requireRole('administrador'), async (_req, res, next) => {
  try {
    const data = await db('configuraciones').where('estado', 1).orderBy('grupo').orderBy('clave');
    sendSuccess(res, data);
  } catch (e) { next(e); }
});

router.put('/config/:clave', requireRole('administrador'), async (req, res, next) => {
  try {
    await db('configuraciones').where('clave', req.params.clave).where('editable', 1).update({ valor: req.body.valor });
    sendSuccess(res, null, 'Configuración actualizada');
  } catch (e) { next(e); }
});

export default router;
