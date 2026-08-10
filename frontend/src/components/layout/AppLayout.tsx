import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { useUIStore, useAuthStore } from '../../store';
import { Bell, Search, User } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed } = useUIStore();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <motion.div
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-w-0 min-h-screen"
      >
        {/* Top Navbar Header */}
        <header className="h-16 bg-white/80 dark:bg-surface-900/80 backdrop-blur-md border-b border-surface-100 dark:border-surface-800 sticky top-0 z-20 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar recomendaciones, cultivos..."
                className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 relative">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-primary-500 rounded-full absolute top-2 right-2"></span>
            </button>
            <div className="h-4 w-px bg-surface-200 dark:bg-surface-700 mx-1"></div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                {user?.nombre?.[0] || 'U'}
              </div>
              <span className="text-xs font-semibold hidden sm:inline text-surface-700 dark:text-surface-300">
                {user?.nombre} {user?.apellido || ''}
              </span>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};
