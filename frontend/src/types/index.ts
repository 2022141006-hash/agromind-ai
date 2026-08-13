// ============================================================
// AgroMind AI - Frontend TypeScript Types
// ============================================================

export interface User {
  id: number;
  nombre: string;
  apellido: string | null;
  email: string;
  avatar: string | null;
  rol: string;
  organizacion: string | null;
  cargo: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Cultivo {
  id: number;
  nombre: string;
  nombre_cientifico: string | null;
  descripcion: string | null;
  familia: string | null;
  ciclo_cultivo: string | null;
  temperatura_optima_min: number | null;
  temperatura_optima_max: number | null;
  ph_optimo_min: number | null;
  ph_optimo_max: number | null;
  requerimiento_n: string | null;
  requerimiento_p: string | null;
  requerimiento_k: string | null;
}

export interface TipoSuelo {
  id: number;
  nombre: string;
  descripcion: string | null;
  ph_tipico_min: number | null;
  ph_tipico_max: number | null;
  textura: string | null;
  capacidad_retencion: string | null;
}

export interface Fertilizante {
  id: number;
  codigo: string;
  nombre: string;
  nombre_comercial: string | null;
  descripcion: string | null;
  formula_quimica: string | null;
  concentracion_n: number;
  concentracion_p: number;
  concentracion_k: number;
  modo_aplicacion: string | null;
  frecuencia_aplicacion: string | null;
  momento_aplicacion: string | null;
  tiempo_accion: string | null;
  beneficios: string | null;
  nivel_riesgo: 'bajo' | 'moderado' | 'alto';
  precio_referencia: number | null;
  unidad_precio: string | null;
  disponibilidad: 'alta' | 'media' | 'baja';
  tipo_nombre?: string;
  fabricante_nombre?: string;
  fabricante_pais?: string;
  fabricante_sitio_web?: string;
  nutrientes?: Nutriente[];
}

export interface Nutriente {
  nombre: string;
  simbolo: string;
  tipo: string;
  funcion_planta: string | null;
  deficiencia_sintomas: string | null;
  porcentaje: number;
  es_primario: boolean;
}

export interface RecommendationInput {
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
  notas_agronomo?: string;
}

export interface Recommendation {
  id: number;
  usuario_id: number;
  cultivo_id: number;
  tipo_suelo_id: number;
  fertilizante_id: number | null;
  temperatura: number;
  humedad: number;
  ph: number;
  nitrogeno: number;
  fosforo: number;
  potasio: number;
  materia_organica: number;
  conductividad_electrica: number;
  cantidad_recomendada: number | null;
  unidad_cantidad: string;
  nivel_confianza: number | null;
  deficiencias_detectadas: string[] | null;
  justificacion: string | null;
  recomendaciones_adicionales: string | null;
  buenas_practicas: string | null;
  nivel_riesgo: 'bajo' | 'moderado' | 'alto';
  estado_analisis: 'completado' | 'error' | 'pendiente';
  tiempo_procesamiento_ms: number | null;
  created_at: string;
  // Joined fields
  cultivo_nombre?: string;
  cultivo_nombre_cientifico?: string;
  tipo_suelo_nombre?: string;
  fertilizante_nombre?: string;
  fertilizante_codigo?: string;
  fertilizante_codigo_predicho?: string | null;
  fertilizante_descripcion?: string;
  fertilizante_modo_aplicacion?: string;
  frecuencia_aplicacion?: string;
  momento_aplicacion?: string;
  tiempo_accion?: string;
  fertilizante_beneficios?: string;
  fertilizante_nivel_riesgo?: string;
  precio_referencia?: number;
  unidad_precio?: string;
  tipo_fertilizante_nombre?: string;
  fabricante_nombre?: string;
  fabricante_pais?: string;
  fabricante_sitio_web?: string;
  formula_quimica?: string;
  usuario_nombre?: string;
  nutrientes?: Nutriente[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface DashboardStats {
  usuarios: number;
  cultivos: number;
  fertilizantes: number;
  recomendaciones: number;
  precisionModelo: number;
  modeloActivo?: {
    nombre: string;
    version: string;
    algoritmo: string;
  } | null;
}

export interface RecommendationStats {
  total: number;
  promedioConfianza: number;
  porCultivo: Array<{ nombre: string; cantidad: number }>;
  porFertilizante: Array<{ nombre: string; codigo: string; cantidad: number }>;
  ultimosMeses: Array<{ mes: string; cantidad: number }>;
}

export type RiskLevel = 'bajo' | 'moderado' | 'alto';
export type UserRole = 'administrador' | 'agronomo' | 'agricultor';
