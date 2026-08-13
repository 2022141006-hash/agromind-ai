-- ============================================================
-- AgroMind AI - Alinear BD de producción con el seed local
-- Idempotente (se puede ejecutar varias veces sin duplicar).
-- Ejecutar contra la BD de producción (MariaDB/MySQL, utf8mb4)
-- Ejemplo: mysql -h <host> -P <puerto> -u <user> -p <database> < 03_seed_produccion.sql
-- ============================================================

-- Protección contra duplicados: índices únicos temporales
ALTER TABLE cultivos ADD UNIQUE INDEX uq_tmp_nombre (nombre);
ALTER TABLE tipos_suelo ADD UNIQUE INDEX uq_tmp_nombre (nombre);
ALTER TABLE tipos_fertilizantes ADD UNIQUE INDEX uq_tmp_nombre (nombre);
ALTER TABLE empresas_fabricantes ADD UNIQUE INDEX uq_tmp_nombre (nombre);
ALTER TABLE nutrientes ADD UNIQUE INDEX uq_tmp_simbolo (simbolo);
ALTER TABLE modelo_ia ADD UNIQUE INDEX uq_tmp_version (version);

-- ============================================================
-- 1. TIPOS DE SUELO (8)
-- ============================================================
INSERT IGNORE INTO tipos_suelo (nombre, descripcion, ph_tipico_min, ph_tipico_max, textura, capacidad_retencion) VALUES
('Arcilloso', 'Suelo con alta proporción de partículas finas. Alta capacidad de retención de agua y nutrientes, pero puede compactarse fácilmente.', 5.5, 7.5, 'Fina (<0.002 mm)', 'Muy Alta'),
('Franco', 'Suelo equilibrado con proporciones similares de arena, limo y arcilla. Ideal para la mayoría de cultivos.', 5.5, 7.0, 'Media (mezcla)', 'Alta'),
('Arenoso', 'Suelo con alta proporción de partículas gruesas. Buen drenaje pero baja retención de nutrientes.', 5.0, 7.0, 'Gruesa (>0.05 mm)', 'Baja'),
('Franco-Arcilloso', 'Suelo intermedio con características de suelo franco y arcilloso. Buena retención con drenaje aceptable.', 5.5, 7.5, 'Media-Fina', 'Alta'),
('Franco-Arenoso', 'Suelo con predominancia arenosa pero con partículas finas. Drenaje moderado y retención media.', 5.0, 7.0, 'Media-Gruesa', 'Media'),
('Limoso', 'Suelo con alta proporción de limo. Buena fertilidad natural pero susceptible a la compactación.', 5.5, 7.5, 'Media (0.002-0.05 mm)', 'Alta'),
('Orgánico', 'Suelo con alta concentración de materia orgánica descompuesta. Excelente fertilidad y estructura.', 4.5, 6.5, 'Variable', 'Muy Alta'),
('Calcáreo', 'Suelo rico en carbonato de calcio. pH elevado, puede generar deficiencias de micronutrientes.', 7.0, 8.5, 'Variable', 'Media');

-- ============================================================
-- 2. CULTIVOS (12)
-- ============================================================
INSERT IGNORE INTO cultivos (nombre, nombre_cientifico, descripcion, familia, ciclo_cultivo, temperatura_optima_min, temperatura_optima_max, humedad_optima_min, humedad_optima_max, ph_optimo_min, ph_optimo_max, requerimiento_n, requerimiento_p, requerimiento_k) VALUES
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
-- 3. TIPOS DE FERTILIZANTE (9)
-- ============================================================
INSERT IGNORE INTO tipos_fertilizantes (nombre, descripcion, modo_aplicacion) VALUES
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
-- 4. EMPRESAS FABRICANTES (10)
-- ============================================================
INSERT IGNORE INTO empresas_fabricantes (nombre, pais, ciudad, sitio_web, descripcion, estado) VALUES
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
-- 5. NUTRIENTES (10)
-- ============================================================
INSERT IGNORE INTO nutrientes (nombre, simbolo, tipo, descripcion, funcion_planta, deficiencia_sintomas, unidad) VALUES
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

-- ============================================================
-- 6. FERTILIZANTES (catálogo completo del seed)
--    Corrige también los códigos existentes para que coincidan
--    con los que emite el servicio ML (DAP-18-46, NPK-15-15-15)
-- ============================================================
UPDATE fertilizantes
SET codigo = 'DAP-18-46',
    nombre = 'DAP (Fosfato Diamónico)',
    descripcion = 'Fertilizante fosfatado con N. El más utilizado globalmente para aporte de P en siembra.',
    formula_quimica = '(NH4)2HPO4',
    nivel_riesgo = 'bajo'
WHERE codigo = 'DAP-18460';

UPDATE fertilizantes
SET codigo = 'NPK-15-15-15',
    nombre = 'NPK 15-15-15',
    descripcion = 'Fertilizante NPK balanceado de uso general.',
    formula_quimica = 'NPK (15-15-15)',
    nivel_riesgo = 'bajo'
WHERE codigo = 'NPK-151515';

INSERT IGNORE INTO fertilizantes (tipo_fertilizante_id, fabricante_id, codigo, nombre, nombre_comercial, descripcion, formula_quimica, concentracion_n, concentracion_p, concentracion_k, dosis_recomendada_min, dosis_recomendada_max, unidad_dosis, modo_aplicacion, frecuencia_aplicacion, momento_aplicacion, tiempo_accion, beneficios, contraindicaciones, nivel_riesgo, precio_referencia, unidad_precio, disponibilidad) VALUES
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Nitrogenado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Yara International'), 'UREA-46', 'Urea Agrícola 46%', 'YaraVera UREA', 'Fertilizante nitrogenado sólido con mayor concentración de N disponible. El más utilizado mundialmente por su costo-eficiencia.', 'CO(NH2)2', 46.0, 0.0, 0.0, 100, 250, 'kg/ha', 'Suelo al voleo o en banda, incorporar inmediatamente para evitar volatilización. Fertirrigación en dosis fraccionadas.', '2-3 aplicaciones por ciclo de cultivo', 'Antes de la siembra (50%) y durante el desarrollo vegetativo activo', 'Rápida disponibilidad (7-14 días)', 'Alta concentración de N, bajo costo por kg de N, fácil manejo, compatible con la mayoría de fertilizantes.', 'Riesgo de volatilización de amoniaco si no se incorpora. No mezclar con cal. Puede acidificar el suelo a largo plazo.', 'moderado', 28.50, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Nitrogenado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Fertiberia'), 'SA-21', 'Sulfato de Amonio 21%', 'SULFAMMO', 'Fertilizante nitrogenado con azufre. Ideal para suelos deficientes en S y cultivos que requieren pH ácido.', '(NH4)2SO4', 21.0, 0.0, 0.0, 150, 350, 'kg/ha', 'Suelo al voleo incorporado o en banda. No foliar.', '2-3 aplicaciones por campaña', 'Presiembra y macollamiento/ramificación', 'Disponibilidad media (14-21 días)', 'Aporta N y S simultáneamente. Acidifica el suelo (útil en suelos calcáreos). Bajo riesgo de volatilización.', 'Puede acidificar excesivamente suelos ya ácidos. No apto para pH < 5.0.', 'bajo', 22.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Nitrogenado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Yara International'), 'NIT-27', 'Nitrato de Amonio 33%', 'YaraBela NITRABOR', 'Fertilizante nitrogenado de acción rápida con doble forma de N. Alta eficiencia en climas fríos.', 'NH4NO3', 33.5, 0.0, 0.0, 80, 200, 'kg/ha', 'Suelo en banda o cobertura. Evitar contacto con semilla.', '2-4 aplicaciones fraccionadas', 'Desde germinación hasta estadio vegetativo avanzado', 'Muy rápida (3-7 días)', 'Doble forma de N (nítrica + amoniacal). Excelente en climas fríos. Mínima volatilización.', 'Producto clasificado como oxidante. Restricciones de transporte y almacenamiento. No mezclar con material orgánico.', 'alto', 35.00, 'USD/50kg', 'media'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Fosfatado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Mosaic Company'), 'DAP-18-46', 'DAP (Fosfato Diamónico)', 'Mosaic DAP', 'Fertilizante fosfatado con N. El más utilizado globalmente para aporte de P en siembra. Excelente compatibilidad con suelos neutros.', '(NH4)2HPO4', 18.0, 46.0, 0.0, 100, 250, 'kg/ha', 'Suelo en banda al momento de la siembra, no en contacto directo con semilla.', '1-2 aplicaciones (base + complemento)', 'Presiembra o siembra en banda', 'Disponibilidad lenta-media (21-45 días)', 'Alta concentración de P. Mejora establecimiento de raíces. Estimula floración y cuajado de frutos.', 'No usar en suelos con pH > 7.5 (precipita el P). Puede generar toxicidad en semillas si hay contacto directo.', 'bajo', 38.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Fosfatado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Mosaic Company'), 'MAP-12-61', 'MAP (Fosfato Monoamónico)', 'Mosaic MAP', 'Fertilizante fosfatado soluble. Ideal para fertirrigación y suelos alcalinos por su ligera acidificación.', 'NH4H2PO4', 12.0, 61.0, 0.0, 80, 180, 'kg/ha', 'Fertirrigación, solución foliar baja concentración, suelo en banda.', '2-3 aplicaciones durante el ciclo', 'Desde siembra hasta inicio de floración', 'Rápida disponibilidad (7-14 días)', 'Altamente soluble. Excelente para fertirrigación. Ligera acidificación (útil en suelos calcáreos). Alta concentración de P.', 'No mezclar con fertilizantes cálcicos o magnésicos en solución. Puede precipitar.', 'bajo', 42.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Fosfatado'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'AgroMind Perú SAC'), 'SF-0-20', 'Superfosfato Triple 46%', 'AgroMind TSP', 'Fertilizante fosfatado de alta concentración sin N. Ideal para suelos donde se desea aplicar P y N por separado.', 'Ca(H2PO4)2', 0.0, 46.0, 0.0, 100, 300, 'kg/ha', 'Suelo en banda profunda o incorporado. Lenta solubilidad.', '1 aplicación por ciclo (dosis alta)', 'Presiembra, incorporado al suelo al menos 2 semanas antes de la siembra', 'Lenta (30-60 días para máxima disponibilidad)', 'Alta concentración de P sin N. Menor riesgo de quema por nitrógeno. Larga residualidad en suelo.', 'Baja solubilidad inicial. No apto para fertirrigación directa. Requiere pH adecuado (5.5-6.5).', 'bajo', 32.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Potásico'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'ICL Group'), 'KCL-60', 'Cloruro de Potasio 60%', 'ICL MOP', 'Fertilizante potásico más económico y concentrado. El más utilizado mundialmente para aporte de K.', 'KCl', 0.0, 0.0, 60.0, 100, 300, 'kg/ha', 'Suelo al voleo o en banda. No en contacto con semilla.', '1-2 aplicaciones por ciclo', 'Presiembra o inicio de desarrollo vegetativo', 'Media (14-21 días)', 'Alta concentración de K. Bajo costo. Amplia disponibilidad global. Mejora calidad de frutos.', 'El cloruro puede afectar cultivos sensibles (tabaco, papa). No usar en suelos salinos. Puede incrementar la salinidad.', 'bajo', 25.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Potásico'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'SQM (Sociedad Química y Minera)'), 'KNO3-13-46', 'Nitrato de Potasio', 'SQM Haifa KNO3', 'Fertilizante de doble función: N nítrico + K. Ideal para fertirrigación en etapas de fructificación.', 'KNO3', 13.0, 0.0, 46.0, 50, 150, 'kg/ha', 'Fertirrigación (altamente soluble), foliar diluido.', '3-5 aplicaciones durante fructificación', 'Desde inicio de floración hasta cosecha', 'Muy rápida (3-7 días)', 'Libre de cloruro. Excelente para fertirrigación. Mejora coloración y sabor de frutos. Reduce incidencia de podredumbre apical.', 'Alto costo. No mezclar con fertilizantes con amonio (puede generar calor). Solo para fertirrigación.', 'bajo', 65.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante NPK Complejo'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Yara International'), 'NPK-15-15-15', 'NPK 15-15-15', 'YaraMila COMPLEX', 'Fertilizante NPK balanceado de uso general. Proporciona los tres macronutrientes primarios en proporciones iguales.', 'NPK (15-15-15)', 15.0, 15.0, 15.0, 150, 400, 'kg/ha', 'Suelo al voleo o en banda. Fertirrigación en versión soluble.', '2-3 aplicaciones por ciclo de cultivo', 'Presiembra o siembra (70%) + desarrollo vegetativo (30%)', 'Media (14-21 días)', 'Equilibrio nutricional completo. Reduce número de aplicaciones. Fácil manejo. Compatible con la mayoría de cultivos.', 'No ideal cuando se requiere ajuste nutricional específico. Puede aportar exceso de algún nutriente.', 'bajo', 45.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante NPK Complejo'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Yara International'), 'NPK-12-24-12', 'NPK 12-24-12', 'YaraMila ACTYVA', 'Fertilizante NPK con alto P para fase de establecimiento. Ideal para cultivos exigentes en fósforo durante la siembra.', 'NPK (12-24-12)', 12.0, 24.0, 12.0, 100, 300, 'kg/ha', 'Suelo en banda cerca de la semilla o raíz. Incorporado.', '1-2 aplicaciones en fases iniciales', 'Siembra y 30 días después de la siembra', 'Media (14-21 días)', 'Alto P para estimular desarrollo radicular. Equilibrado N y K. Excelente para trasplantes.', 'No usar en exceso en suelos ya ricos en P. Puede generar desequilibrios a largo plazo.', 'bajo', 48.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante NPK Complejo'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Fertiberia'), 'NPK-10-26-26', 'NPK 10-26-26 (Alto P-K)', 'Fertiberia FERTILIS', 'Fertilizante NPK con alto P y K. Diseñado para fases de floración y fructificación donde se necesita menos N.', 'NPK (10-26-26)', 10.0, 26.0, 26.0, 100, 250, 'kg/ha', 'Suelo en banda o fertirrigación (versión soluble).', '2-3 aplicaciones desde floración hasta cuajado', 'Inicio de floración y cuajado de frutos', 'Media-rápida (10-21 días)', 'Promueve floración abundante. Mejora calidad y tamaño de frutos. Reduce deficiencias de P y K simultáneamente.', 'Puede aportar exceso de P en suelos ya ricos. No usar en fase vegetativa activa.', 'bajo', 52.00, 'USD/50kg', 'media'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Foliar'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Haifa Group'), 'FOL-N-30', 'Foliar Nitrogenado 30%', 'Haifa Nutri.fol N', 'Solución foliar de N de alta concentración para corrección rápida de deficiencias nitrogenadas.', 'NH4NO3 (solución)', 30.0, 0.0, 0.0, 2, 5, 'L/ha', 'Aspersión foliar diluido al 0.5-1%. No usar en horas de máxima temperatura.', '1-3 aplicaciones según severidad de deficiencia', 'Al detectar síntomas de deficiencia o en períodos críticos', 'Muy rápida (24-72 horas)', 'Corrección inmediata de deficiencias. No afecta pH del suelo. Uso eficiente del N.', 'Riesgo de quema foliar si se aplica concentrado o en calor. No sustituye fertilización de suelo.', 'bajo', 18.00, 'USD/L', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante Foliar'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Haifa Group'), 'FOL-NPK-20-20-20', 'Foliar NPK 20-20-20', 'Haifa Multi K', 'Fertilizante foliar completo y soluble para fertirrigación o aplicación foliar. Alta pureza.', 'NPK Soluble (20-20-20)', 20.0, 20.0, 20.0, 1, 3, 'kg/ha', 'Foliar: 0.2-0.5% en solución. Fertirrigación: 1-5 kg/1000L', '5-10 aplicaciones durante el ciclo según necesidad', 'Durante todo el ciclo del cultivo en momentos críticos', 'Muy rápida (12-48 horas)', 'Alta solubilidad. Sin cloruro. Corrección rápida y completa. Compatible con agroquímicos.', 'Alto costo. Complementario, no sustituto de fertilización de suelo.', 'bajo', 55.00, 'USD/5kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Enmienda Orgánica'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'AgroMind Perú SAC'), 'HUMUS-ORG', 'Humus de Lombriz', 'AgroMind VERMICOMPOST', 'Abono orgánico de alta calidad producido por lombrices. Rico en materia orgánica y microorganismos benéficos.', 'Materia Orgánica 60-80%', 2.5, 1.5, 2.0, 2000, 5000, 'kg/ha', 'Suelo incorporado al voleo o en banda. Cobertura superficial.', '1-2 aplicaciones por ciclo (inicio y complemento)', 'Preparación del terreno o trasplante', 'Lenta y sostenida (2-6 meses)', 'Mejora estructura del suelo. Aumenta actividad microbiana. Aporta hormonas de crecimiento. Larga residualidad.', 'Baja concentración de nutrientes. Requiere grandes cantidades. Puede introducir semillas de malezas si no está bien compostado.', 'bajo', 8.00, 'USD/50kg', 'alta'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Fertilizante de Liberación Lenta'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'Koch Agronomic Services'), 'LIB-LENTA-NPK', 'NPK Liberación Controlada 16-8-12', 'Koch Agrium ESN', 'Fertilizante recubierto con polímero para liberación gradual de nutrientes durante 3-6 meses. Minimiza pérdidas.', 'Recubierto NPK (16-8-12)', 16.0, 8.0, 12.0, 100, 200, 'kg/ha', 'Suelo incorporado o superficie. Una sola aplicación por ciclo.', '1 aplicación por ciclo completo', 'Siembra o trasplante', 'Gradual 3-6 meses según temperatura del suelo', 'Menor número de aplicaciones. Reduce lixiviación. Mayor eficiencia de uso. Reduce mano de obra.', 'Alto costo inicial. No apto para correcciones de deficiencias agudas. Menor flexibilidad de ajuste.', 'bajo', 85.00, 'USD/25kg', 'media'),
((SELECT id FROM tipos_fertilizantes WHERE nombre = 'Biofertilizante'), (SELECT id FROM empresas_fabricantes WHERE nombre = 'AgroMind Perú SAC'), 'BIO-RHIZO', 'Biofertilizante Rizobium', 'AgroMind BIOFIX', 'Inoculante con bacterias fijadoras de N atmosférico (Rhizobium/Bradyrhizobium). Para leguminosas.', 'Rhizobium spp. (10^8 UFC/g)', 0.0, 0.0, 0.0, 0, 0, 'kg/ha', 'Inoculación de semilla o drench al suelo en siembra.', '1 aplicación por ciclo (siembra)', 'Siembra exclusivamente', 'Efecto durante toda la campaña', 'Fija N atmosférico gratuitamente. Reduce necesidad de N sintético 30-80%. Mejora la salud del suelo.', 'Solo para leguminosas. Sensible al calor y luz UV. Incompatible con fungicidas de semilla cúpricos.', 'bajo', 15.00, 'USD/250g', 'media');

-- ============================================================
-- 7. FERTILIZANTE-NUTRIENTES (composición)
-- ============================================================
INSERT IGNORE INTO fertilizante_nutrientes (fertilizante_id, nutriente_id, porcentaje, es_primario) VALUES
((SELECT id FROM fertilizantes WHERE codigo = 'UREA-46'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 46.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'SA-21'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 21.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'SA-21'), (SELECT id FROM nutrientes WHERE simbolo = 'S'), 24.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'NIT-27'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 33.50, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'DAP-18-46'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 18.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'DAP-18-46'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 46.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'MAP-12-61'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 12.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'MAP-12-61'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 61.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'SF-0-20'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 46.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'KCL-60'), (SELECT id FROM nutrientes WHERE simbolo = 'K'), 60.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'KNO3-13-46'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 13.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'KNO3-13-46'), (SELECT id FROM nutrientes WHERE simbolo = 'K'), 46.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-15-15-15'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 15.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-15-15-15'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 15.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-15-15-15'), (SELECT id FROM nutrientes WHERE simbolo = 'K'), 15.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-12-24-12'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 12.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-12-24-12'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 24.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-12-24-12'), (SELECT id FROM nutrientes WHERE simbolo = 'K'), 12.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-10-26-26'), (SELECT id FROM nutrientes WHERE simbolo = 'N'), 10.00, 0),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-10-26-26'), (SELECT id FROM nutrientes WHERE simbolo = 'P'), 26.00, 1),
((SELECT id FROM fertilizantes WHERE codigo = 'NPK-10-26-26'), (SELECT id FROM nutrientes WHERE simbolo = 'K'), 26.00, 1);

-- ============================================================
-- 8. MODELO IA activo
-- ============================================================
INSERT IGNORE INTO modelo_ia (nombre, version, algoritmo, descripcion, precision_global, f1_score, features_entrada, target_salida, archivo_modelo, activo, fecha_entrenamiento) VALUES
('AgroMind Fertilizer Predictor', 'v1.0.0', 'Random Forest Classifier + Regressor',
 'Modelo de aprendizaje automático para recomendación de fertilizantes basado en parámetros de suelo y cultivo. Entrenado con datos agronómicos de cultivos andinos y tropicales.',
 0.8750, 0.8620,
 JSON_ARRAY('cultivo_id', 'tipo_suelo_id', 'temperatura', 'humedad', 'ph', 'nitrogeno', 'fosforo', 'potasio', 'materia_organica', 'conductividad_electrica'),
 JSON_OBJECT('clase', 'fertilizante_codigo', 'regresion', 'cantidad_kg', 'metadata', JSON_ARRAY('confianza', 'deficiencias')),
 'artifacts/agromind_model_v1.joblib',
 1,
 CURRENT_TIMESTAMP);

-- ============================================================
-- 9. REVINCULAR recomendaciones existentes al fertilizante real
--     (las que quedaron con fertilizante_id NULL guardaron el
--     código que emitió el ML en fertilizante_codigo_predicho)
-- ============================================================
UPDATE recomendaciones r
JOIN fertilizantes f ON f.codigo = r.fertilizante_codigo_predicho
SET r.fertilizante_id = f.id
WHERE r.fertilizante_id IS NULL
  AND r.fertilizante_codigo_predicho IS NOT NULL
  AND r.fertilizante_codigo_predicho <> '';

-- ============================================================
-- 10. CONFIGURACIONES del sistema
-- ============================================================
INSERT IGNORE INTO configuraciones (clave, valor, tipo, descripcion, grupo) VALUES
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

-- ============================================================
-- 11. USUARIOS demo faltantes
--     Cuentas @agromind.ai (password: admin123 / agro123 / agri123)
--     Cuentas @agromind.com (password: Admin123!)
-- ============================================================
INSERT IGNORE INTO usuarios (rol_id, nombre, apellido, email, password_hash, organizacion, cargo, estado) VALUES
(1, 'Administrador', 'AgroMind', 'admin@agromind.ai',
  '$2a$10$I5/nOjr3hFTvG5Akvu03BOvF8dK/Vm4nKlYiY8qFvbZG9LHzRMmpi',
  'AgroMind AI', 'Administrador del Sistema', 1),
(2, 'Carlos', 'Mendoza', 'agronomo@agromind.ai',
  '$2a$10$.2nLK3oUxDUGT4DFro8di.59fJlAg4ydtaC0hJKFzrNvPOA7lWIje',
  'AgroMind AI', 'Ingeniero Agrónomo Senior', 1),
(3, 'Juan', 'Quispe', 'agricultor@agromind.ai',
  '$2a$10$cQCqeSmv28rJ2rhY23OpbeS0DSjRhLurH0Ns4Xrk4bBg2HWZLZfXC',
  'Comunidad Agrícola Huancayo', 'Agricultor', 1),
(1, 'Admin', 'Sistema', 'admin@agromind.com',
  '$2a$10$8Q0Y4ueKZ3EiAyovZs.1Ruk7KBDz3/BxLFRQNf5DBfjsRUDjCPzm.',
  'AgroMind Enterprise', 'Admin', 1),
(2, 'Agrónomo', 'Principal', 'agronomo@agromind.com',
  '$2a$10$8Q0Y4ueKZ3EiAyovZs.1Ruk7KBDz3/BxLFRQNf5DBfjsRUDjCPzm.',
  'AgroMind Enterprise', 'Agrónomo', 1);

-- ============================================================
-- LIMPIEZA: quitar índices únicos temporales
-- ============================================================
DROP INDEX uq_tmp_nombre ON cultivos;
DROP INDEX uq_tmp_nombre ON tipos_suelo;
DROP INDEX uq_tmp_nombre ON tipos_fertilizantes;
DROP INDEX uq_tmp_nombre ON empresas_fabricantes;
DROP INDEX uq_tmp_simbolo ON nutrientes;
DROP INDEX uq_tmp_version ON modelo_ia;
