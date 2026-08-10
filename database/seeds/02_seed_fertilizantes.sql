USE agromind_db;

-- ============================================================
-- SEED: Fertilizantes (Catálogo Real)
-- ============================================================
INSERT INTO fertilizantes (tipo_fertilizante_id, fabricante_id, codigo, nombre, nombre_comercial, descripcion, formula_quimica, concentracion_n, concentracion_p, concentracion_k, dosis_recomendada_min, dosis_recomendada_max, unidad_dosis, modo_aplicacion, frecuencia_aplicacion, momento_aplicacion, tiempo_accion, beneficios, contraindicaciones, nivel_riesgo, precio_referencia, unidad_precio, disponibilidad) VALUES

-- Fertilizantes Nitrogenados
(1, 1, 'UREA-46', 'Urea Agrícola 46%', 'YaraVera UREA', 
 'Fertilizante nitrogenado sólido con mayor concentración de N disponible. El más utilizado mundialmente por su costo-eficiencia.',
 'CO(NH2)2', 46.0, 0.0, 0.0, 100, 250, 'kg/ha',
 'Suelo al voleo o en banda, incorporar inmediatamente para evitar volatilización. Fertirrigación en dosis fraccionadas.',
 '2-3 aplicaciones por ciclo de cultivo',
 'Antes de la siembra (50%) y durante el desarrollo vegetativo activo',
 'Rápida disponibilidad (7-14 días)',
 'Alta concentración de N, bajo costo por kg de N, fácil manejo, compatible con la mayoría de fertilizantes.',
 'Riesgo de volatilización de amoniaco si no se incorpora. No mezclar con cal. Puede acidificar el suelo a largo plazo.',
 'moderado', 28.50, 'USD/50kg', 'alta'),

(1, 8, 'SA-21', 'Sulfato de Amonio 21%', 'SULFAMMO',
 'Fertilizante nitrogenado con azufre. Ideal para suelos deficientes en S y cultivos que requieren pH ácido.',
 '(NH4)2SO4', 21.0, 0.0, 0.0, 150, 350, 'kg/ha',
 'Suelo al voleo incorporado o en banda. No foliar.',
 '2-3 aplicaciones por campaña',
 'Presiembra y macollamiento/ramificación',
 'Disponibilidad media (14-21 días)',
 'Aporta N y S simultáneamente. Acidifica el suelo (útil en suelos calcáreos). Bajo riesgo de volatilización.',
 'Puede acidificar excesivamente suelos ya ácidos. No apto para pH < 5.0.',
 'bajo', 22.00, 'USD/50kg', 'alta'),

(1, 1, 'NIT-27', 'Nitrato de Amonio 33%', 'YaraBela NITRABOR',
 'Fertilizante nitrogenado de acción rápida con doble forma de N. Alta eficiencia en climas fríos.',
 'NH4NO3', 33.5, 0.0, 0.0, 80, 200, 'kg/ha',
 'Suelo en banda o cobertura. Evitar contacto con semilla.',
 '2-4 aplicaciones fraccionadas',
 'Desde germinación hasta estadio vegetativo avanzado',
 'Muy rápida (3-7 días)',
 'Doble forma de N (nítrica + amoniacal). Excelente en climas fríos. Mínima volatilización.',
 'Producto clasificado como oxidante. Restricciones de transporte y almacenamiento. No mezclar con material orgánico.',
 'alto', 35.00, 'USD/50kg', 'media'),

-- Fertilizantes Fosfatados
(2, 3, 'DAP-18-46', 'DAP (Fosfato Diamónico)', 'Mosaic DAP',
 'Fertilizante fosfatado con N. El más utilizado globalmente para aporte de P en siembra. Excelente compatibilidad con suelos neutros.',
 '(NH4)2HPO4', 18.0, 46.0, 0.0, 100, 250, 'kg/ha',
 'Suelo en banda al momento de la siembra, no en contacto directo con semilla.',
 '1-2 aplicaciones (base + complemento)',
 'Presiembra o siembra en banda',
 'Disponibilidad lenta-media (21-45 días)',
 'Alta concentración de P. Mejora establecimiento de raíces. Estimula floración y cuajado de frutos.',
 'No usar en suelos con pH > 7.5 (precipita el P). Puede generar toxicidad en semillas si hay contacto directo.',
 'bajo', 38.00, 'USD/50kg', 'alta'),

(2, 3, 'MAP-12-61', 'MAP (Fosfato Monoamónico)', 'Mosaic MAP',
 'Fertilizante fosfatado soluble. Ideal para fertirrigación y suelos alcalinos por su ligera acidificación.',
 'NH4H2PO4', 12.0, 61.0, 0.0, 80, 180, 'kg/ha',
 'Fertirrigación, solución foliar baja concentración, suelo en banda.',
 '2-3 aplicaciones durante el ciclo',
 'Desde siembra hasta inicio de floración',
 'Rápida disponibilidad (7-14 días)',
 'Altamente soluble. Excelente para fertirrigación. Ligera acidificación (útil en suelos calcáreos). Alta concentración de P.',
 'No mezclar con fertilizantes cálcicos o magnésicos en solución. Puede precipitar.',
 'bajo', 42.00, 'USD/50kg', 'alta'),

(2, 10, 'SF-0-20', 'Superfosfato Triple 46%', 'AgroMind TSP',
 'Fertilizante fosfatado de alta concentración sin N. Ideal para suelos donde se desea aplicar P y N por separado.',
 'Ca(H2PO4)2', 0.0, 46.0, 0.0, 100, 300, 'kg/ha',
 'Suelo en banda profunda o incorporado. Lenta solubilidad.',
 '1 aplicación por ciclo (dosis alta)',
 'Presiembra, incorporado al suelo al menos 2 semanas antes de la siembra',
 'Lenta (30-60 días para máxima disponibilidad)',
 'Alta concentración de P sin N. Menor riesgo de quema por nitrógeno. Larga residualidad en suelo.',
 'Baja solubilidad inicial. No apto para fertirrigación directa. Requiere pH adecuado (5.5-6.5).',
 'bajo', 32.00, 'USD/50kg', 'alta'),

-- Fertilizantes Potásicos
(3, 2, 'KCL-60', 'Cloruro de Potasio 60%', 'ICL MOP',
 'Fertilizante potásico más económico y concentrado. El más utilizado mundialmente para aporte de K.',
 'KCl', 0.0, 0.0, 60.0, 100, 300, 'kg/ha',
 'Suelo al voleo o en banda. No en contacto con semilla.',
 '1-2 aplicaciones por ciclo',
 'Presiembra o inicio de desarrollo vegetativo',
 'Media (14-21 días)',
 'Alta concentración de K. Bajo costo. Amplia disponibilidad global. Mejora calidad de frutos.',
 'El cloruro puede afectar cultivos sensibles (tabaco, papa). No usar en suelos salinos. Puede incrementar la salinidad.',
 'bajo', 25.00, 'USD/50kg', 'alta'),

(3, 5, 'KNO3-13-46', 'Nitrato de Potasio', 'SQM Haifa KNO3',
 'Fertilizante de doble función: N nítrico + K. Ideal para fertirrigación en etapas de fructificación.',
 'KNO3', 13.0, 0.0, 46.0, 50, 150, 'kg/ha',
 'Fertirrigación (altamente soluble), foliar diluido.',
 '3-5 aplicaciones durante fructificación',
 'Desde inicio de floración hasta cosecha',
 'Muy rápida (3-7 días)',
 'Libre de cloruro. Excelente para fertirrigación. Mejora coloración y sabor de frutos. Reduce incidencia de podredumbre apical.',
 'Alto costo. No mezclar con fertilizantes con amonio (puede generar calor). Solo para fertirrigación.',
 'bajo', 65.00, 'USD/50kg', 'alta'),

-- Fertilizantes NPK Complejos
(4, 1, 'NPK-15-15-15', 'NPK 15-15-15', 'YaraMila COMPLEX',
 'Fertilizante NPK balanceado de uso general. Proporciona los tres macronutrientes primarios en proporciones iguales.',
 'NPK (15-15-15)', 15.0, 15.0, 15.0, 150, 400, 'kg/ha',
 'Suelo al voleo o en banda. Fertirrigación en versión soluble.',
 '2-3 aplicaciones por ciclo de cultivo',
 'Presiembra o siembra (70%) + desarrollo vegetativo (30%)',
 'Media (14-21 días)',
 'Equilibrio nutricional completo. Reduce número de aplicaciones. Fácil manejo. Compatible con la mayoría de cultivos.',
 'No ideal cuando se requiere ajuste nutricional específico. Puede aportar exceso de algún nutriente.',
 'bajo', 45.00, 'USD/50kg', 'alta'),

(4, 1, 'NPK-12-24-12', 'NPK 12-24-12', 'YaraMila ACTYVA',
 'Fertilizante NPK con alto P para fase de establecimiento. Ideal para cultivos exigentes en fósforo durante la siembra.',
 'NPK (12-24-12)', 12.0, 24.0, 12.0, 100, 300, 'kg/ha',
 'Suelo en banda cerca de la semilla o raíz. Incorporado.',
 '1-2 aplicaciones en fases iniciales',
 'Siembra y 30 días después de la siembra',
 'Media (14-21 días)',
 'Alto P para estimular desarrollo radicular. Equilibrado N y K. Excelente para trasplantes.',
 'No usar en exceso en suelos ya ricos en P. Puede generar desequilibrios a largo plazo.',
 'bajo', 48.00, 'USD/50kg', 'alta'),

(4, 8, 'NPK-10-26-26', 'NPK 10-26-26 (Alto P-K)', 'Fertiberia FERTILIS',
 'Fertilizante NPK con alto P y K. Diseñado para fases de floración y fructificación donde se necesita menos N.',
 'NPK (10-26-26)', 10.0, 26.0, 26.0, 100, 250, 'kg/ha',
 'Suelo en banda o fertirrigación (versión soluble).',
 '2-3 aplicaciones desde floración hasta cuajado',
 'Inicio de floración y cuajado de frutos',
 'Media-rápida (10-21 días)',
 'Promueve floración abundante. Mejora calidad y tamaño de frutos. Reduce deficiencias de P y K simultáneamente.',
 'Puede aportar exceso de P en suelos ya ricos. No usar en fase vegetativa activa.',
 'bajo', 52.00, 'USD/50kg', 'media'),

-- Fertilizantes Foliares
(5, 4, 'FOL-N-30', 'Foliar Nitrogenado 30%', 'Haifa Nutri.fol N',
 'Solución foliar de N de alta concentración para corrección rápida de deficiencias nitrogenadas.',
 'NH4NO3 (solución)', 30.0, 0.0, 0.0, 2, 5, 'L/ha',
 'Aspersión foliar diluido al 0.5-1%. No usar en horas de máxima temperatura.',
 '1-3 aplicaciones según severidad de deficiencia',
 'Al detectar síntomas de deficiencia o en períodos críticos',
 'Muy rápida (24-72 horas)',
 'Corrección inmediata de deficiencias. No afecta pH del suelo. Uso eficiente del N.',
 'Riesgo de quema foliar si se aplica concentrado o en calor. No sustituye fertilización de suelo.',
 'bajo', 18.00, 'USD/L', 'alta'),

(5, 4, 'FOL-NPK-20-20-20', 'Foliar NPK 20-20-20', 'Haifa Multi K',
 'Fertilizante foliar completo y soluble para fertirrigación o aplicación foliar. Alta pureza.',
 'NPK Soluble (20-20-20)', 20.0, 20.0, 20.0, 1, 3, 'kg/ha',
 'Foliar: 0.2-0.5% en solución. Fertirrigación: 1-5 kg/1000L',
 '5-10 aplicaciones durante el ciclo según necesidad',
 'Durante todo el ciclo del cultivo en momentos críticos',
 'Muy rápida (12-48 horas)',
 'Alta solubilidad. Sin cloruro. Corrección rápida y completa. Compatible con agroquímicos.',
 'Alto costo. Complementario, no sustituto de fertilización de suelo.',
 'bajo', 55.00, 'USD/5kg', 'alta'),

-- Enmiendas Orgánicas
(6, 10, 'HUMUS-ORG', 'Humus de Lombriz', 'AgroMind VERMICOMPOST',
 'Abono orgánico de alta calidad producido por lombrices. Rico en materia orgánica y microorganismos benéficos.',
 'Materia Orgánica 60-80%', 2.5, 1.5, 2.0, 2000, 5000, 'kg/ha',
 'Suelo incorporado al voleo o en banda. Cobertura superficial.',
 '1-2 aplicaciones por ciclo (inicio y complemento)',
 'Preparación del terreno o trasplante',
 'Lenta y sostenida (2-6 meses)',
 'Mejora estructura del suelo. Aumenta actividad microbiana. Aporta hormonas de crecimiento. Larga residualidad.',
 'Baja concentración de nutrientes. Requiere grandes cantidades. Puede introducir semillas de malezas si no está bien compostado.',
 'bajo', 8.00, 'USD/50kg', 'alta'),

-- Fertilizantes de Liberación Lenta
(7, 7, 'LIB-LENTA-NPK', 'NPK Liberación Controlada 16-8-12', 'Koch Agrium ESN',
 'Fertilizante recubierto con polímero para liberación gradual de nutrientes durante 3-6 meses. Minimiza pérdidas.',
 'Recubierto NPK (16-8-12)', 16.0, 8.0, 12.0, 100, 200, 'kg/ha',
 'Suelo incorporado o superficie. Una sola aplicación por ciclo.',
 '1 aplicación por ciclo completo',
 'Siembra o trasplante',
 'Gradual 3-6 meses según temperatura del suelo',
 'Menor número de aplicaciones. Reduce lixiviación. Mayor eficiencia de uso. Reduce mano de obra.',
 'Alto costo inicial. No apto para correcciones de deficiencias agudas. Menor flexibilidad de ajuste.',
 'bajo', 85.00, 'USD/25kg', 'media'),

-- Biofertilizantes
(8, 10, 'BIO-RHIZO', 'Biofertilizante Rizobium', 'AgroMind BIOFIX',
 'Inoculante con bacterias fijadoras de N atmosférico (Rhizobium/Bradyrhizobium). Para leguminosas.',
 'Rhizobium spp. (10^8 UFC/g)', 0.0, 0.0, 0.0, 0, 0, 'kg/ha',
 'Inoculación de semilla o drench al suelo en siembra.',
 '1 aplicación por ciclo (siembra)',
 'Siembra exclusivamente',
 'Efecto durante toda la campaña',
 'Fija N atmosférico gratuitamente. Reduce necesidad de N sintético 30-80%. Mejora la salud del suelo.',
 'Solo para leguminosas. Sensible al calor y luz UV. Incompatible con fungicidas de semilla cúpricos.',
 'bajo', 15.00, 'USD/250g', 'media');

-- ============================================================
-- SEED: Fertilizante-Nutrientes (composición)
-- ============================================================
-- Urea
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(1, 1, 46.00, 1);  -- N 46%

-- Sulfato de Amonio
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(2, 1, 21.00, 1),  -- N 21%
(2, 6, 24.00, 0);  -- S 24%

-- Nitrato de Amonio
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(3, 1, 33.50, 1);  -- N 33.5%

-- DAP
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(4, 1, 18.00, 0),  -- N 18%
(4, 2, 46.00, 1);  -- P 46%

-- MAP
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(5, 1, 12.00, 0),  -- N 12%
(5, 2, 61.00, 1);  -- P 61%

-- Superfosfato Triple
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(6, 2, 46.00, 1);  -- P 46%

-- Cloruro de Potasio
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(7, 3, 60.00, 1);  -- K 60%

-- Nitrato de Potasio
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(8, 1, 13.00, 0),  -- N 13%
(8, 3, 46.00, 1);  -- K 46%

-- NPK 15-15-15
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(9, 1, 15.00, 1),  -- N 15%
(9, 2, 15.00, 1),  -- P 15%
(9, 3, 15.00, 1);  -- K 15%

-- NPK 12-24-12
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(10, 1, 12.00, 0), -- N 12%
(10, 2, 24.00, 1), -- P 24%
(10, 3, 12.00, 0); -- K 12%

-- NPK 10-26-26
INSERT INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
(11, 1, 10.00, 0), -- N 10%
(11, 2, 26.00, 1), -- P 26%
(11, 3, 26.00, 1); -- K 26%

-- ============================================================
-- SEED: Modelo IA inicial
-- ============================================================
INSERT INTO modelo_ia (nombre, version, algoritmo, descripcion, precision_global, f1_score, features_entrada, target_salida, archivo_modelo, activo, fecha_entrenamiento) VALUES
('AgroMind Fertilizer Predictor', 'v1.0.0', 'Random Forest Classifier + Regressor',
 'Modelo de aprendizaje automático para recomendación de fertilizantes basado en parámetros de suelo y cultivo. Entrenado con datos agronómicos de cultivos andinos y tropicales.',
 0.8750, 0.8620,
 JSON_ARRAY('cultivo_id', 'tipo_suelo_id', 'temperatura', 'humedad', 'ph', 'nitrogeno', 'fosforo', 'potasio', 'materia_organica', 'conductividad_electrica'),
 JSON_OBJECT('clase', 'fertilizante_codigo', 'regresion', 'cantidad_kg', 'metadata', JSON_ARRAY('confianza', 'deficiencias')),
 'artifacts/agromind_model_v1.joblib',
 1,
 CURRENT_TIMESTAMP);

-- ============================================================
-- SEED: Configuraciones del sistema
-- ============================================================
INSERT INTO configuraciones (clave, valor, tipo, descripcion, grupo) VALUES
('app_name', 'AgroMind AI', 'string', 'Nombre de la aplicación', 'general'),
('app_version', '1.0.0', 'string', 'Versión del sistema', 'general'),
('ml_service_url', 'http://localhost:8000', 'string', 'URL del microservicio de ML', 'ml'),
('ml_model_active_id', '1', 'number', 'ID del modelo de ML activo', 'ml'),
('ml_prediction_timeout', '30000', 'number', 'Timeout para predicción ML en ms', 'ml'),
('max_recommendations_per_day', '50', 'number', 'Límite de recomendaciones por usuario por día', 'limits'),
('session_timeout_hours', '24', 'number', 'Tiempo de expiración de sesión en horas', 'security'),
('export_pdf_enabled', 'true', 'boolean', 'Habilitar exportación a PDF', 'features'),
('export_excel_enabled', 'true', 'boolean', 'Habilitar exportación a Excel', 'features'),
('dark_mode_default', 'false', 'boolean', 'Modo oscuro por defecto', 'ui'),
('items_per_page_default', '20', 'number', 'Elementos por página en listados', 'ui'),
('min_confidence_threshold', '0.60', 'number', 'Confianza mínima para mostrar recomendación (0-1)', 'ml');
