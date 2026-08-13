import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Printer, Download, Share2, Sprout, FlaskConical,
  CheckCircle2, AlertTriangle, Info, ShieldCheck, Building2, ExternalLink
} from 'lucide-react';
import { recommendationsApi } from '../api';
import { Recommendation } from '../types';

export const RecommendationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const data = await recommendationsApi.getById(Number(id));
        setRec(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="p-12 text-center text-surface-500">Cargando recomendación agronómica...</div>;
  }

  if (!rec) {
    return <div className="p-12 text-center text-red-500">Recomendación no encontrada.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar Actions */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => navigate(-1)}
          className="btn-ghost flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="btn-secondary cursor-pointer flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir Reporte
          </button>
        </div>
      </div>

      {/* Main Technical Sheet Card */}
      <div className="card space-y-6 print:shadow-none print:border-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between border-b pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary-600 font-bold mb-1">
              <Sprout className="w-5 h-5" />
              AgroMind AI — Ficha Técnica Agronómica
            </div>
            <h1 className="text-2xl font-black text-surface-900 dark:text-surface-100">
              {rec.cultivo_nombre || 'Cultivo'} — Diagnóstico de Nutrición
            </h1>
            <p className="text-xs text-surface-500 mt-0.5">
              ID de Reporte: #{rec.id} | Generado el: {new Date(rec.created_at).toLocaleString('es-PE')}
            </p>
          </div>

          <div className="text-right">
            <span className="badge-green text-sm font-mono px-3 py-1">
              Confianza IA: {((rec.nivel_confianza || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Input Parameters Summary */}
        <div>
          <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">
            Parámetros del Suelo y Clima Registrados
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border">
            <div>
              <span className="text-[11px] text-surface-400 block">Cultivo</span>
              <span className="text-xs font-bold">{rec.cultivo_nombre}</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Tipo Suelo</span>
              <span className="text-xs font-bold">{rec.tipo_suelo_nombre}</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">pH Suelo</span>
              <span className="text-xs font-bold">{rec.ph}</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Materia Orgánica</span>
              <span className="text-xs font-bold">{rec.materia_organica}%</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Nitrógeno (N)</span>
              <span className="text-xs font-bold">{rec.nitrogeno} mg/kg</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Fósforo (P)</span>
              <span className="text-xs font-bold">{rec.fosforo} mg/kg</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Potasio (K)</span>
              <span className="text-xs font-bold">{rec.potasio} mg/kg</span>
            </div>
            <div>
              <span className="text-[11px] text-surface-400 block">Cond. Eléctrica</span>
              <span className="text-xs font-bold">{rec.conductividad_electrica} dS/m</span>
            </div>
          </div>
        </div>

        {/* Prescription Box */}
        <div className="p-6 rounded-2xl bg-gradient-primary text-white space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Prescripción de Fertilizante Recomendado</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-3xl font-extrabold">{rec.fertilizante_nombre || rec.fertilizante_codigo || rec.fertilizante_codigo_predicho}</h2>
              <p className="text-xs text-white/90 font-mono mt-0.5">Código Modelo: {rec.fertilizante_codigo || rec.fertilizante_codigo_predicho}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-right">
              <span className="text-[11px] uppercase tracking-wider block text-white/80">Dosis Recomendada</span>
              <span className="text-2xl font-bold">{rec.cantidad_recomendada} {rec.unidad_cantidad}</span>
            </div>
          </div>
        </div>

        {/* Commercial details & manufacturer */}
        {rec.fabricante_nombre && (
          <div className="card bg-surface-50 dark:bg-surface-800 p-4 border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-primary-600" />
              <div>
                <p className="text-xs font-bold text-surface-900 dark:text-surface-100">
                  Fabricante Registrado: {rec.fabricante_nombre}
                </p>
                <p className="text-[11px] text-surface-500">Origen: {rec.fabricante_pais || 'Internacional'}</p>
              </div>
            </div>
            {rec.fabricante_sitio_web && (
              <a
                href={rec.fabricante_sitio_web}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1"
              >
                Ficha Fabricante <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Justification & Analysis */}
        <div className="space-y-4">
          <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base">
            Fundamentación del Algoritmo
          </h3>
          <p className="text-sm text-surface-600 dark:text-surface-300 leading-relaxed bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border">
            {rec.justificacion}
          </p>
        </div>

        {/* Additional Agronomic Advice */}
        {rec.recomendaciones_adicionales && (
          <div className="space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base">
              Recomendaciones de Manejo de Suelo
            </h3>
            <div className="text-xs text-surface-600 dark:text-surface-300 whitespace-pre-wrap bg-surface-50 dark:bg-surface-900 p-4 rounded-xl border">
              {rec.recomendaciones_adicionales}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4 text-center text-[11px] text-surface-400">
          AgroMind AI — Sistema Inteligente de Recomendación de Fertilizantes mediante Aprendizaje Automático
        </div>
      </div>
    </div>
  );
};
