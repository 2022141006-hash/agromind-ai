USE agromind_db;

-- ============================================================
-- SEED: Roles
-- ============================================================
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('administrador', 'Acceso total al sistema. Gestiona usuarios, configuraciones y datos maestros.',
  JSON_ARRAY('users:read', 'users:write', 'users:delete', 'crops:read', 'crops:write', 'fertilizers:read', 'fertilizers:write', 'recommendations:read', 'recommendations:write', 'reports:read', 'admin:all')),
('agronomo', 'Ingeniero Agrónomo con acceso a análisis avanzados, historial completo y reportes.',
  JSON_ARRAY('crops:read', 'fertilizers:read', 'recommendations:read', 'recommendations:write', 'history:read', 'reports:read', 'reports:write')),
('agricultor', 'Agricultor con acceso básico a recomendaciones y su historial personal.',
  JSON_ARRAY('recommendations:read', 'recommendations:write', 'history:own'));

-- ============================================================
-- SEED: Usuarios por defecto
-- ============================================================
INSERT INTO usuarios (rol_id, nombre, apellido, email, password_hash, organizacion, cargo, estado) VALUES
-- Cuentas @agromind.ai (password: admin123 / agro123 / agri123)
(1, 'Administrador', 'AgroMind', 'admin@agromind.ai',
  '$2a$10$I5/nOjr3hFTvG5Akvu03BOvF8dK/Vm4nKlYiY8qFvbZG9LHzRMmpi',
  'AgroMind AI', 'Administrador del Sistema', 1),
(2, 'Carlos', 'Mendoza', 'agronomo@agromind.ai',
  '$2a$10$.2nLK3oUxDUGT4DFro8di.59fJlAg4ydtaC0hJKFzrNvPOA7lWIje',
  'AgroMind AI', 'Ingeniero Agrónomo Senior', 1),
(3, 'Juan', 'Quispe', 'agricultor@agromind.ai',
  '$2a$10$cQCqeSmv28rJ2rhY23OpbeS0DSjRhLurH0Ns4Xrk4bBg2HWZLZfXC',
  'Comunidad Agrícola Huancayo', 'Agricultor', 1),

-- Cuentas @agromind.com (password: Admin123!)
(1, 'Admin', 'Sistema', 'admin@agromind.com',
  '$2a$10$8Q0Y4ueKZ3EiAyovZs.1Ruk7KBDz3/BxLFRQNf5DBfjsRUDjCPzm.',
  'AgroMind Enterprise', 'Admin', 1),
(2, 'Agrónomo', 'Principal', 'agronomo@agromind.com',
  '$2a$10$8Q0Y4ueKZ3EiAyovZs.1Ruk7KBDz3/BxLFRQNf5DBfjsRUDjCPzm.',
  'AgroMind Enterprise', 'Agrónomo', 1);


-- ============================================================
-- SEED: Tipos de Suelo
-- ============================================================
INSERT INTO tipos_suelo (nombre, descripcion, ph_tipico_min, ph_tipico_max, textura, capacidad_retencion) VALUES
('Arcilloso', 'Suelo con alta proporción de partículas finas. Alta capacidad de retención de agua y nutrientes, pero puede compactarse fácilmente.', 5.5, 7.5, 'Fina (<0.002 mm)', 'Muy Alta'),
('Franco', 'Suelo equilibrado con proporciones similares de arena, limo y arcilla. Ideal para la mayoría de cultivos.', 5.5, 7.0, 'Media (mezcla)', 'Alta'),
('Arenoso', 'Suelo con alta proporción de partículas gruesas. Buen drenaje pero baja retención de nutrientes.', 5.0, 7.0, 'Gruesa (>0.05 mm)', 'Baja'),
('Franco-Arcilloso', 'Suelo intermedio con características de suelo franco y arcilloso. Buena retención con drenaje aceptable.', 5.5, 7.5, 'Media-Fina', 'Alta'),
('Franco-Arenoso', 'Suelo con predominancia arenosa pero con partículas finas. Drenaje moderado y retención media.', 5.0, 7.0, 'Media-Gruesa', 'Media'),
('Limoso', 'Suelo con alta proporción de limo. Buena fertilidad natural pero susceptible a la compactación.', 5.5, 7.5, 'Media (0.002-0.05 mm)', 'Alta'),
('Orgánico', 'Suelo con alta concentración de materia orgánica descompuesta. Excelente fertilidad y estructura.', 4.5, 6.5, 'Variable', 'Muy Alta'),
('Calcáreo', 'Suelo rico en carbonato de calcio. pH elevado, puede generar deficiencias de micronutrientes.', 7.0, 8.5, 'Variable', 'Media');

-- ============================================================
-- SEED: Cultivos (enfoque andino-peruano + cultivos tropicales)
-- ============================================================
INSERT INTO cultivos (nombre, nombre_cientifico, descripcion, familia, ciclo_cultivo, temperatura_optima_min, temperatura_optima_max, humedad_optima_min, humedad_optima_max, ph_optimo_min, ph_optimo_max, requerimiento_n, requerimiento_p, requerimiento_k) VALUES
('Papa', 'Solanum tuberosum', 'Tubérculo originario de los Andes peruanos. Uno de los cultivos más importantes del mundo por su valor nutricional y producción global.', 'Solanaceae', '90-150 días', 10, 20, 70, 85, 5.0, 6.5, 'Alto (150-200 kg N/ha)', 'Medio (80-120 kg P2O5/ha)', 'Alto (120-200 kg K2O/ha)'),
('Maíz', 'Zea mays', 'Cereal de gran importancia en América Latina. Requiere suelos bien drenados y temperaturas cálidas para su óptimo desarrollo.', 'Poaceae', '90-120 días', 18, 30, 60, 80, 5.5, 7.0, 'Alto (120-180 kg N/ha)', 'Medio (60-100 kg P2O5/ha)', 'Alto (100-150 kg K2O/ha)'),
('Quinua', 'Chenopodium quinoa', 'Pseudocereal andino con extraordinario valor nutricional. Adaptado a suelos pobres y condiciones adversas.', 'Amaranthaceae', '150-180 días', 5, 20, 40, 70, 6.0, 8.0, 'Medio (80-120 kg N/ha)', 'Bajo (40-60 kg P2O5/ha)', 'Medio (60-100 kg K2O/ha)'),
('Arroz', 'Oryza sativa', 'Cereal fundamental en la alimentación mundial. Requiere suelos inundados o con alta humedad.', 'Poaceae', '110-150 días', 20, 35, 80, 95, 5.5, 6.5, 'Alto (100-150 kg N/ha)', 'Medio (40-80 kg P2O5/ha)', 'Alto (80-120 kg K2O/ha)'),
('Trigo', 'Triticum aestivum', 'Cereal de importancia global. Adaptado a climas templados y suelos bien drenados.', 'Poaceae', '100-130 días', 12, 22, 50, 70, 5.5, 7.5, 'Alto (100-150 kg N/ha)', 'Medio (50-80 kg P2O5/ha)', 'Medio (60-100 kg K2O/ha)'),
('Tomate', 'Solanum lycopersicum', 'Hortaliza de alto valor comercial. Requiere suelos fértiles y bien drenados con aporte constante de nutrientes.', 'Solanaceae', '80-120 días', 18, 28, 65, 80, 5.5, 7.0, 'Alto (150-200 kg N/ha)', 'Alto (100-150 kg P2O5/ha)', 'Alto (200-300 kg K2O/ha)'),
('Cebolla', 'Allium cepa', 'Hortaliza bulbosa de consumo universal. Sensible a suelos compactados y requiere buen drenaje.', 'Amaryllidaceae', '90-150 días', 12, 24, 60, 75, 6.0, 7.0, 'Medio (80-120 kg N/ha)', 'Medio (60-100 kg P2O5/ha)', 'Medio (80-120 kg K2O/ha)'),
('Espárrago', 'Asparagus officinalis', 'Hortaliza perenne de alto valor exportable. Requiere suelos arenosos profundos y bien drenados.', 'Asparagaceae', 'Perenne (2-15 años)', 16, 30, 50, 70, 6.0, 7.5, 'Alto (100-150 kg N/ha)', 'Medio (60-80 kg P2O5/ha)', 'Alto (100-150 kg K2O/ha)'),
('Café', 'Coffea arabica', 'Cultivo de exportación de gran importancia económica. Requiere suelos ácidos, bien drenados y ricos en materia orgánica.', 'Rubiaceae', 'Perenne (produc. 3-30 años)', 18, 24, 70, 80, 5.0, 6.5, 'Alto (150-250 kg N/ha)', 'Medio (50-80 kg P2O5/ha)', 'Alto (150-250 kg K2O/ha)'),
('Cacao', 'Theobroma cacao', 'Cultivo tropical de alto valor. Requiere suelos profundos, bien drenados y ricos en materia orgánica.', 'Malvaceae', 'Perenne (produc. 3-30 años)', 20, 30, 80, 90, 5.0, 7.5, 'Medio (80-120 kg N/ha)', 'Medio (40-80 kg P2O5/ha)', 'Alto (100-150 kg K2O/ha)'),
('Caña de Azúcar', 'Saccharum officinarum', 'Gramínea de gran importancia industrial. Requiere suelos profundos con alta capacidad de retención hídrica.', 'Poaceae', '10-18 meses', 20, 35, 70, 85, 5.5, 7.5, 'Muy Alto (200-300 kg N/ha)', 'Medio (40-80 kg P2O5/ha)', 'Muy Alto (200-400 kg K2O/ha)'),
('Palto (Aguacate)', 'Persea americana', 'Árbol frutal de alto valor comercial. Sensible a suelos mal drenados. Requiere suelos profundos y bien aireados.', 'Lauraceae', 'Perenne (produc. 3-25 años)', 15, 30, 60, 75, 5.5, 7.0, 'Alto (100-200 kg N/ha)', 'Medio (50-100 kg P2O5/ha)', 'Alto (200-400 kg K2O/ha)');

-- ============================================================
-- SEED: Tipos de Fertilizantes
-- ============================================================
INSERT INTO tipos_fertilizantes (nombre, descripcion, modo_aplicacion) VALUES
('Fertilizante Nitrogenado', 'Aporta principalmente Nitrógeno (N), elemento esencial para el crecimiento vegetativo y síntesis de proteínas.', 'Suelo (banda, voleo, fertirrigación), foliar'),
('Fertilizante Fosfatado', 'Aporta principalmente Fósforo (P), esencial para el desarrollo radicular, floración y fructificación.', 'Suelo (banda, aplicación basal), fertirrigación'),
('Fertilizante Potásico', 'Aporta principalmente Potasio (K), fundamental para la calidad de frutos, resistencia a enfermedades y balance hídrico.', 'Suelo (voleo, banda, fertirrigación), foliar'),
('Fertilizante NPK Complejo', 'Aporta los tres macronutrientes primarios en proporciones variables según formulación.', 'Suelo (voleo, banda), fertirrigación'),
('Fertilizante Foliar', 'Aplicado directamente en hojas. Corrección rápida de deficiencias nutricionales.', 'Foliar (aspersión), no suelo'),
('Enmienda Orgánica', 'Material de origen orgánico que mejora la estructura del suelo y aporta nutrientes de liberación lenta.', 'Suelo (incorporación, cobertura)'),
('Fertilizante de Liberación Lenta', 'Recubiertos o encapsulados para liberar nutrientes gradualmente durante 3-12 meses.', 'Suelo (incorporación basal)'),
('Biofertilizante', 'Contiene microorganismos vivos que mejoran la disponibilidad de nutrientes en el suelo.', 'Suelo (drench, inoculación de semilla)'),
('Fertilizante Micronutriente', 'Aporta elementos menores (Fe, Mn, Zn, Cu, B, Mo) esenciales en pequeñas cantidades.', 'Foliar, suelo, fertirrigación');

-- ============================================================
-- SEED: Empresas Fabricantes
-- ============================================================
INSERT INTO empresas_fabricantes (nombre, pais, ciudad, sitio_web, descripcion, estado) VALUES
('Yara International', 'Noruega', 'Oslo', 'https://www.yara.com', 'Líder mundial en producción y distribución de fertilizantes minerales. Presente en más de 60 países.', 1),
('ICL Group', 'Israel', 'Tel Aviv', 'https://www.icl-group.com', 'Empresa global de especialidad en minerales y fertilizantes. Especialistas en potasio y fósforo.', 1),
('Mosaic Company', 'Estados Unidos', 'Tampa', 'https://www.mosaicco.com', 'Principal productor de fosfato y potasa concentrada del mundo.', 1),
('Haifa Group', 'Israel', 'Haifa', 'https://www.haifa-group.com', 'Especialistas en fertilizantes solubles en agua y nutrición de cultivos de precisión.', 1),
('SQM (Sociedad Química y Minera)', 'Chile', 'Santiago', 'https://www.sqm.com', 'Líder mundial en nutrición vegetal de especialidad, nitrato de potasio y yodo.', 1),
('Coromandel International', 'India', 'Hyderabad', 'https://www.coromandel.biz', 'Empresa líder en India en fertilizantes complejos y protección de cultivos.', 1),
('Koch Agronomic Services', 'Estados Unidos', 'Wichita', 'https://www.kochagronomicservices.com', 'Proveedor de fertilizantes de eficiencia mejorada y tecnología de aplicación.', 1),
('Fertiberia', 'España', 'Madrid', 'https://www.fertiberia.com', 'Empresa española líder en producción de fertilizantes nitrogenados y NPK.', 1),
('Bayer CropScience', 'Alemania', 'Leverkusen', 'https://www.bayer.com', 'Soluciones integrales de nutrición y protección de cultivos.', 1),
('AgroMind Perú SAC', 'Perú', 'Lima', 'https://www.agromind.com.pe', 'Empresa peruana especializada en nutrición vegetal adaptada a las condiciones andinas.', 1);

-- ============================================================
-- SEED: Nutrientes
-- ============================================================
INSERT INTO nutrientes (nombre, simbolo, tipo, descripcion, funcion_planta, deficiencia_sintomas, unidad) VALUES
('Nitrógeno', 'N', 'macronutriente_primario', 'Macronutriente primario esencial para el crecimiento vegetativo.', 'Componente de aminoácidos, proteínas, clorofila y ácidos nucleicos. Esencial para crecimiento foliar y productividad.', 'Amarillamiento (clorosis) de hojas inferiores que avanza hacia arriba. Reducción del crecimiento.', '%'),
('Fósforo', 'P', 'macronutriente_primario', 'Macronutriente primario clave para el desarrollo energético y reproductivo.', 'Componente del ATP, ADN, ARN y fosfolípidos. Esencial para desarrollo radicular, floración y maduración.', 'Coloración púrpura o rojiza en hojas. Retraso en maduración. Raíces subdesarrolladas.', '%'),
('Potasio', 'K', 'macronutriente_primario', 'Macronutriente primario regulador de procesos fisiológicos.', 'Regula apertura estomática, síntesis de proteínas, activación enzimática y transporte de azúcares.', 'Necrosis en bordes de hojas maduras. Frutos de baja calidad. Mayor susceptibilidad a enfermedades.', '%'),
('Calcio', 'Ca', 'macronutriente_secundario', 'Macronutriente secundario estructural de la pared celular.', 'Componente de la pared celular. Activa enzimas y estabiliza membranas. Reduce podredumbre.', 'Deformación de hojas jóvenes. Muerte del meristema apical. Pudrición apical en frutos.', '%'),
('Magnesio', 'Mg', 'macronutriente_secundario', 'Macronutriente secundario central en la clorofila.', 'Componente central de la clorofila. Cofactor enzimático. Participa en síntesis de proteínas.', 'Clorosis internerval en hojas maduras (verde en nervios, amarillo entre ellos).', '%'),
('Azufre', 'S', 'macronutriente_secundario', 'Macronutriente secundario en aminoácidos esenciales.', 'Componente de aminoácidos (cisteína, metionina). Participa en síntesis de vitaminas y glucosinolatos.', 'Clorosis uniforme en hojas jóvenes. Similar a deficiencia de N pero en tejido nuevo.', '%'),
('Hierro', 'Fe', 'micronutriente', 'Micronutriente esencial para síntesis de clorofila.', 'Síntesis de clorofila. Transporte de electrones. Fijación de nitrógeno.', 'Clorosis internerval severa en hojas jóvenes. Tejido casi blanco en casos extremos.', 'ppm'),
('Manganeso', 'Mn', 'micronutriente', 'Micronutriente activador de enzimas y fotosíntesis.', 'Activador de enzimas. Fotosíntesis (oxidación del agua). Síntesis de clorofila.', 'Clorosis internerval en hojas jóvenes. Manchas grises o marrones en hojas.', 'ppm'),
('Zinc', 'Zn', 'micronutriente', 'Micronutriente esencial para hormonas y enzimas.', 'Síntesis de auxinas. Activador enzimático. Síntesis de proteínas.', 'Hojas pequeñas y deformadas. Entrenudos cortos. Manchas cloróticas.', 'ppm'),
('Boro', 'B', 'micronutriente', 'Micronutriente para pared celular y reproducción.', 'Formación de pared celular. Germinación del polen. Transporte de azúcares.', 'Muerte del meristema apical. Deformación de hojas jóvenes. Falla en fructificación.', 'ppm');
