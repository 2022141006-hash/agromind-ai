import db from '../../config/database';
import { Recomendacion, PaginationQuery, PaginatedResult } from '../../shared/types';

export class RecommendationsRepository {
  async create(data: Partial<Recomendacion>): Promise<number> {
    const [id] = await db('recomendaciones').insert(data);
    return id;
  }

  async findById(id: number): Promise<Recomendacion | null> {
    const rec = await db('recomendaciones as r')
      .leftJoin('cultivos as c', 'r.cultivo_id', 'c.id')
      .leftJoin('tipos_suelo as ts', 'r.tipo_suelo_id', 'ts.id')
      .leftJoin('fertilizantes as f', 'r.fertilizante_id', 'f.id')
      .leftJoin('tipos_fertilizantes as tf', 'f.tipo_fertilizante_id', 'tf.id')
      .leftJoin('empresas_fabricantes as ef', 'f.fabricante_id', 'ef.id')
      .leftJoin('usuarios as u', 'r.usuario_id', 'u.id')
      .where('r.id', id)
      .where('r.estado', 1)
      .select(
        'r.*',
        'c.nombre as cultivo_nombre',
        'c.nombre_cientifico as cultivo_nombre_cientifico',
        'c.familia as cultivo_familia',
        'c.ciclo_cultivo',
        'ts.nombre as tipo_suelo_nombre',
        'ts.descripcion as tipo_suelo_descripcion',
        'ts.ph_tipico_min', 'ts.ph_tipico_max',
        'f.codigo as fertilizante_codigo',
        'f.nombre as fertilizante_nombre',
        'f.nombre_comercial as fertilizante_nombre_comercial',
        'f.descripcion as fertilizante_descripcion',
        'f.formula_quimica',
        'f.concentracion_n', 'f.concentracion_p', 'f.concentracion_k',
        'f.modo_aplicacion as fertilizante_modo_aplicacion',
        'f.frecuencia_aplicacion',
        'f.momento_aplicacion',
        'f.tiempo_accion',
        'f.beneficios as fertilizante_beneficios',
        'f.nivel_riesgo as fertilizante_nivel_riesgo',
        'f.precio_referencia',
        'f.unidad_precio',
        'f.disponibilidad',
        'tf.nombre as tipo_fertilizante_nombre',
        'ef.nombre as fabricante_nombre',
        'ef.pais as fabricante_pais',
        'ef.sitio_web as fabricante_sitio_web',
        'u.nombre as usuario_nombre',
        'u.email as usuario_email'
      )
      .first();

    if (!rec) return null;

    if (rec.fertilizante_id) {
      const nutrientes = await db('fertilizante_nutrientes as fn')
        .join('nutrientes as n', 'fn.nutriente_id', 'n.id')
        .where('fn.fertilizante_id', rec.fertilizante_id)
        .select('n.nombre', 'n.simbolo', 'n.tipo', 'n.funcion_planta', 'n.deficiencia_sintomas', 'fn.porcentaje', 'fn.es_primario');
      (rec as any).nutrientes = nutrientes;
    }

    return rec;
  }

  async findAll(
    filters: PaginationQuery & { cultivo_id?: number; tipo_suelo_id?: number; desde?: Date; hasta?: Date; usuario_id?: number }
  ): Promise<PaginatedResult<Recomendacion>> {
    const { page = 1, limit = 20, sort = 'created_at', order = 'desc', search, cultivo_id, tipo_suelo_id, desde, hasta, usuario_id } = filters;
    const offset = (page - 1) * limit;

    const baseQuery = db('recomendaciones as r')
      .leftJoin('cultivos as c', 'r.cultivo_id', 'c.id')
      .leftJoin('tipos_suelo as ts', 'r.tipo_suelo_id', 'ts.id')
      .leftJoin('fertilizantes as f', 'r.fertilizante_id', 'f.id')
      .leftJoin('usuarios as u', 'r.usuario_id', 'u.id')
      .where('r.estado', 1);

    if (usuario_id) baseQuery.where('r.usuario_id', usuario_id);
    if (cultivo_id) baseQuery.where('r.cultivo_id', cultivo_id);
    if (tipo_suelo_id) baseQuery.where('r.tipo_suelo_id', tipo_suelo_id);
    if (desde) baseQuery.where('r.created_at', '>=', desde);
    if (hasta) baseQuery.where('r.created_at', '<=', hasta);
    if (search) {
      baseQuery.where(function () {
        this.where('c.nombre', 'like', `%${search}%`)
          .orWhere('f.nombre', 'like', `%${search}%`)
          .orWhere('ts.nombre', 'like', `%${search}%`);
      });
    }

    const [{ total }] = await baseQuery.clone().count('r.id as total');
    const totalCount = Number(total);

    const data = await baseQuery
      .orderBy(`r.${sort}`, order)
      .limit(limit)
      .offset(offset)
      .select(
        'r.id', 'r.usuario_id', 'r.cultivo_id', 'r.tipo_suelo_id', 'r.fertilizante_id',
        'r.temperatura', 'r.humedad', 'r.ph', 'r.nitrogeno', 'r.fosforo', 'r.potasio',
        'r.materia_organica', 'r.conductividad_electrica',
        'r.cantidad_recomendada', 'r.unidad_cantidad', 'r.nivel_confianza',
        'r.nivel_riesgo', 'r.estado_analisis', 'r.created_at',
        'r.fertilizante_codigo_predicho',
        'c.nombre as cultivo_nombre',
        'ts.nombre as tipo_suelo_nombre',
        'f.nombre as fertilizante_nombre',
        'f.codigo as fertilizante_codigo',
        'u.nombre as usuario_nombre'
      );

    return {
      data,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      },
    };
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const affected = await db('recomendaciones')
      .where('id', id)
      .where('usuario_id', userId)
      .update({ estado: 0 });
    return affected > 0;
  }

  async getDashboardStats(userId?: number): Promise<Record<string, unknown>> {
    const baseQuery = db('recomendaciones').where('estado', 1);
    if (userId) baseQuery.where('usuario_id', userId);

    const [totalResult] = await baseQuery.clone().count('id as total');
    const [avgConfianza] = await baseQuery.clone().avg('nivel_confianza as promedio');

    const porCultivo = await baseQuery.clone()
      .join('cultivos', 'recomendaciones.cultivo_id', 'cultivos.id')
      .groupBy('cultivos.nombre')
      .select('cultivos.nombre')
      .count('recomendaciones.id as cantidad')
      .orderBy('cantidad', 'desc')
      .limit(5);

    const porFertilizante = await baseQuery.clone()
      .join('fertilizantes', 'recomendaciones.fertilizante_id', 'fertilizantes.id')
      .where('recomendaciones.fertilizante_id', '!=', null)
      .groupBy('fertilizantes.nombre', 'fertilizantes.codigo')
      .select('fertilizantes.nombre', 'fertilizantes.codigo')
      .count('recomendaciones.id as cantidad')
      .orderBy('cantidad', 'desc')
      .limit(5);

    const ultimosMeses = await db.raw(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as mes, COUNT(*) as cantidad
      FROM recomendaciones
      WHERE estado = 1 AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      ${userId ? `AND usuario_id = ${userId}` : ''}
      GROUP BY mes ORDER BY mes ASC
    `);

    return {
      total: Number((totalResult as any).total),
      promedioConfianza: Number((avgConfianza as any).promedio) || 0,
      porCultivo,
      porFertilizante,
      ultimosMeses: ultimosMeses[0],
    };
  }

  async findByFertilizanteCodigo(codigo: string): Promise<number | null> {
    const fert = await db('fertilizantes').where('codigo', codigo).where('estado', 1).select('id').first();
    return fert ? fert.id : null;
  }
}