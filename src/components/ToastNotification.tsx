/**
 * Toast Notification System
 * 
 * A comprehensive toast notification system for API feedback,
 * success notifications, error notifications, and progress updates.
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Types and Interfaces
// ============================================================================

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  PROGRESS = 'progress'
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  persistent?: boolean;
  timestamp: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
}

// ============================================================================
// Toast Context
// ============================================================================

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// ============================================================================
// Individual Toast Component
// ============================================================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Toast>) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {

  useEffect(() => {
    if (toast.duration && !toast.persistent) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, toast.persistent, onRemove]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case ToastType.SUCCESS:
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case ToastType.ERROR:
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case ToastType.WARNING:
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case ToastType.INFO:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case ToastType.PROGRESS:
        return (
          <svg className="w-5 h-5 text-primaryOrange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getToastColor = (type: ToastType) => {
    switch (type) {
      case ToastType.SUCCESS:
        return 'border-green-500/30 bg-green-500/10';
      case ToastType.ERROR:
        return 'border-red-500/30 bg-red-500/10';
      case ToastType.WARNING:
        return 'border-yellow-500/30 bg-yellow-500/10';
      case ToastType.INFO:
        return 'border-blue-500/30 bg-blue-500/10';
      case ToastType.PROGRESS:
        return 'border-primaryOrange-500/30 bg-primaryOrange-500/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      layout
      className={`glass-card p-4 rounded-lg border ${getToastColor(toast.type)} max-w-sm w-full`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getToastIcon(toast.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">
            {toast.title}
          </h4>
          
          <p className="text-sm text-gray-300 mt-1">
            {toast.message}
          </p>
          
          {/* Progress Bar */}
          {toast.type === ToastType.PROGRESS && toast.progress && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">
                  {toast.progress.current} / {toast.progress.total}
                </span>
                <span className="text-xs text-primaryOrange-400">
                  {toast.progress.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-primaryOrange-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${toast.progress.percentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
          
          {/* Action Button */}
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-3 text-sm text-primaryOrange-400 hover:text-primaryOrange-300 font-medium"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// Toast Container Component
// ============================================================================

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            onUpdate={() => {}} // Will be implemented in context
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// Toast Provider Component
// ============================================================================

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      timestamp: Date.now()
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const updateToast = useCallback((id: string, updates: Partial<Toast>) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ));
  }, []);

  const value: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    updateToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// ============================================================================
// Hook for Common Toast Patterns
// ============================================================================

export function useToastNotifications() {
  const { addToast, updateToast, removeToast } = useToast();

  const showSuccess = useCallback((title: string, message: string, action?: { label: string; onClick: () => void }) => {
    return addToast({
      type: ToastType.SUCCESS,
      title,
      message,
      duration: 5000,
      action
    });
  }, [addToast]);

  const showError = useCallback((title: string, message: string, action?: { label: string; onClick: () => void }) => {
    return addToast({
      type: ToastType.ERROR,
      title,
      message,
      duration: 8000,
      persistent: true,
      action
    });
  }, [addToast]);

  const showWarning = useCallback((title: string, message: string, action?: { label: string; onClick: () => void }) => {
    return addToast({
      type: ToastType.WARNING,
      title,
      message,
      duration: 6000,
      action
    });
  }, [addToast]);

  const showInfo = useCallback((title: string, message: string, action?: { label: string; onClick: () => void }) => {
    return addToast({
      type: ToastType.INFO,
      title,
      message,
      duration: 4000,
      action
    });
  }, [addToast]);

  const showProgress = useCallback((title: string, message: string, current: number, total: number) => {
    const percentage = Math.round((current / total) * 100);
    
    return addToast({
      type: ToastType.PROGRESS,
      title,
      message,
      progress: { current, total, percentage },
      persistent: true
    });
  }, [addToast]);

  const updateProgress = useCallback((id: string, current: number, total: number) => {
    const percentage = Math.round((current / total) * 100);
    updateToast(id, {
      progress: { current, total, percentage }
    });
  }, [updateToast]);

  const completeProgress = useCallback((id: string, successMessage: string) => {
    updateToast(id, {
      type: ToastType.SUCCESS,
      title: 'Completed',
      message: successMessage,
      progress: undefined,
      persistent: false,
      duration: 3000
    });
    
    // Auto-remove after completion
    setTimeout(() => removeToast(id), 3000);
  }, [updateToast, removeToast]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showProgress,
    updateProgress,
    completeProgress
  };
}

export default ToastProvider;
