-- ============================================================
-- AgroMind AI - Database Schema
-- Base de datos: agromind_db
-- Motor: MariaDB 10.x+
-- Versión: 1.0.0
-- ============================================================

DROP DATABASE IF EXISTS agromind_db;
CREATE DATABASE agromind_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agromind_db;

-- ============================================================
-- 1. Tabla: roles
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT DEFAULT NULL,
  permisos JSON DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 2. Tabla: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rol_id INT NOT NULL DEFAULT 3,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) DEFAULT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) DEFAULT NULL,
  telefono VARCHAR(20) DEFAULT NULL,
  organizacion VARCHAR(150) DEFAULT NULL,
  cargo VARCHAR(100) DEFAULT NULL,
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires TIMESTAMP NULL DEFAULT NULL,
  ultimo_acceso TIMESTAMP NULL DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
-- 3. Tabla: tipos_suelo
-- ============================================================
CREATE TABLE IF NOT EXISTS tipos_suelo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  caracteristicas JSON DEFAULT NULL,
  ph_tipico_min DECIMAL(4,2) DEFAULT NULL,
  ph_tipico_max DECIMAL(4,2) DEFAULT NULL,
  textura VARCHAR(100) DEFAULT NULL,
  capacidad_retencion VARCHAR(50) DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 4. Tabla: cultivos
-- ============================================================
CREATE TABLE IF NOT EXISTS cultivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  nombre_cientifico VARCHAR(150) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  familia VARCHAR(100) DEFAULT NULL,
  ciclo_cultivo VARCHAR(100) DEFAULT NULL,
  temperatura_optima_min DECIMAL(5,2) DEFAULT NULL,
  temperatura_optima_max DECIMAL(5,2) DEFAULT NULL,
  humedad_optima_min DECIMAL(5,2) DEFAULT NULL,
  humedad_optima_max DECIMAL(5,2) DEFAULT NULL,
  ph_optimo_min DECIMAL(4,2) DEFAULT NULL,
  ph_optimo_max DECIMAL(4,2) DEFAULT NULL,
  requerimiento_n VARCHAR(50) DEFAULT NULL,
  requerimiento_p VARCHAR(50) DEFAULT NULL,
  requerimiento_k VARCHAR(50) DEFAULT NULL,
  imagen VARCHAR(500) DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 5. Tabla: tipos_fertilizantes
-- ============================================================
CREATE TABLE IF NOT EXISTS tipos_fertilizantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  modo_aplicacion TEXT DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 6. Tabla: empresas_fabricantes
-- ============================================================
CREATE TABLE IF NOT EXISTS empresas_fabricantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  pais VARCHAR(100) DEFAULT NULL,
  ciudad VARCHAR(100) DEFAULT NULL,
  sitio_web VARCHAR(300) DEFAULT NULL,
  telefono VARCHAR(50) DEFAULT NULL,
  email_contacto VARCHAR(150) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  logo VARCHAR(500) DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 7. Tabla: nutrientes
-- ============================================================
CREATE TABLE IF NOT EXISTS nutrientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  simbolo VARCHAR(10) NOT NULL,
  tipo ENUM('macronutriente_primario', 'macronutriente_secundario', 'micronutriente') NOT NULL,
  descripcion TEXT DEFAULT NULL,
  funcion_planta TEXT DEFAULT NULL,
  deficiencia_sintomas TEXT DEFAULT NULL,
  unidad VARCHAR(20) DEFAULT '%',
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 8. Tabla: fertilizantes
-- ============================================================
CREATE TABLE IF NOT EXISTS fertilizantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo_fertilizante_id INT NOT NULL,
  fabricante_id INT DEFAULT NULL,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  nombre VARCHAR(150) NOT NULL,
  nombre_comercial VARCHAR(150) DEFAULT NULL,
  descripcion TEXT DEFAULT NULL,
  formula_quimica VARCHAR(100) DEFAULT NULL,
  concentracion_n DECIMAL(5,2) DEFAULT 0,
  concentracion_p DECIMAL(5,2) DEFAULT 0,
  concentracion_k DECIMAL(5,2) DEFAULT 0,
  otros_nutrientes JSON DEFAULT NULL,
  dosis_recomendada_min DECIMAL(8,2) DEFAULT NULL,
  dosis_recomendada_max DECIMAL(8,2) DEFAULT NULL,
  unidad_dosis VARCHAR(30) DEFAULT 'kg/ha',
  modo_aplicacion TEXT DEFAULT NULL,
  frecuencia_aplicacion VARCHAR(200) DEFAULT NULL,
  momento_aplicacion VARCHAR(200) DEFAULT NULL,
  tiempo_accion VARCHAR(100) DEFAULT NULL,
  beneficios TEXT DEFAULT NULL,
  contraindicaciones TEXT DEFAULT NULL,
  nivel_riesgo ENUM('bajo', 'moderado', 'alto') DEFAULT 'bajo',
  precio_referencia DECIMAL(10,2) DEFAULT NULL,
  unidad_precio VARCHAR(20) DEFAULT 'USD/50kg',
  disponibilidad ENUM('alta', 'media', 'baja') DEFAULT 'alta',
  certificaciones TEXT DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tipo_fertilizante_id) REFERENCES tipos_fertilizantes(id) ON DELETE RESTRICT,
  FOREIGN KEY (fabricante_id) REFERENCES empresas_fabricantes(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 9. Tabla: fertilizante_nutrientes (M:N)
-- ============================================================
CREATE TABLE IF NOT EXISTS fertilizante_nutrientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fertilizante_id INT NOT NULL,
  nutriente_id INT NOT NULL,
  porcentaje DECIMAL(6,3) DEFAULT NULL,
  es_primario TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (fertilizante_id) REFERENCES fertilizantes(id) ON DELETE CASCADE,
  FOREIGN KEY (nutriente_id) REFERENCES nutrientes(id) ON DELETE CASCADE,
  UNIQUE KEY uq_fert_nut (fertilizante_id, nutriente_id)
) ENGINE=InnoDB;

-- ============================================================
-- 10. Tabla: modelo_ia
-- ============================================================
CREATE TABLE IF NOT EXISTS modelo_ia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL,
  algoritmo VARCHAR(100) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  precision_global DECIMAL(5,4) DEFAULT NULL,
  f1_score DECIMAL(5,4) DEFAULT NULL,
  features_entrada JSON DEFAULT NULL,
  target_salida JSON DEFAULT NULL,
  archivo_modelo VARCHAR(500) DEFAULT NULL,
  parametros JSON DEFAULT NULL,
  metricas_detalle JSON DEFAULT NULL,
  activo TINYINT(1) DEFAULT 0,
  fecha_entrenamiento TIMESTAMP NULL DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 11. Tabla: recomendaciones
-- ============================================================
CREATE TABLE IF NOT EXISTS recomendaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  cultivo_id INT NOT NULL,
  tipo_suelo_id INT NOT NULL,
  fertilizante_id INT DEFAULT NULL,
  modelo_ia_id INT DEFAULT NULL,
  -- Parámetros de entrada
  temperatura DECIMAL(5,2) NOT NULL,
  humedad DECIMAL(5,2) NOT NULL,
  ph DECIMAL(4,2) NOT NULL,
  nitrogeno DECIMAL(8,3) NOT NULL,
  fosforo DECIMAL(8,3) NOT NULL,
  potasio DECIMAL(8,3) NOT NULL,
  materia_organica DECIMAL(5,3) NOT NULL,
  conductividad_electrica DECIMAL(6,3) NOT NULL,
  -- Resultados del modelo ML
  fertilizante_codigo_predicho VARCHAR(50) DEFAULT NULL,
  cantidad_recomendada DECIMAL(8,2) DEFAULT NULL,
  unidad_cantidad VARCHAR(30) DEFAULT 'kg/ha',
  nivel_confianza DECIMAL(5,4) DEFAULT NULL,
  deficiencias_detectadas JSON DEFAULT NULL,
  justificacion TEXT DEFAULT NULL,
  -- Resultado enriquecido desde BD
  recomendaciones_adicionales TEXT DEFAULT NULL,
  buenas_practicas TEXT DEFAULT NULL,
  nivel_riesgo ENUM('bajo', 'moderado', 'alto') DEFAULT 'bajo',
  notas_agronomo TEXT DEFAULT NULL,
  estado_analisis ENUM('completado', 'error', 'pendiente') DEFAULT 'completado',
  tiempo_procesamiento_ms INT DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (cultivo_id) REFERENCES cultivos(id) ON DELETE RESTRICT,
  FOREIGN KEY (tipo_suelo_id) REFERENCES tipos_suelo(id) ON DELETE RESTRICT,
  FOREIGN KEY (fertilizante_id) REFERENCES fertilizantes(id) ON DELETE SET NULL,
  FOREIGN KEY (modelo_ia_id) REFERENCES modelo_ia(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 12. Tabla: historial_analisis
-- ============================================================
CREATE TABLE IF NOT EXISTS historial_analisis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recomendacion_id INT NOT NULL,
  usuario_id INT NOT NULL,
  accion ENUM('creacion', 'consulta', 'exportacion', 'eliminacion') DEFAULT 'creacion',
  descripcion VARCHAR(500) DEFAULT NULL,
  datos_adicionales JSON DEFAULT NULL,
  ip_origen VARCHAR(45) DEFAULT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (recomendacion_id) REFERENCES recomendaciones(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- 13. Tabla: logs
-- ============================================================
CREATE TABLE IF NOT EXISTS logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT DEFAULT NULL,
  nivel ENUM('info', 'warning', 'error', 'debug') DEFAULT 'info',
  categoria VARCHAR(100) DEFAULT NULL,
  mensaje VARCHAR(1000) NOT NULL,
  detalle JSON DEFAULT NULL,
  ip VARCHAR(45) DEFAULT NULL,
  endpoint VARCHAR(300) DEFAULT NULL,
  metodo_http VARCHAR(10) DEFAULT NULL,
  status_code INT DEFAULT NULL,
  duracion_ms INT DEFAULT NULL,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================
-- 14. Tabla: configuraciones
-- ============================================================
CREATE TABLE IF NOT EXISTS configuraciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  tipo ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
  descripcion VARCHAR(500) DEFAULT NULL,
  grupo VARCHAR(100) DEFAULT 'general',
  editable TINYINT(1) DEFAULT 1,
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- 15. Tabla: reportes
-- ============================================================
CREATE TABLE IF NOT EXISTS reportes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  tipo ENUM('cultivo', 'fertilizante', 'usuario', 'fechas', 'tipo_suelo', 'general') NOT NULL,
  parametros JSON DEFAULT NULL,
  resultado_resumen JSON DEFAULT NULL,
  archivo_url VARCHAR(500) DEFAULT NULL,
  formato ENUM('json', 'pdf', 'excel') DEFAULT 'json',
  estado_generacion ENUM('pendiente', 'completado', 'error') DEFAULT 'completado',
  estado TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- ÍNDICES para rendimiento
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_recomendaciones_usuario ON recomendaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_cultivo ON recomendaciones(cultivo_id);
CREATE INDEX IF NOT EXISTS idx_recomendaciones_fecha ON recomendaciones(created_at);
CREATE INDEX IF NOT EXISTS idx_historial_usuario ON historial_analisis(usuario_id);
CREATE INDEX IF NOT EXISTS idx_historial_recomendacion ON historial_analisis(recomendacion_id);
CREATE INDEX IF NOT EXISTS idx_logs_nivel ON logs(nivel);
CREATE INDEX IF NOT EXISTS idx_logs_fecha ON logs(created_at);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_fertilizantes_codigo ON fertilizantes(codigo);

