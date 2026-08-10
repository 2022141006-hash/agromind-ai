import Joi from 'joi';

export const createRecommendationSchema = Joi.object({
  cultivo_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El cultivo es requerido',
    'number.positive': 'Seleccione un cultivo válido',
  }),
  tipo_suelo_id: Joi.number().integer().positive().required().messages({
    'any.required': 'El tipo de suelo es requerido',
  }),
  temperatura: Joi.number().min(-10).max(60).required().messages({
    'number.min': 'La temperatura mínima es -10°C',
    'number.max': 'La temperatura máxima es 60°C',
    'any.required': 'La temperatura es requerida',
  }),
  humedad: Joi.number().min(0).max(100).required().messages({
    'number.min': 'La humedad mínima es 0%',
    'number.max': 'La humedad máxima es 100%',
    'any.required': 'La humedad es requerida',
  }),
  ph: Joi.number().min(0).max(14).required().messages({
    'number.min': 'El pH mínimo es 0',
    'number.max': 'El pH máximo es 14',
    'any.required': 'El pH es requerido',
  }),
  nitrogeno: Joi.number().min(0).max(500).required().messages({
    'any.required': 'El nitrógeno es requerido',
  }),
  fosforo: Joi.number().min(0).max(500).required().messages({
    'any.required': 'El fósforo es requerido',
  }),
  potasio: Joi.number().min(0).max(1000).required().messages({
    'any.required': 'El potasio es requerido',
  }),
  materia_organica: Joi.number().min(0).max(100).required().messages({
    'any.required': 'La materia orgánica es requerida',
  }),
  conductividad_electrica: Joi.number().min(0).max(50).required().messages({
    'any.required': 'La conductividad eléctrica es requerida',
  }),
  notas_agronomo: Joi.string().max(2000).optional().allow('', null),
});

export const queryRecommendationsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().valid('created_at', 'nivel_confianza', 'cultivo_id').default('created_at'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().max(100).optional().allow(''),
  cultivo_id: Joi.number().integer().positive().optional(),
  tipo_suelo_id: Joi.number().integer().positive().optional(),
  desde: Joi.date().iso().optional(),
  hasta: Joi.date().iso().optional(),
});
