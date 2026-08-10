import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout, Thermometer, Droplets, Gauge, Activity, Sparkles,
  ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Layers, Info
} from 'lucide-react';
import { adminApi, recommendationsApi } from '../api';
import { Cultivo, TipoSuelo, RecommendationInput, Recommendation } from '../types';
import { useToast } from '../components/common/Toast';

export const NewRecommendation: React.FC = () => {
  const [step, setStep] = useState(1);
  const [crops, setCrops] = useState<Cultivo[]>([]);
  const [soilTypes, setSoilTypes] = useState<TipoSuelo[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<RecommendationInput>({
    cultivo_id: 1,
    tipo_suelo_id: 2,
    temperatura: 18.5,
    humedad: 70.0,
    ph: 6.2,
    nitrogeno: 45,
    fosforo: 25,
    potasio: 180,
    materia_organica: 3.2,
    conductividad_electrica: 1.2,
    notas_agronomo: '',
  });

  const [result, setResult] = useState<Recommendation | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const loadCatalogs = async () => {
      setLoading(true);
      try {
        const [c, s] = await Promise.all([adminApi.getCrops(), adminApi.getSoilTypes()]);
        setCrops(c);
        setSoilTypes(s);
        if (c.length > 0) setFormData((prev) => ({ ...prev, cultivo_id: c[0].id }));
        if (s.length > 0) setFormData((prev) => ({ ...prev, tipo_suelo_id: s[0].id }));
      } catch (err) {
        toast.error('Error cargando catálogos', 'Verifique la conexión con el servidor backend');
      } finally {
        setLoading(false);
      }
    };
    loadCatalogs();
  }, []);

  const handleChange = (field: keyof RecommendationInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const rec = await recommendationsApi.create(formData);
      setResult(rec);
      setStep(3);
      toast.success('¡Análisis Completado!', `Recomendación generada: ${rec.fertilizante_codigo}`);
    } catch (err: any) {
      toast.error(
        'Error en el análisis',
        err.response?.data?.message || 'El servicio de IA no pudo procesar la solicitud'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCrop = crops.find((c) => c.id === Number(formData.cultivo_id));
  const selectedSoil = soilTypes.find((s) => s.id === Number(formData.tipo_suelo_id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          Nueva Recomendación de Fertilizante
        </h1>
        <p className="text-sm text-surface-500 mt-1">
          Ingrese los datos agronómicos y el modelo de Machine Learning calculará el plan óptimo
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex items-center justify-between card p-4">
        <div className={`flex items-center gap-3 ${step >= 1 ? 'text-primary-600 font-bold' : 'text-surface-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-surface-200'}`}>
            1
          </div>
          <span className="text-xs sm:text-sm">Parámetros del Campo</span>
        </div>
        <div className="h-px bg-surface-200 flex-1 mx-4"></div>
        <div className={`flex items-center gap-3 ${step >= 2 ? 'text-primary-600 font-bold' : 'text-surface-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-surface-200'}`}>
            2
          </div>
          <span className="text-xs sm:text-sm">Análisis Nutricional N-P-K</span>
        </div>
        <div className="h-px bg-surface-200 flex-1 mx-4"></div>
        <div className={`flex items-center gap-3 ${step >= 3 ? 'text-primary-600 font-bold' : 'text-surface-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-primary-600 text-white' : 'bg-surface-200'}`}>
            3
          </div>
          <span className="text-xs sm:text-sm">Resultado IA</span>
        </div>
      </div>

      {/* Step Content */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* STEP 1: Crop and Environmental Parameters */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-6"
            >
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary-600" />
                1. Selección de Cultivo y Suelo
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Cultivo a Fertilizar</label>
                  <select
                    value={formData.cultivo_id}
                    onChange={(e) => handleChange('cultivo_id', Number(e.target.value))}
                    className="select"
                  >
                    {crops.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {c.nombre_cientifico ? `(${c.nombre_cientifico})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Tipo de Suelo (Textura)</label>
                  <select
                    value={formData.tipo_suelo_id}
                    onChange={(e) => handleChange('tipo_suelo_id', Number(e.target.value))}
                    className="select"
                  >
                    {soilTypes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 pt-4 border-t">
                <Thermometer className="w-5 h-5 text-primary-600" />
                Condiciones Ambientales
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Temperatura Promedio (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperatura}
                    onChange={(e) => handleChange('temperatura', Number(e.target.value))}
                    className="input"
                    required
                  />
                  <p className="text-[11px] text-surface-400 mt-1">Rango óptimo cultivo: {selectedCrop?.temperatura_optima_min || 10}°C - {selectedCrop?.temperatura_optima_max || 25}°C</p>
                </div>

                <div>
                  <label className="label">Humedad Relativa (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.humedad}
                    onChange={(e) => handleChange('humedad', Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <div></div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary cursor-pointer"
                >
                  Siguiente: Análisis Químico &rarr;
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Soil Chemical Analysis */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="card space-y-6"
            >
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                <Gauge className="w-5 h-5 text-primary-600" />
                2. Análisis Químico y Nutrientes del Suelo
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label">Nitrógeno N (mg/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.nitrogeno}
                    onChange={(e) => handleChange('nitrogeno', Number(e.target.value))}
                    className="input"
                    required
                  />
                  <p className="text-[11px] text-surface-400 mt-1">Óptimo: &gt; 40 mg/kg</p>
                </div>

                <div>
                  <label className="label">Fósforo P (mg/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fosforo}
                    onChange={(e) => handleChange('fosforo', Number(e.target.value))}
                    className="input"
                    required
                  />
                  <p className="text-[11px] text-surface-400 mt-1">Óptimo: &gt; 20 mg/kg</p>
                </div>

                <div>
                  <label className="label">Potasio K (mg/kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.potasio}
                    onChange={(e) => handleChange('potasio', Number(e.target.value))}
                    className="input"
                    required
                  />
                  <p className="text-[11px] text-surface-400 mt-1">Óptimo: &gt; 150 mg/kg</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="label">pH del Suelo (0-14)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={(e) => handleChange('ph', Number(e.target.value))}
                    className="input"
                    required
                  />
                  <p className="text-[11px] text-surface-400 mt-1">Óptimo cultivo: {selectedCrop?.ph_optimo_min || 5.5} - {selectedCrop?.ph_optimo_max || 7.0}</p>
                </div>

                <div>
                  <label className="label">Materia Orgánica (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.materia_organica}
                    onChange={(e) => handleChange('materia_organica', Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Conductividad Eléctrica (dS/m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.conductividad_electrica}
                    onChange={(e) => handleChange('conductividad_electrica', Number(e.target.value))}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Notas del Agrónomo / Observaciones de Campo</label>
                <textarea
                  rows={2}
                  value={formData.notas_agronomo}
                  onChange={(e) => handleChange('notas_agronomo', e.target.value)}
                  placeholder="Ej. Síntomas de amarilleo en hojas inferiores, historial previo de alfalfa..."
                  className="input"
                ></textarea>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary cursor-pointer"
                >
                  &larr; Volver
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary cursor-pointer flex items-center gap-2"
                >
                  {submitting ? (
                    <>Procesando en IA...</>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Calcular Recomendación IA
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ML Result View */}
          {step === 3 && result && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Top Result Card */}
              <div className="card bg-gradient-primary text-white p-8 relative overflow-hidden shadow-glow-lg">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <span className="badge bg-white/20 text-white font-semibold mb-3">
                      Recomendación Generada por IA
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      {result.fertilizante_nombre || result.fertilizante_codigo}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      Código: <span className="font-mono font-bold">{result.fertilizante_codigo}</span>
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center min-w-[160px]">
                    <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">Dosis Sugerida</p>
                    <p className="text-3xl font-black mt-1">
                      {result.cantidad_recomendada} <span className="text-sm font-normal">kg/ha</span>
                    </p>
                    <p className="text-[11px] text-white/90 mt-1 font-medium">
                      Confianza: {((result.nivel_confianza || 0) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Justification & Deficiencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card space-y-3">
                  <h3 className="font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 text-base">
                    <Info className="w-5 h-5 text-primary-600" />
                    Justificación Agronómica IA
                  </h3>
                  <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed">
                    {result.justificacion}
                  </p>
                </div>

                <div className="card space-y-3">
                  <h3 className="font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 text-base">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    Deficiencias Detectadas
                  </h3>
                  {result.deficiencias_detectadas && result.deficiencias_detectadas.length > 0 ? (
                    <ul className="space-y-2">
                      {result.deficiencias_detectadas.map((def, idx) => (
                        <li key={idx} className="text-xs font-medium text-surface-700 dark:text-surface-300 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0"></span>
                          {def}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-green-600 font-semibold">No se detectaron deficiencias nutricionales severas.</p>
                  )}
                </div>
              </div>

              {/* Best Practices */}
              {result.buenas_practicas && (
                <div className="card space-y-3">
                  <h3 className="font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2 text-base">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Buenas Prácticas de Aplicación
                  </h3>
                  <pre className="text-xs text-surface-600 dark:text-surface-300 font-sans whitespace-pre-wrap leading-relaxed bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border">
                    {result.buenas_practicas}
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <button
                  type="button"
                  onClick={() => { setStep(1); setResult(null); }}
                  className="btn-secondary cursor-pointer"
                >
                  &larr; Realizar Nuevo Análisis
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/recommendations/${result.id}`)}
                  className="btn-primary cursor-pointer"
                >
                  Ver Ficha Técnica Completa &rarr;
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};
