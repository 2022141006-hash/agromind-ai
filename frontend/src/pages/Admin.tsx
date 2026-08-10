import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Sprout, FlaskConical, Users, Plus, Edit2, Trash2, Save, X, ShieldCheck
} from 'lucide-react';
import { adminApi } from '../api';
import { Cultivo, Fertilizante, User } from '../types';
import { useToast } from '../components/common/Toast';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crops' | 'fertilizers' | 'users' | 'config'>('crops');
  const [crops, setCrops] = useState<Cultivo[]>([]);
  const [fertilizers, setFertilizers] = useState<Fertilizante[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for crop editing
  const [editingCrop, setEditingCrop] = useState<Partial<Cultivo> | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const toast = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'crops') setCrops(await adminApi.getCrops());
      else if (activeTab === 'fertilizers') setFertilizers(await adminApi.getFertilizers());
      else if (activeTab === 'users') setUsers(await adminApi.getUsers());
      else if (activeTab === 'config') setConfigs(await adminApi.getConfig());
    } catch (err) {
      toast.error('Error cargando datos del módulo administrador');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSaveCrop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop?.nombre) return;
    try {
      if (editingCrop.id) {
        await adminApi.updateCrop(editingCrop.id, editingCrop);
        toast.success('Cultivo actualizado');
      } else {
        await adminApi.createCrop(editingCrop);
        toast.success('Nuevo cultivo creado');
      }
      setIsCropModalOpen(false);
      setEditingCrop(null);
      loadData();
    } catch (err) {
      toast.error('Error guardando cultivo');
    }
  };

  const handleDeleteCrop = async (id: number) => {
    if (!window.confirm('¿Desactivar este cultivo?')) return;
    try {
      await adminApi.deleteCrop(id);
      toast.success('Cultivo desactivado');
      loadData();
    } catch (err) {
      toast.error('Error al desactivar');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary-600" />
            Panel de Administración AgroMind
          </h1>
          <p className="text-sm text-surface-500 mt-1">
            Gestión de catálogos maestros, usuarios, roles y parámetros de configuración
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-700 space-x-4">
        <button
          onClick={() => setActiveTab('crops')}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'crops'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <Sprout className="w-4 h-4" /> Cultivos ({crops.length})
        </button>

        <button
          onClick={() => setActiveTab('fertilizers')}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'fertilizers'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <FlaskConical className="w-4 h-4" /> Fertilizantes ({fertilizers.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <Users className="w-4 h-4" /> Usuarios ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('config')}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === 'config'
              ? 'border-primary-600 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-surface-500 hover:text-surface-700'
          }`}
        >
          <Settings className="w-4 h-4" /> Configuración
        </button>
      </div>

      {/* Tab Content */}
      <div className="card">
        {/* CROPS TAB */}
        {activeTab === 'crops' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-surface-900 dark:text-surface-100">Catálogo de Cultivos</h3>
              <button
                onClick={() => { setEditingCrop({ nombre: '', ph_optimo_min: 5.5, ph_optimo_max: 7.0 }); setIsCropModalOpen(true); }}
                className="btn-primary btn-sm flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Nuevo Cultivo
              </button>
            </div>

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Nombre Científico</th>
                    <th>Familia</th>
                    <th>pH Óptimo</th>
                    <th>Req. Nutricional</th>
                    <th className="text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {crops.map((c) => (
                    <tr key={c.id}>
                      <td className="font-semibold text-surface-900 dark:text-surface-100">{c.nombre}</td>
                      <td className="italic text-surface-500">{c.nombre_cientifico || '-'}</td>
                      <td>{c.familia || '-'}</td>
                      <td>{c.ph_optimo_min} - {c.ph_optimo_max}</td>
                      <td className="text-xs">{c.requerimiento_n || 'Balanceado'}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => { setEditingCrop(c); setIsCropModalOpen(true); }}
                            className="p-1 rounded text-surface-500 hover:text-primary-600"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCrop(c.id)}
                            className="p-1 rounded text-surface-500 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FERTILIZERS TAB */}
        {activeTab === 'fertilizers' && (
          <div className="space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100">Catálogo de Fertilizantes</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre Comercial</th>
                    <th>Tipo</th>
                    <th>N - P - K (%)</th>
                    <th>Fabricante</th>
                    <th>Precio Ref.</th>
                  </tr>
                </thead>
                <tbody>
                  {fertilizers.map((f) => (
                    <tr key={f.id}>
                      <td className="font-mono font-bold text-primary-600">{f.codigo}</td>
                      <td className="font-semibold text-surface-900 dark:text-surface-100">{f.nombre}</td>
                      <td>{f.tipo_nombre || 'Químico'}</td>
                      <td className="font-mono font-bold text-xs">
                        {f.concentracion_n}% - {f.concentracion_p}% - {f.concentracion_k}%
                      </td>
                      <td>{f.fabricante_nombre || '-'}</td>
                      <td className="text-xs">
                        {f.precio_referencia ? `S/ ${f.precio_referencia} / ${f.unidad_precio}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100">Usuarios Registrados</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Organización</th>
                    <th>Último Acceso</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="font-semibold text-surface-900 dark:text-surface-100">
                        {u.nombre} {u.apellido || ''}
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge-blue capitalize">{u.rol}</span>
                      </td>
                      <td>{u.organizacion || '-'}</td>
                      <td className="text-xs text-surface-500">
                        {u.id ? 'Reciente' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONFIG TAB */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            <h3 className="font-bold text-surface-900 dark:text-surface-100">Parámetros del Sistema</h3>
            <div className="space-y-3">
              {configs.map((c) => (
                <div key={c.clave} className="flex items-center justify-between p-3 rounded-xl border bg-surface-50 dark:bg-surface-900">
                  <div>
                    <p className="text-xs font-mono font-bold text-surface-800 dark:text-surface-200">{c.clave}</p>
                    <p className="text-[11px] text-surface-500">{c.descripcion}</p>
                  </div>
                  <input
                    type="text"
                    defaultValue={c.valor}
                    disabled={!c.editable}
                    className="input max-w-xs text-xs font-mono"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Crop Modal */}
      {isCropModalOpen && editingCrop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-surface-900 dark:text-surface-100">
                {editingCrop.id ? 'Editar Cultivo' : 'Nuevo Cultivo'}
              </h3>
              <button onClick={() => setIsCropModalOpen(false)} className="text-surface-400 hover:text-surface-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCrop} className="space-y-3">
              <div>
                <label className="label">Nombre del Cultivo</label>
                <input
                  type="text"
                  required
                  value={editingCrop.nombre || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, nombre: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Nombre Científico</label>
                <input
                  type="text"
                  value={editingCrop.nombre_cientifico || ''}
                  onChange={(e) => setEditingCrop({ ...editingCrop, nombre_cientifico: e.target.value })}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">pH Mínimo</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ph_optimo_min || 5.5}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ph_optimo_min: Number(e.target.value) })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">pH Máximo</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingCrop.ph_optimo_max || 7.0}
                    onChange={(e) => setEditingCrop({ ...editingCrop, ph_optimo_max: Number(e.target.value) })}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsCropModalOpen(false)} className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
