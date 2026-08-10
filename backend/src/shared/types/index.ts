// ============================================================
// Shared Types for AgroMind AI Backend
// ============================================================

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  timestamp: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface JwtPayload {
  userId: number;
  email: string;
  rolId: number;
  rolNombre: string;
  iat?: number;
  exp?: number;
}

export interface RequestWithUser extends Express.Request {
  user?: JwtPayload;
}

// Database entity base
export interface BaseEntity {
  id: number;
  estado: number;
  created_at: Date;
  updated_at: Date;
}

// Domain entities
export interface Rol extends BaseEntity {
  nombre: string;
  descripcion: string | null;
  permisos: string[] | null;
}

export interface Usuario extends BaseEntity {
  rol_id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  password_hash: string;
  avatar: string | null;
  telefono: string | null;
  organizacion: string | null;
  cargo: string | null;
  ultimo_acceso: Date | null;
  rol?: Rol;
}

export interface TipoSuelo extends BaseEntity {
  nombre: string;
  descripcion: string | null;
  caracteristicas: Record<string, unknown> | null;
  ph_tipico_min: number | null;
  ph_tipico_max: number | null;
  textura: string | null;
  capacidad_retencion: string | null;
}

export interface Cultivo extends BaseEntity {
  nombre: string;
  nombre_cientifico: string | null;
  descripcion: string | null;
  familia: string | null;
  ciclo_cultivo: string | null;
  temperatura_optima_min: number | null;
  temperatura_optima_max: number | null;
  humedad_optima_min: number | null;
  humedad_optima_max: number | null;
  ph_optimo_min: number | null;
  ph_optimo_max: number | null;
  requerimiento_n: string | null;
  requerimiento_p: string | null;
  requerimiento_k: string | null;
  imagen: string | null;
}

export interface TipoFertilizante extends BaseEntity {
  nombre: string;
  descripcion: string | null;
  modo_aplicacion: string | null;
}

export interface EmpresaFabricante extends BaseEntity {
  nombre: string;
  pais: string | null;
  ciudad: string | null;
  sitio_web: string | null;
  telefono: string | null;
  email_contacto: string | null;
  descripcion: string | null;
  logo: string | null;
}

export interface Nutriente extends BaseEntity {
  nombre: string;
  simbolo: string;
  tipo: 'macronutriente_primario' | 'macronutriente_secundario' | 'micronutriente';
  descripcion: string | null;
  funcion_planta: string | null;
  deficiencia_sintomas: string | null;
  unidad: string;
}

export interface Fertilizante extends BaseEntity {
  tipo_fertilizante_id: number;
  fabricante_id: number | null;
  codigo: string;
  nombre: string;
  nombre_comercial: string | null;
  descripcion: string | null;
  formula_quimica: string | null;
  concentracion_n: number;
  concentracion_p: number;
  concentracion_k: number;
  otros_nutrientes: Record<string, unknown> | null;
  dosis_recomendada_min: number | null;
  dosis_recomendada_max: number | null;
  unidad_dosis: string;
  modo_aplicacion: string | null;
  frecuencia_aplicacion: string | null;
  momento_aplicacion: string | null;
  tiempo_accion: string | null;
  beneficios: string | null;
  contraindicaciones: string | null;
  nivel_riesgo: 'bajo' | 'moderado' | 'alto';
  precio_referencia: number | null;
  unidad_precio: string | null;
  disponibilidad: 'alta' | 'media' | 'baja';
  tipo_fertilizante?: TipoFertilizante;
  fabricante?: EmpresaFabricante;
  nutrientes?: (Nutriente & { porcentaje: number; es_primario: boolean })[];
}

export interface ModeloIA extends BaseEntity {
  nombre: string;
  version: string;
  algoritmo: string;
  descripcion: string | null;
  precision_global: number | null;
  f1_score: number | null;
  features_entrada: string[] | null;
  target_salida: Record<string, unknown> | null;
  archivo_modelo: string | null;
  parametros: Record<string, unknown> | null;
  metricas_detalle: Record<string, unknown> | null;
  activo: number;
  fecha_entrenamiento: Date | null;
}

export interface Recomendacion extends BaseEntity {
  usuario_id: number;
  cultivo_id: number;
  tipo_suelo_id: number;
  fertilizante_id: number | null;
  modelo_ia_id: number | null;
  temperatura: number;
  humedad: number;
  ph: number;
  nitrogeno: number;
  fosforo: number;
  potasio: number;
  materia_organica: number;
  conductividad_electrica: number;
  fertilizante_codigo_predicho: string | null;
  cantidad_recomendada: number | null;
  unidad_cantidad: string;
  nivel_confianza: number | null;
  deficiencias_detectadas: string[] | null;
  justificacion: string | null;
  recomendaciones_adicionales: string | null;
  buenas_practicas: string | null;
  nivel_riesgo: 'bajo' | 'moderado' | 'alto';
  notas_agronomo: string | null;
  estado_analisis: 'completado' | 'error' | 'pendiente';
  tiempo_procesamiento_ms: number | null;
  usuario?: Partial<Usuario>;
  cultivo?: Cultivo;
  tipo_suelo?: TipoSuelo;
  fertilizante?: Fertilizante;
}

// ML Service types
export interface MLPredictionRequest {
  cultivo_id: number;
  tipo_suelo_id: number;
  temperatura: number;
  humedad: number;
  ph: number;
  nitrogeno: number;
  fosforo: number;
  potasio: number;
  materia_organica: number;
  conductividad_electrica: number;
}

export interface MLPredictionResponse {
  fertilizante_codigo: string;
  cantidad_kg: number;
  confianza: number;
  deficiencias: string[];
  justificacion: string;
  top_3_predicciones?: Array<{ codigo: string; probabilidad: number }>;
}
