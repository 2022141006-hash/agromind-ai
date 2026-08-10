import axios from 'axios';
import { RecommendationsRepository } from './recommendations.repository';
import { AppError } from '../../shared/utils/response';
import { env } from '../../config/env';
import { MLPredictionRequest, MLPredictionResponse } from '../../shared/types';
import db from '../../config/database';
import logger from '../../config/logger';

const recommendationsRepository = new RecommendationsRepository();

export class RecommendationsService {
  async create(userId: number, data: MLPredictionRequest & { notas_agronomo?: string }) {
    const startTime = Date.now();

    // 1. Validate that crop and soil type exist
    const cultivo = await db('cultivos').where('id', data.cultivo_id).where('estado', 1).first();
    if (!cultivo) throw new AppError('Cultivo no encontrado', 404);

    const tipoSuelo = await db('tipos_suelo').where('id', data.tipo_suelo_id).where('estado', 1).first();
    if (!tipoSuelo) throw new AppError('Tipo de suelo no encontrado', 404);

    // 2. Get active ML model
    const modeloIA = await db('modelo_ia').where('activo', 1).where('estado', 1).first();

    // 3. Call ML service
    let mlResponse: MLPredictionResponse;
    try {
      const response = await axios.post<MLPredictionResponse>(
        `${env.ml.serviceUrl}/predict`,
        data,
        { timeout: env.ml.timeout }
      );
      mlResponse = response.data;
    } catch (error) {
      logger.error('Error calling ML service:', error);
      throw new AppError('El servicio de predicción no está disponible. Inténtelo más tarde.', 503);
    }

    // 4. Find fertilizer in database by code returned by ML
    let fertilizanteId: number | null = null;
    if (mlResponse.fertilizante_codigo) {
      fertilizanteId = await recommendationsRepository.findByFertilizanteCodigo(mlResponse.fertilizante_codigo);
    }

    // 5. Determine risk level based on deficiencies
    let nivelRiesgo: 'bajo' | 'moderado' | 'alto' = 'bajo';
    if (mlResponse.deficiencias.length >= 3) nivelRiesgo = 'alto';
    else if (mlResponse.deficiencias.length >= 1) nivelRiesgo = 'moderado';

    const processingTime = Date.now() - startTime;

    // 6. Build agronomic recommendations based on soil and crop
    const recomendacionesAdicionales = this.buildAdditionalRecommendations(cultivo, tipoSuelo, data);
    const buenasPracticas = this.buildBestPractices(cultivo);

    // 7. Save recommendation to database
    const recId = await recommendationsRepository.create({
      usuario_id: userId,
      cultivo_id: data.cultivo_id,
      tipo_suelo_id: data.tipo_suelo_id,
      fertilizante_id: fertilizanteId,
      modelo_ia_id: modeloIA?.id || null,
      temperatura: data.temperatura,
      humedad: data.humedad,
      ph: data.ph,
      nitrogeno: data.nitrogeno,
      fosforo: data.fosforo,
      potasio: data.potasio,
      materia_organica: data.materia_organica,
      conductividad_electrica: data.conductividad_electrica,
      fertilizante_codigo_predicho: mlResponse.fertilizante_codigo,
      cantidad_recomendada: mlResponse.cantidad_kg,
      nivel_confianza: mlResponse.confianza,
      deficiencias_detectadas: JSON.stringify(mlResponse.deficiencias) as any,
      justificacion: mlResponse.justificacion,
      recomendaciones_adicionales: recomendacionesAdicionales,
      buenas_practicas: buenasPracticas,
      nivel_riesgo: nivelRiesgo,
      notas_agronomo: data.notas_agronomo || null,
      estado_analisis: 'completado',
      tiempo_procesamiento_ms: processingTime,
      estado: 1,
    });

    // 8. Log to historial
    await db('historial_analisis').insert({
      recomendacion_id: recId,
      usuario_id: userId,
      accion: 'creacion',
      descripcion: `Nueva recomendación para cultivo: ${cultivo.nombre}`,
      estado: 1,
    });

    // 9. Return full enriched recommendation
    return await recommendationsRepository.findById(recId);
  }

  async findAll(filters: any, userId?: number, isAdmin: boolean = false) {
    const queryFilters = isAdmin ? filters : { ...filters, usuario_id: userId };
    return await recommendationsRepository.findAll(queryFilters);
  }

  async findById(id: number) {
    const rec = await recommendationsRepository.findById(id);
    if (!rec) throw new AppError('Recomendación no encontrada', 404);
    return rec;
  }

  async delete(id: number, userId: number, isAdmin: boolean) {
    // Admin can delete any, user only their own
    if (isAdmin) {
      const affected = await db('recomendaciones').where('id', id).update({ estado: 0 });
      if (!affected) throw new AppError('Recomendación no encontrada', 404);
    } else {
      const deleted = await recommendationsRepository.delete(id, userId);
      if (!deleted) throw new AppError('Recomendación no encontrada o sin permisos', 404);
    }

    // Log deletion
    await db('historial_analisis').insert({
      recomendacion_id: id,
      usuario_id: userId,
      accion: 'eliminacion',
      descripcion: 'Recomendación eliminada',
      estado: 1,
    });

    return { deleted: true };
  }

  async getDashboardStats(userId?: number) {
    return await recommendationsRepository.getDashboardStats(userId);
  }

  private buildAdditionalRecommendations(cultivo: any, tipoSuelo: any, data: MLPredictionRequest): string {
    const recs: string[] = [];

    if (data.ph < (cultivo.ph_optimo_min || 5.5)) {
      recs.push(`El pH actual (${data.ph}) está por debajo del óptimo para ${cultivo.nombre} (${cultivo.ph_optimo_min}-${cultivo.ph_optimo_max}). Se recomienda encalado con cal agrícola.`);
    }
    if (data.ph > (cultivo.ph_optimo_max || 7.0)) {
      recs.push(`El pH actual (${data.ph}) está por encima del óptimo. Aplicar azufre elemental para acidificación gradual.`);
    }
    if (data.materia_organica < 2.0) {
      recs.push('El contenido de materia orgánica es bajo (<2%). Se recomienda incorporar compost o estiércol bien descompuesto (10-15 t/ha).'); 
    }
    if (data.conductividad_electrica > 4.0) {
      recs.push('La conductividad eléctrica indica salinidad elevada. Aplicar lavado de sales y mejorar el drenaje.');
    }
    if (data.humedad < 50) {
      recs.push('La humedad del suelo es baja. Se recomienda riego tecnificado (goteo o aspersión) para optimizar el uso del agua.');
    }
    if (tipoSuelo.nombre.includes('Arcilloso')) {
      recs.push('Para suelos arcillosos: incorporar materia orgánica y aplicar subsolado para mejorar la aireación y el drenaje.');
    }
    if (tipoSuelo.nombre.includes('Arenoso')) {
      recs.push('Para suelos arenosos: fraccionar las aplicaciones de fertilizante (3-4 veces) para reducir pérdidas por lixiviación.');
    }

    return recs.join('\n\n') || 'Las condiciones del suelo son adecuadas. Mantener el programa de fertilización recomendado.';
  }

  private buildBestPractices(cultivo: any): string {
    return [
      `Realizar análisis de suelo al inicio de cada campaña para ${cultivo.nombre}.`,
      'Aplicar el fertilizante en las horas más frescas del día (temprano en la mañana o al atardecer).',
      'No mezclar fertilizantes sin consultar la tabla de compatibilidad.',
      'Respetar el período de carencia antes de la cosecha.',
      'Mantener registro de todas las aplicaciones para trazabilidad del cultivo.',
      'Usar equipos de protección personal (EPP) durante la aplicación.',
      'Almacenar los fertilizantes en lugar seco, fresco y alejado de fuentes de calor.',
    ].join('\n');
  }
}
