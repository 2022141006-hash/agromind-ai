import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: { icon: CheckCircle, bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200', iconColor: 'text-green-500' },
  error: { icon: AlertCircle, bg: 'bg-red-50 dark:bg-red-900/30', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200', iconColor: 'text-red-500' },
  warning: { icon: AlertTriangle, bg: 'bg-yellow-50 dark:bg-yellow-900/30', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200', iconColor: 'text-yellow-500' },
  info: { icon: Info, bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200', iconColor: 'text-blue-500' },
};

export const Toast: React.FC<ToastProps> = ({ id, type, title, message, onClose }) => {
  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-card-hover min-w-[320px] max-w-md
                  ${config.bg} ${config.border}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold ${config.text}`}>{title}</p>
        {message && <p className={`text-xs mt-0.5 ${config.text} opacity-80`}>{message}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${config.iconColor} hover:opacity-60 transition-opacity`}
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

// ── Toast Container ─────────────────────────────────────────
interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </AnimatePresence>
  </div>
);

// ── useToast Hook ───────────────────────────────────────────
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    removeToast,
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
  };
};
