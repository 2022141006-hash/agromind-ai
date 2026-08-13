import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FlaskConical, History, BarChart3, Settings,
  ChevronLeft, ChevronRight, Leaf, LogOut, User, Moon, Sun,
  Sprout, Users, ChevronDown
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../../store';
import { authApi } from '../../api';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  badge?: number;
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/recommendations/new', label: 'Nueva Recomendación', icon: FlaskConical },
  { to: '/history', label: 'Historial', icon: History },
  { to: '/reports', label: 'Reportes', icon: BarChart3, roles: ['administrador', 'agronomo'] },
  { to: '/admin', label: 'Administración', icon: Settings, roles: ['administrador'] },
];

const normalizeRole = (rol?: string): string => {
  const r = (rol || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const aliases: Record<string, string> = { admin: 'administrador', usuario: 'agricultor' };
  return aliases[r] || r;
};

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, darkMode, toggleDarkMode } = useUIStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  const userRole = normalizeRole(user?.rol);

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed top-0 left-0 h-full bg-white dark:bg-surface-900 border-r border-surface-100 dark:border-surface-800 flex flex-col z-30 overflow-hidden shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-100 dark:border-surface-800 flex-shrink-0">
        <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">AgroMind AI</p>
              <p className="text-[10px] text-surface-500 font-medium">Sistema de Fertilización</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto no-scrollbar">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `sidebar-link group relative ${isActive ? 'active' : ''} ${sidebarCollapsed ? 'justify-center px-2' : ''}`
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface-900 text-white text-xs rounded-lg
                              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 border-t border-surface-100 dark:border-surface-800 pt-3 space-y-2 flex-shrink-0">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`sidebar-link w-full ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
          title={sidebarCollapsed ? (darkMode ? 'Modo claro' : 'Modo oscuro') : undefined}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {darkMode ? 'Modo claro' : 'Modo oscuro'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`sidebar-link w-full ${sidebarCollapsed ? 'justify-center px-2' : 'justify-between'}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="text-xs font-semibold text-surface-800 dark:text-surface-200 leading-tight truncate max-w-[120px]">
                      {user?.nombre}
                    </p>
                    <p className="text-[10px] text-surface-500 capitalize">{user?.rol}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {!sidebarCollapsed && <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />}
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`absolute ${sidebarCollapsed ? 'left-full ml-2 bottom-0' : 'bottom-full mb-1 left-0 right-0'} 
                            bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 
                            rounded-xl shadow-card-hover overflow-hidden z-50`}
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 
                             dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3.5 w-7 h-7 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 
                   rounded-full flex items-center justify-center shadow-sm hover:shadow-card 
                   text-surface-500 hover:text-primary-600 transition-all z-40"
        title={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </motion.aside>
  );
};
