import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../api';
import { useAuthStore } from '../store';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@agromind.ai');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      setAuth(res.user, res.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface-800/80 border border-surface-700 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow mb-4">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AgroMind AI</h1>
          <p className="text-xs text-surface-400 mt-1">Recomendación Inteligente de Fertilizantes</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@agromind.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-surface-700 bg-surface-900/60 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-300 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-surface-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-surface-700 bg-surface-900/60 text-white placeholder-surface-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold text-sm shadow-glow hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? 'Iniciando sesión...' : 'Ingresar al Sistema'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credential Helper */}
        <div className="mt-8 p-3 rounded-xl bg-surface-900/40 border border-surface-700/50 text-[11px] text-surface-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-surface-300 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
            Acceso de prueba rápida:
          </div>
          <p><strong className="text-surface-300">Admin:</strong> admin@agromind.ai | admin123</p>
          <p><strong className="text-surface-300">Agrónomo:</strong> agronomo@agromind.ai | agro123</p>
        </div>
      </motion.div>
    </div>
  );
};
