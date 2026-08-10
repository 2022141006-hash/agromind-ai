import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, Filter, Trash2, Eye, Calendar, ChevronLeft, ChevronRight, FlaskConical
} from 'lucide-react';
import { recommendationsApi, adminApi } from '../api';
import { Recommendation, Cultivo } from '../types';
import { useToast } from '../components/common/Toast';

export const History: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [crops, setCrops] = useState<Cultivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, cropsData] = await Promise.all([
        recommendationsApi.getAll({
          page,
          limit: 10,
          search,
          cultivo_id: selectedCrop ? Number(selectedCrop) : undefined,
        }),
        adminApi.getCrops().catch(() => []),
      ]);
      setRecommendations(recsData.data);
      setTotalPages(recsData.pagination.totalPages);
      setCrops(cropsData);
    } catch (err) {
      toast.error('Error cargando historial');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, selectedCrop]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('¿Está seguro de eliminar esta recomendación del historial?')) return;
    try {
      await recommendationsApi.delete(id);
      toast.success('Recomendación eliminada');
      loadData();
    } catch (err) {
      toast.error('Error al eliminar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-primary-600" />
            Historial de Análisis y Recomendaciones
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Registro completo de diagnósticos de suelo ejecutados por la IA
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por cultivo, fertilizante o suelo..."
              className="input pl-9"
            />
          </div>

          <div className="w-full sm:w-56">
            <select
              value={selectedCrop}
              onChange={(e) => { setSelectedCrop(e.target.value); setPage(1); }}
              className="select"
            >
              <option value="">Todos los cultivos</option>
              {crops.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary cursor-pointer">
            Buscar
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-surface-400">Cargando historial...</div>
        ) : recommendations.length === 0 ? (
          <div className="p-12 text-center text-surface-400">No se encontraron registros de recomendación.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cultivo</th>
                  <th>Tipo Suelo</th>
                  <th>Fertilizante IA</th>
                  <th>Dosis Sugerida</th>
                  <th>Confianza</th>
                  <th>Fecha</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => navigate(`/recommendations/${rec.id}`)}
                    className="cursor-pointer hover:bg-surface-100/50"
                  >
                    <td className="font-mono text-xs text-surface-400">#{rec.id}</td>
                    <td className="font-semibold text-surface-900 dark:text-surface-100">
                      {rec.cultivo_nombre || `Cultivo #${rec.cultivo_id}`}
                    </td>
                    <td>{rec.tipo_suelo_nombre || `Suelo #${rec.tipo_suelo_id}`}</td>
                    <td>
                      <span className="badge-green font-mono">
                        {rec.fertilizante_codigo || rec.fertilizante_nombre || 'N/A'}
                      </span>
                    </td>
                    <td className="font-semibold">
                      {rec.cantidad_recomendada} {rec.unidad_cantidad}
                    </td>
                    <td>
                      <span className="text-xs font-bold text-surface-700 dark:text-surface-300">
                        {((rec.nivel_confianza || 0) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="text-xs text-surface-500">
                      {new Date(rec.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/recommendations/${rec.id}`); }}
                          className="p-1.5 rounded-lg text-surface-500 hover:text-primary-600 hover:bg-primary-50"
                          title="Ver Ficha"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(rec.id, e)}
                          className="p-1.5 rounded-lg text-surface-500 hover:text-red-600 hover:bg-red-50"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-surface-100 dark:border-surface-700">
            <span className="text-xs text-surface-500">
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-ghost btn-sm disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-ghost btn-sm disabled:opacity-30"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
