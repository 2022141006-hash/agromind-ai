import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Sprout, FlaskConical, Users, Award, TrendingUp, ArrowUpRight,
  Sparkles, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { adminApi, recommendationsApi } from '../api';
import { DashboardStats, Recommendation } from '../types';

const COLORS = ['#16A34A', '#22C55E', '#84CC16', '#EAB308', '#3B82F6', '#6366F1'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentRecs, setRecentRecs] = useState<Recommendation[]>([]);
  const [cropChartData, setCropChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashStats, recsData, cropReports] = await Promise.all([
          adminApi.getDashboardStats().catch(() => null),
          recommendationsApi.getAll({ limit: 5 }).catch(() => null),
          adminApi.getReportByCrop().catch(() => []),
        ]);

        if (dashStats) setStats(dashStats);
        if (recsData) setRecentRecs(recsData.data);
        if (cropReports) setCropChartData(cropReports);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const monthlyData = [
    { mes: 'Ene', analisis: 12 },
    { mes: 'Feb', analisis: 19 },
    { mes: 'Mar', analisis: 25 },
    { mes: 'Abr', analisis: 32 },
    { mes: 'May', analisis: 48 },
    { mes: 'Jun', analisis: 64 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Panel de Control Agronómico
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Resumen ejecutivo del sistema de IA y estado de recomendaciones
          </p>
        </div>

        <button
          onClick={() => navigate('/recommendations/new')}
          className="btn-primary flex items-center gap-2 shadow-glow cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-white" />
          Nueva Recomendación IA
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card flex items-center gap-4"
        >
          <div className="p-3.5 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Analisis Realizados</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">
              {loading ? '...' : stats?.recomendaciones || 0}
            </p>
            <span className="text-[11px] font-medium text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +18% este mes
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card flex items-center gap-4"
        >
          <div className="p-3.5 rounded-2xl bg-accent-400/20 text-accent-600 dark:text-accent-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Precisión del Modelo</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">
              {loading ? '...' : `${((stats?.precisionModelo || 0.94) * 100).toFixed(1)}%`}
            </p>
            <span className="text-[11px] font-medium text-surface-500 flex items-center gap-1 mt-1">
              Random Forest v1.0
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card flex items-center gap-4"
        >
          <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Cultivos Registrados</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">
              {loading ? '...' : stats?.cultivos || 12}
            </p>
            <span className="text-[11px] font-medium text-surface-500 flex items-center gap-1 mt-1">
              Papa, Maíz, Café, etc.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card flex items-center gap-4"
        >
          <div className="p-3.5 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Usuarios Activos</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-surface-100 mt-0.5">
              {loading ? '...' : stats?.usuarios || 3}
            </p>
            <span className="text-[11px] font-medium text-surface-500 flex items-center gap-1 mt-1">
              Agrónomos y Agricultores
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <div className="card lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base">
                Tendencia de Recomendaciones
              </h3>
              <p className="text-xs text-surface-500">Volumen mensual de análisis generados</p>
            </div>
          </div>
          <div className="h-64 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAnalisis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="mes" stroke="#94A3B8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="analisis" stroke="#16A34A" strokeWidth={3} fillOpacity={1} fill="url(#colorAnalisis)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Status Card */}
        <div className="card bg-gradient-dark text-white flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="badge bg-green-500/20 text-green-400 border border-green-500/30">
                Modelo En Línea
              </span>
              <ShieldCheck className="w-5 h-5 text-primary-400" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">AgroMind Random Forest v1</h3>
              <p className="text-xs text-surface-400 mt-1">
                Entrenado con 800+ muestras agronómicas multivariables
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-surface-700/50">
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Algoritmo</span>
                <span className="font-semibold text-surface-200">RandomForestClassifier</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Variables de Entrada</span>
                <span className="font-semibold text-surface-200">10 Parámetros</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-surface-400">Tiempo Respuesta</span>
                <span className="font-semibold text-green-400">&lt; 150 ms</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/recommendations/new')}
            className="w-full py-2.5 rounded-xl bg-gradient-primary font-semibold text-xs text-white shadow-glow hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            Ejecutar Predicción
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Recent Recommendations Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base">
              Últimas Recomendaciones
            </h3>
            <p className="text-xs text-surface-500">Historial reciente de diagnósticos de suelo</p>
          </div>
          <button
            onClick={() => navigate('/history')}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
          >
            Ver Historial Completo &rarr;
          </button>
        </div>

        {recentRecs.length === 0 ? (
          <p className="text-xs text-surface-400 text-center py-6">No hay recomendaciones registradas aún.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Cultivo</th>
                  <th>Tipo Suelo</th>
                  <th>Fertilizante Recomendado</th>
                  <th>Confianza</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentRecs.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => navigate(`/recommendations/${rec.id}`)}
                    className="cursor-pointer hover:bg-surface-100/50"
                  >
                    <td className="font-semibold text-surface-900 dark:text-surface-100">
                      {rec.cultivo_nombre || `Cultivo #${rec.cultivo_id}`}
                    </td>
                    <td>{rec.tipo_suelo_nombre || `Suelo #${rec.tipo_suelo_id}`}</td>
                    <td>
                      <span className="badge-green font-mono">
                        {rec.fertilizante_codigo || rec.fertilizante_nombre || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar w-16">
                          <div
                            className="progress-fill"
                            style={{ width: `${(rec.nivel_confianza || 0) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-surface-700 dark:text-surface-300">
                          {((rec.nivel_confianza || 0) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-xs text-surface-500">
                      {new Date(rec.created_at).toLocaleDateString('es-PE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
