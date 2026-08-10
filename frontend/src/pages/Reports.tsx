import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell
} from 'recharts';
import { adminApi } from '../api';

const COLORS = ['#16A34A', '#22C55E', '#84CC16', '#EAB308', '#3B82F6', '#6366F1', '#EC4899', '#8B5CF6'];

export const Reports: React.FC = () => {
  const [byCrop, setByCrop] = useState<any[]>([]);
  const [byFertilizer, setByFertilizer] = useState<any[]>([]);
  const [bySoil, setBySoil] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [c, f, s] = await Promise.all([
          adminApi.getReportByCrop(),
          adminApi.getReportByFertilizer(),
          adminApi.getReportBySoil(),
        ]);
        setByCrop(c);
        setByFertilizer(f);
        setBySoil(s);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            Reportes Estadísticos Agronómicos
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Análisis agregado de distribución de cultivos, fertilizantes recomendados y tipos de suelo
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-surface-400">Cargando reportes agregados...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Demanda de Fertilizantes */}
          <div className="card space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-primary-600" />
              Fertilizantes Más Recomendados por la IA
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byFertilizer} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="codigo" stroke="#94A3B8" fontSize={11} angle={-30} textAnchor="end" />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="total" fill="#16A34A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Recomendaciones por Cultivo */}
          <div className="card space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary-600" />
              Distribución de Análisis por Cultivo
            </h3>
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCrop}
                    dataKey="total"
                    nameKey="cultivo"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={45}
                    paddingAngle={3}
                    label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {byCrop.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
